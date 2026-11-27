import { hkdf } from "@noble/hashes/hkdf.js";
import { hmac } from "@noble/hashes/hmac.js";
import { sha256, sha512 } from "@noble/hashes/sha2.js";
import { Address } from "./address";
import { concatBytes, u32ToBeBytes } from "./bytes";
import { normalizeMnemonic, mnemonicToSeed } from "./mnemonic";
import { SecretKey } from "./secret-key";
import type { PublicKey } from "./public-key";
import { keygenFromSeed } from "../vendor/fndsa.js";

export const HARDENED_OFFSET = 0x80000000;
export const ED25519_SLIP10_SEED = "ed25519 seed";
export const MILON_COIN_TYPE = 1111;
export const MILON_CLASSICAL_SUBPATH = 0;
export const MILON_PQ_SUBPATH = 1;
export const FN_DSA512_HKDF_INFO_PREFIX = new TextEncoder().encode("Milon-fn-dsa512-v1");

const PATH_SEGMENT_REGEX = /^[0-9]+(?:'|H)$/;
const FN_DSA512_LOGN = 9;
const textEncoder = new TextEncoder();

export interface DerivedKeys {
  key: Uint8Array;
  chainCode: Uint8Array;
}

export interface DerivedMilonAccount {
  derivationPath: string;
  secretKey: SecretKey;
  publicKey: PublicKey;
  address: Address;
}

function invariant(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new TypeError(message);
  }
}

export function createMilonDerivationPath(accountIndex: number, subpath = MILON_PQ_SUBPATH): string {
  invariant(Number.isInteger(accountIndex) && accountIndex >= 0, "accountIndex must be a non-negative integer");
  invariant(Number.isInteger(subpath) && subpath >= 0, "subpath must be a non-negative integer");
  return `m/44'/${MILON_COIN_TYPE}'/${accountIndex}'/${subpath}'`;
}

export function createMilonClassicalDerivationPath(accountIndex: number): string {
  return createMilonDerivationPath(accountIndex, MILON_CLASSICAL_SUBPATH);
}

export function createMilonPqDerivationPath(accountIndex: number): string {
  return createMilonDerivationPath(accountIndex, MILON_PQ_SUBPATH);
}

export function isValidHardenedPath(path: string): boolean {
  const segments = path.split("/");
  return segments.length >= 1 && segments[0] === "m" && segments.slice(1).every((segment) => PATH_SEGMENT_REGEX.test(segment));
}

