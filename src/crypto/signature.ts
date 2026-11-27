import { assertBytes, bytesToBs58, bytesToHex, hexToBytes, toBytes, type BytesLike } from "./bytes";
import type { Deserializer as BcsDeserializer } from "../bcs/deserializer";
import type { Serializer as BcsSerializer } from "../bcs/serializer";

export const SignatureKind = Object.freeze({
  ED25519: "ED25519",
  SECP256K1: "SECP256K1",
  BLS12381: "BLS12381",
  FN_DSA512: "FN_DSA512"
});
export type SignatureKind = typeof SignatureKind[keyof typeof SignatureKind];
export type SignatureLike = Signature | BytesLike;

const LENGTH_TO_KIND = new Map<number, SignatureKind>([
  [64, SignatureKind.ED25519],
  [65, SignatureKind.SECP256K1],
  [96, SignatureKind.BLS12381],
  [666, SignatureKind.FN_DSA512]
]);

export class Signature {
  readonly kind: SignatureKind;
  readonly bytes: Uint8Array;

  static from(value: SignatureLike): Signature {
    if (value instanceof Signature) return value;
    if (typeof value === "string") return Signature.fromHex(value);
    return Signature.fromBytes(value);
  }

  static fromBytes(bytes: BytesLike): Signature {
    const raw = toBytes(bytes);
    const kind = LENGTH_TO_KIND.get(raw.length);
    if (!kind) throw new TypeError("invalid signature length");
    return new Signature(kind, raw);
  }

  static fromHex(hex: string): Signature {
    return Signature.fromBytes(hexToBytes(hex));
  }

  constructor(kind: SignatureKind, bytes: BytesLike) {
    const expectedLength = [...LENGTH_TO_KIND.entries()].find(([, value]) => value === kind)?.[0];
    if (!expectedLength) throw new TypeError("invalid signature kind");
    this.kind = kind;
    this.bytes = assertBytes(bytes, expectedLength, "Signature");
  }

  serialize(serializer: BcsSerializer): void {
    serializer.serializeBytes(this.bytes);
  }

  static deserialize(deserializer: BcsDeserializer): Signature {
    return Signature.fromBytes(deserializer.deserializeBytes());
  }

  toHex(prefix = false): string {
    return `${prefix ? "0x" : ""}${bytesToHex(this.bytes)}`;
  }

  toBs58(): string {
    return bytesToBs58(this.bytes);
  }

  toJSON(): { kind: SignatureKind; hex: string } {
    return { kind: this.kind, hex: this.toHex() };
  }
}
