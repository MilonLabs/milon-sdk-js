import bs58 from "bs58";

export type BytesLike = Uint8Array | ArrayBuffer | ArrayBufferView | readonly number[] | string;
export type U64Like = bigint | number | string;

export function assertBytes(value: BytesLike, length?: number, name = "bytes"): Uint8Array {
  const bytes = toBytes(value);
  if (length !== undefined && bytes.length !== length) {
    throw new TypeError(`${name} must be ${length} bytes`);
  }
  return bytes;
}

export function concatBytes(...parts: BytesLike[]): Uint8Array {
  const arrays = parts.map((part) => toBytes(part));
  const length = arrays.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(length);
  let offset = 0;
  for (const part of arrays) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

export function hexToBytes(hex: string): Uint8Array {
  const normalized = hex.startsWith("0x") || hex.startsWith("0X")
    ? hex.slice(2)
    : hex;
  if (normalized.length % 2 !== 0 || /[^0-9a-f]/i.test(normalized)) {
    throw new TypeError("invalid hex string");
  }
  const out = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function bytesToHex(bytes: BytesLike): string {
  return Array.from(toBytes(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function bytesToBs58(bytes: BytesLike): string {
  return bs58.encode(toBytes(bytes));
}

export function hexToBs58(hex: string): string {
  return bytesToBs58(hexToBytes(hex));
}

export function bs58ToBytes(value: string): Uint8Array {
  if (typeof value !== "string") throw new TypeError("expected base58 string");
  try {
    return bs58.decode(value);
  } catch {
    throw new TypeError("invalid base58 string");
  }
}

export function bs58ToHex(value: string, prefix = false): string {
  return `${prefix ? "0x" : ""}${bytesToHex(bs58ToBytes(value))}`;
}

export function toBytes(value: BytesLike): Uint8Array {
  if (value instanceof Uint8Array) return value;
  if (Array.isArray(value)) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (typeof value === "string") return hexToBytes(value);
  throw new TypeError("expected bytes or hex string");
}

export function u32ToBeBytes(value: number): Uint8Array {
  const out = new Uint8Array(4);
  new DataView(out.buffer).setUint32(0, value, false);
  return out;
}

export function u64ToBeBytes(value: U64Like): Uint8Array {
  const big = BigInt(value);
  if (big < 0n || big > 0xffffffffffffffffn) {
    throw new RangeError("u64 out of range");
  }
  const out = new Uint8Array(8);
  new DataView(out.buffer).setBigUint64(0, big, false);
  return out;
}
