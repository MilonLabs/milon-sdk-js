import { assertBytes, bytesToBs58, bytesToHex, hexToBytes, toBytes, type BytesLike } from "./bytes";
import type { Deserializer as BcsDeserializer } from "../bcs/deserializer";
import type { Serializer as BcsSerializer } from "../bcs/serializer";

export const PublicKeyKind = Object.freeze({
  ED25519: "ED25519",
  SECP256K1: "SECP256K1",
  BLS12381: "BLS12381",
  FN_DSA512: "FN_DSA512",
  KEYLESS_DERIVED: "KEYLESS_DERIVED"
});
export type PublicKeyKind = typeof PublicKeyKind[keyof typeof PublicKeyKind];
export type PublicKeyLike = PublicKey | BytesLike;

const LENGTH_TO_KIND = new Map<number, PublicKeyKind>([
  [32, PublicKeyKind.ED25519],
  [33, PublicKeyKind.SECP256K1],
  [48, PublicKeyKind.BLS12381],
  [897, PublicKeyKind.FN_DSA512]
]);

export class PublicKey {
  readonly kind: PublicKeyKind;
  readonly bytes: Uint8Array;

  static from(value: PublicKeyLike): PublicKey {
    if (value instanceof PublicKey) return value;
    if (typeof value === "string") return PublicKey.fromHex(value);
    return PublicKey.fromBytes(value);
  }

  static fromBytes(bytes: BytesLike): PublicKey {
    const raw = toBytes(bytes);
    const kind = LENGTH_TO_KIND.get(raw.length);
    if (!kind) throw new TypeError("invalid public key length");
    return new PublicKey(kind, raw);
  }

  /** Creates the executor-only Keyless derived pseudo public key. */
  static keylessDerived(seed: BytesLike): PublicKey {
    return new PublicKey(PublicKeyKind.KEYLESS_DERIVED, seed);
  }

  static fromHex(hex: string): PublicKey {
    return PublicKey.fromBytes(hexToBytes(hex));
  }

  constructor(kind: PublicKeyKind, bytes: BytesLike) {
    const expectedLength = kind === PublicKeyKind.KEYLESS_DERIVED
      ? 32
      : [...LENGTH_TO_KIND.entries()].find(([, value]) => value === kind)?.[0];
    if (!expectedLength) throw new TypeError("invalid public key kind");
    this.kind = kind;
    this.bytes = assertBytes(bytes, expectedLength, "PublicKey");
  }

  serialize(serializer: BcsSerializer): void {
    serializer.serializeBytes(this.bytes);
  }

  static deserialize(deserializer: BcsDeserializer): PublicKey {
    return PublicKey.fromBytes(deserializer.deserializeBytes());
  }

  toHex(prefix = false): string {
    return `${prefix ? "0x" : ""}${bytesToHex(this.bytes)}`;
  }

  toBs58(): string {
    return bytesToBs58(this.bytes);
  }

  toJSON(): { kind: PublicKeyKind; hex: string } {
    return { kind: this.kind, hex: this.toHex() };
  }
}
