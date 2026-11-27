import { toBytes, type BytesLike } from "../crypto/bytes";
import type { AnyNumber, Serializable } from "../serde/types";
import { MAX_U8, MAX_U16, MAX_U32, MAX_U64, MAX_U128, MAX_U256 } from "./consts";

const textEncoder = new TextEncoder();

export abstract class BcsSerializable implements Serializable<Serializer> {
  abstract serialize(serializer: Serializer): void;

  bcsToBytes(): Uint8Array {
    return serializeBcs(this);
  }
}

export class Serializer {
  private buffer: ArrayBuffer;
  private offset = 0;

  constructor(length = 64) {
    if (!Number.isInteger(length) || length <= 0) {
      throw new RangeError("Serializer length must be greater than 0");
    }
    this.buffer = new ArrayBuffer(length);
  }

  serialize(value: Serializable<Serializer>): void {
    value.serialize(this);
  }

  serializeVector<T extends Serializable<Serializer>>(values: T[]): void {
    this.serializeU32AsUleb128(values.length);
    for (const value of values) {
      value.serialize(this);
    }
  }

  serializeOption<T extends Serializable<Serializer>>(value?: T | null): void {
    this.serializeBool(value !== undefined && value !== null);
    if (value !== undefined && value !== null) {
      value.serialize(this);
    }
  }

  serializeOptionStr(value?: string | null): void {
    this.serializeBool(value !== undefined && value !== null);
    if (value !== undefined && value !== null) {
      this.serializeStr(value);
    }
  }

  serializeStr(value: string): void {
    this.serializeBytes(textEncoder.encode(value));
  }

  serializeBytes(value: BytesLike): void {
    const bytes = toBytes(value);
    this.serializeU32AsUleb128(bytes.length);
    this.serializeFixedBytes(bytes);
  }

  serializeFixedBytes(value: BytesLike): void {
    this.append(toBytes(value));
  }

  serializeBool(value: boolean): void {
    if (typeof value !== "boolean") throw new TypeError("expected boolean");
    this.serializeU8(value ? 1 : 0);
  }

  serializeU8(value: number): void {
    validateIntegerRange(value, 0, MAX_U8, "u8");
    this.append(new Uint8Array([value]));
  }

  serializeU16(value: number): void {
    validateIntegerRange(value, 0, MAX_U16, "u16");
    this.writeNumber((view) => view.setUint16(0, value, true), 2);
  }

  serializeU32(value: number): void {
    validateIntegerRange(value, 0, MAX_U32, "u32");
    this.writeNumber((view) => view.setUint32(0, value, true), 4);
  }

  serializeU64(value: AnyNumber): void {
    this.serializeUnsignedBigInt(value, 8, MAX_U64, "u64");
  }

  serializeU128(value: AnyNumber): void {
    this.serializeUnsignedBigInt(value, 16, MAX_U128, "u128");
  }

  serializeU256(value: AnyNumber): void {
    this.serializeUnsignedBigInt(value, 32, MAX_U256, "u256");
  }

  serializeU32AsUleb128(value: number): void {
    validateIntegerRange(value, 0, MAX_U32, "uleb128 u32");
    let remaining = value >>> 0;
    const bytes: number[] = [];
    while (remaining >>> 7 !== 0) {
      bytes.push((remaining & 0x7f) | 0x80);
      remaining >>>= 7;
    }
    bytes.push(remaining);
    this.append(new Uint8Array(bytes));
  }

  toUint8Array(): Uint8Array {
    return new Uint8Array(this.buffer).slice(0, this.offset);
  }

  private serializeUnsignedBigInt(value: AnyNumber, byteLength: number, max: bigint, name: string): void {
    let remaining = BigInt(value);
    if (remaining < 0n || remaining > max) {
      throw new RangeError(`${name} out of range`);
    }
    const bytes = new Uint8Array(byteLength);
    for (let i = 0; i < byteLength; i += 1) {
      bytes[i] = Number(remaining & 0xffn);
      remaining >>= 8n;
    }
    this.append(bytes);
  }

  private writeNumber(write: (view: DataView) => void, length: number): void {
    this.ensure(length);
    write(new DataView(this.buffer, this.offset, length));
    this.offset += length;
  }

  private append(bytes: Uint8Array): void {
    this.ensure(bytes.length);
    new Uint8Array(this.buffer, this.offset, bytes.length).set(bytes);
    this.offset += bytes.length;
  }

  private ensure(length: number): void {
    while (this.buffer.byteLength < this.offset + length) {
      const next = new ArrayBuffer(this.buffer.byteLength * 2);
      new Uint8Array(next).set(new Uint8Array(this.buffer));
      this.buffer = next;
    }
  }
}

export function serializeBcs(value: Serializable<Serializer>): Uint8Array {
  const serializer = new Serializer();
  value.serialize(serializer);
  return serializer.toUint8Array();
}

export function validateIntegerRange(value: number, min: number, max: number, name: string): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} out of range`);
  }
}
