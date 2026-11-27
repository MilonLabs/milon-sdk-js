import { assertBytes, bytesToBs58, bytesToHex, concatBytes, hexToBytes, u32ToBeBytes, u64ToBeBytes, type BytesLike } from "./bytes";
import { hash32 } from "./hash";
import { PublicKey, type PublicKeyLike } from "./public-key";
import type { Deserializer as BcsDeserializer } from "../bcs/deserializer";
import type { Serializer as BcsSerializer } from "../bcs/serializer";

export type AddressLike = Address | BytesLike;
export type VirAddressLike = VirAddress | Address | BytesLike;

const SEED_ADDRESS_DOMAIN = new TextEncoder().encode("milon.seed-address.v3");
const SEED_ADDRESS_32_DOMAIN = new TextEncoder().encode("milon.seed-address.v2");
const PK_ADDRESS_DOMAIN = new TextEncoder().encode("milon.address.pk.v1");
const PK_ADDRESS_RETRY_DOMAIN = new TextEncoder().encode("milon.address.pk.retry.v1");
const KEYLESS_ADDRESS_DOMAIN = new TextEncoder().encode("milon.address.keyless.v1");
const CONTRACT_APP_ID = 0xff;

export class Address {
  static LENGTH = 20;
  readonly bytes: Uint8Array;

  static zero(): Address {
    return new Address(new Uint8Array(Address.LENGTH));
  }

  static from(value: AddressLike): Address {
    return value instanceof Address ? value : new Address(value);
  }

  static fromPublicKey(publicKey: PublicKeyLike): Address {
    const pk = PublicKey.from(publicKey);
    const domain = pk.kind === "KEYLESS_DERIVED"
      ? KEYLESS_ADDRESS_DOMAIN
      : PK_ADDRESS_DOMAIN;
    for (let counter = 0n; ; counter += 1n) {
      const digest = counter === 0n
        ? hash32(domain, [pk.bytes])
        : hash32(PK_ADDRESS_RETRY_DOMAIN, [domain, pk.bytes, u64ToBeBytes(counter)]);
      const address = new Address(digest.slice(0, Address.LENGTH));
      if (!address.isAppReserved()) return address;
    }
  }

  static fromEd25519PublicKey(publicKey: PublicKeyLike): Address {
    return Address.fromPublicKey(publicKey);
  }

  static fromAppSeed(appId: number, seed: bigint | number): Address {
    if (!Number.isInteger(appId) || appId < 0 || appId > 0xff) {
      throw new RangeError("appId must be a u8");
    }
    const normalizedSeed = BigInt(seed);
    if (normalizedSeed < 0n || normalizedSeed > 0xffff_ffff_ffff_ffffn) throw new RangeError("seed must be a u64");
    const appIdBytes = new Uint8Array([appId]);
    const seedBytes = u64ToBeBytes(normalizedSeed);
    const checksum = hash32(SEED_ADDRESS_DOMAIN, [appIdBytes, seedBytes]);
    return new Address(concatBytes(appIdBytes, seedBytes, checksum.slice(0, 11)));
  }

  static fromAppSeed32(appId: number, seed: BytesLike): Address {
    if (!Number.isInteger(appId) || appId < 0 || appId > 0xff) throw new RangeError("appId must be a u8");
    return new Address(hash32(SEED_ADDRESS_32_DOMAIN, [new Uint8Array([appId]), assertBytes(seed, 32, "seed")]).slice(0, Address.LENGTH));
  }

  appSeed(): { appId: number; seed: bigint } | undefined {
    const appId = this.bytes[0]!;
    const seed = new DataView(this.bytes.buffer, this.bytes.byteOffset + 1, 8).getBigUint64(0, false);
    return this.equals(Address.fromAppSeed(appId, seed)) ? { appId, seed } : undefined;
  }

  isAppReserved(): boolean {
    return this.bytes[0] === CONTRACT_APP_ID || this.appSeed() !== undefined;
  }

  static fromHex(hex: string): Address {
    return new Address(hexToBytes(hex));
  }

  constructor(bytes: BytesLike) {
    this.bytes = assertBytes(bytes, Address.LENGTH, "Address");
  }

  serialize(serializer: BcsSerializer): void {
    serializer.serializeFixedBytes(this.bytes);
  }

  static deserialize(deserializer: BcsDeserializer): Address {
    return new Address(deserializer.deserializeFixedBytes(Address.LENGTH));
  }

  equals(other: AddressLike): boolean {
    const rhs = Address.from(other).bytes;
    return this.bytes.every((byte, index) => byte === rhs[index]);
  }

  toHex(prefix = false): string {
    return `${prefix ? "0x" : ""}${bytesToHex(this.bytes)}`;
  }

  toBase58(): string {
    return bytesToBs58(this.bytes);
  }

  toJSON(): string {
    return this.toHex();
  }
}

export class VirAddress {
  static LENGTH = 24;
  readonly primary: Address;
  readonly no: number;

  static from(value: VirAddressLike): VirAddress {
    if (value instanceof VirAddress) return value;
    if (value instanceof Address) return new VirAddress(value, 0);
    const bytes = assertBytes(value, VirAddress.LENGTH, "VirAddress");
    const no = new DataView(bytes.buffer, bytes.byteOffset + 20, 4).getUint32(0, false);
    return new VirAddress(new Address(bytes.slice(0, 20)), no);
  }

  static fromPublicKey(publicKey: PublicKeyLike, no = 0): VirAddress {
    return new VirAddress(Address.fromPublicKey(publicKey), no);
  }

  static fromEd25519PublicKey(publicKey: PublicKeyLike, no = 0): VirAddress {
    return VirAddress.fromPublicKey(publicKey, no);
  }

  constructor(primary: AddressLike, no = 0) {
    this.primary = Address.from(primary);
    this.no = Number(no);
    if (!Number.isInteger(this.no) || this.no < 0 || this.no > 0xffffffff) {
      throw new RangeError("VirAddress no must be a u32");
    }
  }

  serialize(serializer: BcsSerializer): void {
    serializer.serializeFixedBytes(this.bytes);
  }

  static deserialize(deserializer: BcsDeserializer): VirAddress {
    return VirAddress.from(deserializer.deserializeFixedBytes(VirAddress.LENGTH));
  }

  get bytes(): Uint8Array {
    return concatBytes(this.primary.bytes, u32ToBeBytes(this.no));
  }

  asSigner(): Signer {
    return new Signer(this.primary);
  }

  toJSON(): { primary: string; no: number } {
    return { primary: this.primary.toJSON(), no: this.no };
  }
}

export class Signer {
  readonly address: Address;

  constructor(address: AddressLike) {
    this.address = Address.from(address);
  }

  toJSON(): string {
    return this.address.toJSON();
  }
}

export class VirSigner {
  readonly address: VirAddress;

  constructor(address: VirAddressLike) {
    this.address = VirAddress.from(address);
  }

  asSigner(): Signer {
    return this.address.asSigner();
  }

  toJSON(): { primary: string; no: number } {
    return this.address.toJSON();
  }
}
