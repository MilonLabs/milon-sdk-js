import { toBytes, type BytesLike } from "../crypto/bytes";
import type { Deserializable } from "../serde/types";

const textDecoder = new TextDecoder();

export class PostcardDeserializer {
  private readonly buffer: Uint8Array;
  private offset = 0;

  constructor(data: BytesLike) {
    this.buffer = toBytes(data).slice();
  }

  get remaining(): number {
    return this.buffer.length - this.offset;
  }

  get position(): number {
    return this.offset;
  }

  slice(start: number, end = this.offset): Uint8Array {
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || end > this.buffer.length) {
      throw new RangeError("invalid postcard slice range");
    }
    return this.buffer.slice(start, end);
  }

  deserialize<T>(cls: Deserializable<T, PostcardDeserializer>): T {
    return cls.deserialize(this);
  }

  deserializeSeq<T>(cls: Deserializable<T, PostcardDeserializer>): T[] {
    const length = this.deserializeU32();
    const values: T[] = [];
    for (let i = 0; i < length; i += 1) {
      values.push(this.deserialize(cls));
    }
    return values;
  }

  deserializeOption<T>(cls: Deserializable<T, PostcardDeserializer>): T | undefined {
    return this.deserializeBool() ? this.deserialize(cls) : undefined;
  }

  deserializeStr(): string {
    return textDecoder.decode(this.deserializeBytes());
  }

  deserializeBytes(): Uint8Array {
    return this.deserializeFixedBytes(this.deserializeU32());
  }

  deserializeFixedBytes(length: number): Uint8Array {
    return this.read(length);
  }

  deserializeRemainingBytes(): Uint8Array {
    return this.read(this.remaining);
  }

  deserializeBool(): boolean {
    const value = this.deserializeU8();
    if (value !== 0 && value !== 1) throw new Error("invalid postcard boolean");
    return value === 1;
  }

  deserializeU8(): number {
    return this.read(1)[0]!;
  }

  deserializeU16(): number {
    return Number(this.deserializeVarUint(0xffffn, "u16"));
  }

  deserializeU32(): number {
    return Number(this.deserializeVarUint(0xffffffffn, "u32"));
  }

  deserializeU64(): bigint {
    return this.deserializeVarUint(0xffffffffffffffffn, "u64");
  }

  deserializeU128(): bigint {
    return this.deserializeVarUint(0xffffffffffffffffffffffffffffffffn, "u128");
  }

  deserializeF64(): number {
    const bytes = this.read(8);
    return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getFloat64(0, true);
  }

  deserializeI8(): number {
    return Number(zigZagDecode(BigInt(this.deserializeU8())));
  }

  deserializeI16(): number {
    return Number(zigZagDecode(BigInt(this.deserializeU16())));
  }

  deserializeI32(): number {
    return Number(zigZagDecode(BigInt(this.deserializeU32())));
  }

  deserializeI64(): bigint {
    return zigZagDecode(this.deserializeU64());
  }

  deserializeEnumVariant(): number {
    return this.deserializeU32();
  }

  assertEnd(): void {
    if (this.remaining !== 0) {
      throw new Error(`${this.remaining} trailing bytes`);
    }
  }

  private deserializeVarUint(max: bigint, name: string): bigint {
    let value = 0n;
    let shift = 0n;
    for (let i = 0; i < 19; i += 1) {
      const byte = this.deserializeU8();
      value |= BigInt(byte & 0x7f) << shift;
      if ((byte & 0x80) === 0) {
        if (value > max) throw new Error(`${name} overflow`);
        return value;
      }
      shift += 7n;
    }
    throw new Error(`${name} varint is too long`);
  }

  private read(length: number): Uint8Array {
    if (!Number.isInteger(length) || length < 0) throw new RangeError("invalid read length");
    if (this.offset + length > this.buffer.length) {
      throw new Error("reached end of postcard buffer");
    }
    const bytes = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return bytes;
  }
}

export function deserializePostcard<T>(
  bytes: BytesLike,
  cls: Deserializable<T, PostcardDeserializer>,
  options: { allowTrailingBytes?: boolean } = {}
): T {
  const deserializer = new PostcardDeserializer(bytes);
  const value = deserializer.deserialize(cls);
  if (!options.allowTrailingBytes) deserializer.assertEnd();
  return value;
}

function zigZagDecode(value: bigint): bigint {
  return (value >> 1n) ^ -(value & 1n);
}
