import { toBytes, type BytesLike } from "../crypto/bytes";
import type { Deserializable } from "../serde/types";
import { MAX_U32 } from "./consts";

const textDecoder = new TextDecoder();

export class Deserializer {
  private readonly buffer: Uint8Array;
  private offset = 0;

  constructor(data: BytesLike) {
    this.buffer = toBytes(data).slice();
  }

  get remaining(): number {
    return this.buffer.length - this.offset;
  }

  deserialize<T>(cls: Deserializable<T, Deserializer>): T {
    return cls.deserialize(this);
  }

  deserializeVector<T>(cls: Deserializable<T, Deserializer>): T[] {
    const length = this.deserializeUleb128AsU32();
    const values: T[] = [];
    for (let i = 0; i < length; i += 1) {
      values.push(this.deserialize(cls));
    }
    return values;
  }

  deserializeOption<T>(cls: Deserializable<T, Deserializer>): T | undefined {
    return this.deserializeBool() ? this.deserialize(cls) : undefined;
  }

  deserializeOptionStr(): string | undefined {
    return this.deserializeBool() ? this.deserializeStr() : undefined;
  }

  deserializeStr(): string {
    return textDecoder.decode(this.deserializeBytes());
  }

  deserializeBytes(): Uint8Array {
    return this.deserializeFixedBytes(this.deserializeUleb128AsU32());
  }

  deserializeFixedBytes(length: number): Uint8Array {
    return this.read(length);
  }

  deserializeBool(): boolean {
    const value = this.deserializeU8();
    if (value !== 0 && value !== 1) throw new Error("invalid BCS boolean");
    return value === 1;
  }

  deserializeU8(): number {
    return this.read(1)[0]!;
  }

  deserializeU16(): number {
    return new DataView(this.read(2).buffer).getUint16(0, true);
  }

  deserializeU32(): number {
    return new DataView(this.read(4).buffer).getUint32(0, true);
  }

  deserializeU64(): bigint {
    return this.deserializeUnsignedBigInt(8);
  }

  deserializeU128(): bigint {
    return this.deserializeUnsignedBigInt(16);
  }

  deserializeU256(): bigint {
    return this.deserializeUnsignedBigInt(32);
  }

  deserializeUleb128AsU32(): number {
    let value = 0n;
    let shift = 0n;
    for (let i = 0; i < 5; i += 1) {
      const byte = this.deserializeU8();
      value |= BigInt(byte & 0x7f) << shift;
      if ((byte & 0x80) === 0) {
        if (value > BigInt(MAX_U32)) throw new Error("uleb128 u32 overflow");
        return Number(value);
      }
      shift += 7n;
    }
    throw new Error("uleb128 u32 is too long");
  }

  assertEnd(): void {
    if (this.remaining !== 0) {
      throw new Error(`${this.remaining} trailing bytes`);
    }
  }

  private deserializeUnsignedBigInt(length: number): bigint {
    const bytes = this.read(length);
    let value = 0n;
    for (let i = bytes.length - 1; i >= 0; i -= 1) {
      value = (value << 8n) | BigInt(bytes[i]!);
    }
    return value;
  }

  private read(length: number): Uint8Array {
    if (!Number.isInteger(length) || length < 0) throw new RangeError("invalid read length");
    if (this.offset + length > this.buffer.length) {
      throw new Error("reached end of buffer");
    }
    const bytes = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return bytes;
  }
}

export function deserializeBcs<T>(
  bytes: BytesLike,
  cls: Deserializable<T, Deserializer>,
  options: { allowTrailingBytes?: boolean } = {}
): T {
  const deserializer = new Deserializer(bytes);
  const value = deserializer.deserialize(cls);
  if (!options.allowTrailingBytes) deserializer.assertEnd();
  return value;
}
