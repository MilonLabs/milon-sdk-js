import { toBytes, type BytesLike } from "../crypto/bytes";
import type { AnyNumber, Serializable } from "../serde/types";

const textEncoder = new TextEncoder();

export abstract class PostcardSerializable implements Serializable<PostcardSerializer> {
  abstract serialize(serializer: PostcardSerializer): void;

  postcardToBytes(): Uint8Array {
    return serializePostcard(this);
  }
}

export class PostcardSerializer {
  private bytes: number[] = [];

  serialize(value: Serializable<PostcardSerializer>): void {
    value.serialize(this);
  }

  serializeSeq<T extends Serializable<PostcardSerializer>>(values: T[]): void {
    this.serializeU32(values.length);
    for (const value of values) {
      value.serialize(this);
    }
  }

  serializeOption<T extends Serializable<PostcardSerializer>>(value?: T | null): void {
    this.serializeBool(value !== undefined && value !== null);
    if (value !== undefined && value !== null) value.serialize(this);
  }

  serializeStr(value: string): void {
    this.serializeBytes(textEncoder.encode(value));
  }

  serializeBytes(value: BytesLike): void {
    const bytes = toBytes(value);
    this.serializeU32(bytes.length);
    this.serializeFixedBytes(bytes);
  }

  serializeFixedBytes(value: BytesLike): void {
    this.push(...toBytes(value));
  }

  serializeBool(value: boolean): void {
    if (typeof value !== "boolean") throw new TypeError("expected boolean");
    this.serializeU8(value ? 1 : 0);
  }

  serializeU8(value: number): void {
    validateRange(BigInt(value), 0xffn, "u8");
    this.push(value);
  }

  serializeU16(value: number): void {
    this.serializeVarUint(BigInt(value), 0xffffn, "u16");
  }

  serializeU32(value: AnyNumber): void {
    this.serializeVarUint(BigInt(value), 0xffffffffn, "u32");
  }

  serializeU64(value: AnyNumber): void {
    this.serializeVarUint(BigInt(value), 0xffffffffffffffffn, "u64");
  }

  serializeU128(value: AnyNumber): void {
    this.serializeVarUint(BigInt(value), 0xffffffffffffffffffffffffffffffffn, "u128");
  }

  serializeF64(value: number): void {
    if (typeof value !== "number") throw new TypeError("expected f64 number");
    const bytes = new Uint8Array(8);
    new DataView(bytes.buffer).setFloat64(0, value, true);
    this.serializeFixedBytes(bytes);
  }

  serializeI8(value: number): void {
    this.serializeU8(Number(zigZagEncode(BigInt(value), 8)));
  }

  serializeI16(value: number): void {
    this.serializeU16(Number(zigZagEncode(BigInt(value), 16)));
  }

  serializeI32(value: number): void {
    this.serializeU32(zigZagEncode(BigInt(value), 32));
  }

  serializeI64(value: AnyNumber): void {
    this.serializeU64(zigZagEncode(BigInt(value), 64));
  }

  serializeEnumVariant(index: number): void {
    this.serializeU32(index);
  }

  toUint8Array(): Uint8Array {
    return new Uint8Array(this.bytes);
  }

  private serializeVarUint(value: bigint, max: bigint, name: string): void {
    validateRange(value, max, name);
    let remaining = value;
    while (remaining >= 0x80n) {
      this.push(Number((remaining & 0x7fn) | 0x80n));
      remaining >>= 7n;
    }
    this.push(Number(remaining));
  }

  private push(...bytes: number[]): void {
    for (const byte of bytes) {
      if (!Number.isInteger(byte) || byte < 0 || byte > 0xff) {
        throw new RangeError("byte out of range");
      }
      this.bytes.push(byte);
    }
  }
}

export function serializePostcard(value: Serializable<PostcardSerializer>): Uint8Array {
  const serializer = new PostcardSerializer();
  value.serialize(serializer);
  return serializer.toUint8Array();
}

function validateRange(value: bigint, max: bigint, name: string): void {
  if (value < 0n || value > max) throw new RangeError(`${name} out of range`);
}

function zigZagEncode(value: bigint, bits: bigint | number): bigint {
  const bitWidth = BigInt(bits);
  const min = -(1n << (bitWidth - 1n));
  const max = (1n << (bitWidth - 1n)) - 1n;
  if (value < min || value > max) throw new RangeError(`i${bits} out of range`);
  return (value << 1n) ^ (value >> (bitWidth - 1n));
}