export function splitPath(path: string): string[] {
  return path
    .split("/")
    .slice(1)
    .map((segment) => segment.replace(/['H]/g, ""));
}

export function getMilonDerivationSubpath(path: string): number {
  invariant(isValidHardenedPath(path), `Invalid derivation path: ${path}`);
  const segments = splitPath(path);
  invariant(segments.length > 0, `Invalid Milon account derivation path: ${path}`);
  const subpath = Number.parseInt(segments[segments.length - 1] ?? "", 10);
  invariant(Number.isInteger(subpath), `Invalid Milon account derivation subpath: ${path}`);
  return subpath;
}

export function deriveKey(hashSeed: Uint8Array | string, data: Uint8Array | string): DerivedKeys {
  const digest = hmac(sha512, toBytes(hashSeed), toBytes(data));
  return {
    key: digest.slice(0, 32),
    chainCode: digest.slice(32),
  };
}

export function CKDPriv(parent: DerivedKeys, index: number): DerivedKeys {
  const indexBytes = u32ToBeBytes(index);
  return deriveKey(parent.chainCode, concatBytes(Uint8Array.of(0), parent.key, indexBytes));
}

export function deriveEd25519PrivateKeyFromSeed(path: string, seed: Uint8Array): Uint8Array {
  invariant(isValidHardenedPath(path), `Invalid derivation path: ${path}`);
  const master = deriveKey(ED25519_SLIP10_SEED, seed);
  const child = splitPath(path)
    .map((segment) => Number.parseInt(segment, 10))
    .reduce<DerivedKeys>(
      (parent, segment) => CKDPriv(parent, segment + HARDENED_OFFSET),
      master,
    );
  return child.key;
}

export function deriveEd25519PrivateKeyFromMnemonic(path: string, mnemonic: string, passphrase = ""): Uint8Array {
  return deriveEd25519PrivateKeyFromSeed(path, mnemonicToSeed(normalizeMnemonic(mnemonic), passphrase));
}

export function deriveFnDsa512EntropyFromSeed(path: string, seed: Uint8Array): Uint8Array {
  invariant(seed.length === 64, `BIP39 seed must be 64 bytes, got ${seed.length}`);
  invariant(isValidHardenedPath(path), `Invalid derivation path: ${path}`);
  return hkdf(
    sha256,
    concatBytes(FN_DSA512_HKDF_INFO_PREFIX, textEncoder.encode(path)),
    seed.slice(0, 32),
    new Uint8Array(),
    32,
  );
}

export function deriveFnDsa512SecretKeyFromEntropy(entropy: Uint8Array): Uint8Array {
  return keygenFromSeed(FN_DSA512_LOGN, entropy).sign_key;
}

export function deriveFnDsa512SecretKeyFromSeed(path: string, seed: Uint8Array): Uint8Array {
  return deriveFnDsa512SecretKeyFromEntropy(deriveFnDsa512EntropyFromSeed(path, seed));
}

export function deriveFnDsa512SecretKeyFromMnemonic(path: string, mnemonic: string, passphrase = ""): Uint8Array {
  return deriveFnDsa512SecretKeyFromSeed(path, mnemonicToSeed(normalizeMnemonic(mnemonic), passphrase));
}

export async function deriveMilonAccountFromDerivationPath(
  path: string,
  mnemonic: string,
  passphrase = "",
): Promise<DerivedMilonAccount> {
  const subpath = getMilonDerivationSubpath(path);
  if (subpath === MILON_CLASSICAL_SUBPATH) {
    return deriveFromSecretKey(path, SecretKey.fromBytes(
      deriveEd25519PrivateKeyFromMnemonic(path, mnemonic, passphrase),
    ), "ed25519");
  }
  if (subpath === MILON_PQ_SUBPATH) {
    return deriveFromSecretKey(path, SecretKey.fromBytes(
      deriveFnDsa512SecretKeyFromMnemonic(path, mnemonic, passphrase),
    ), "fn_dsa512");
  }
  throw new TypeError(`Unsupported Milon account derivation subpath: ${subpath}`);
}

export async function deriveMilonAccountFromMnemonic(
  accountIndex: number,
  mnemonic: string,
  passphrase = "",
): Promise<DerivedMilonAccount> {
  return deriveMilonPqAccountFromMnemonic(accountIndex, mnemonic, passphrase);
}

export async function deriveMilonClassicalAccountFromMnemonic(
  accountIndex: number,
  mnemonic: string,
  passphrase = "",
): Promise<DerivedMilonAccount> {
  return deriveMilonAccountFromDerivationPath(
    createMilonClassicalDerivationPath(accountIndex),
    mnemonic,
    passphrase,
  );
}

export async function deriveMilonPqAccountFromMnemonic(
  accountIndex: number,
  mnemonic: string,
  passphrase = "",
): Promise<DerivedMilonAccount> {
  return deriveMilonAccountFromDerivationPath(
    createMilonPqDerivationPath(accountIndex),
    mnemonic,
    passphrase,
  );
}

export async function deriveMilonAddressFromDerivationPath(
  path: string,
  mnemonic: string,
  passphrase = "",
): Promise<Address> {
  return (await deriveMilonAccountFromDerivationPath(path, mnemonic, passphrase)).address;
}

export async function deriveMilonAddressFromMnemonic(
  accountIndex: number,
  mnemonic: string,
  passphrase = "",
): Promise<Address> {
  return (await deriveMilonAccountFromMnemonic(accountIndex, mnemonic, passphrase)).address;
}

export async function deriveMilonClassicalAddressFromMnemonic(
  accountIndex: number,
  mnemonic: string,
  passphrase = "",
): Promise<Address> {
  return (await deriveMilonClassicalAccountFromMnemonic(accountIndex, mnemonic, passphrase)).address;
}

export async function deriveMilonPqAddressFromMnemonic(
  accountIndex: number,
  mnemonic: string,
  passphrase = "",
): Promise<Address> {
  return (await deriveMilonPqAccountFromMnemonic(accountIndex, mnemonic, passphrase)).address;
}

function toBytes(input: Uint8Array | string): Uint8Array {
  return typeof input === "string" ? textEncoder.encode(input) : input;
}

async function deriveFromSecretKey(
  derivationPath: string,
  secretKey: SecretKey,
  curve: "ed25519" | "fn_dsa512",
): Promise<DerivedMilonAccount> {
  const publicKey = curve === "ed25519"
    ? await secretKey.ed25519Public()
    : await secretKey.fnDsa512Public();
  return {
    derivationPath,
    secretKey,
    publicKey,
    address: Address.fromPublicKey(publicKey),
  };
}
