import { pbkdf2 } from "@noble/hashes/pbkdf2.js";
import { sha512 } from "@noble/hashes/sha2.js";

function assertMnemonic(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new TypeError(message);
  }
}

export function normalizeMnemonic(mnemonic: string): string {
  assertMnemonic(typeof mnemonic === "string", "mnemonic must be a string");
  return mnemonic
    .trim()
    .split(/\s+/)
    .map((part) => part.toLowerCase())
    .join(" ");
}

export function validateMnemonic24(mnemonic: string): boolean {
  const normalized = normalizeMnemonic(mnemonic);
  const words = normalized.length === 0 ? [] : normalized.split(" ");
  return words.length === 24 && words.every((word) => /^[a-z]+$/.test(word));
}

export function mnemonicToSeed(mnemonic: string, passphrase = ""): Uint8Array {
  const normalized = normalizeMnemonic(mnemonic);
  assertMnemonic(normalized.length > 0, "mnemonic must not be empty");
  return pbkdf2(
    sha512,
    new TextEncoder().encode(normalized),
    new TextEncoder().encode(`mnemonic${passphrase}`),
    { c: 2048, dkLen: 64 },
  );
}
