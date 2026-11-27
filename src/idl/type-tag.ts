import { PostcardSerializer } from "../postcard/index";

export type TypeTagLike = bigint | number | string;

const JSON_TYPE_TAG_TOLERANCE = 4096n;

export function typeTagForType(type: string): bigint {
  const input = new TextEncoder().encode(type.trim());
  let hash = 14695981039346656037n;
  for (const byte of input) {
    hash ^= BigInt(byte);
    hash = (hash * 1099511628211n) & 0xffff_ffff_ffff_ffffn;
  }
  return hash;
}

export function typeTagsEqual(actual: bigint, expected: TypeTagLike): boolean {
  if (typeof expected === "bigint") return actual === expected;
  if (typeof expected === "string") {
    try {
      return actual === BigInt(expected);
    } catch {
      return false;
    }
  }
  if (!Number.isFinite(expected)) return false;
  const parsed = BigInt(Math.trunc(expected));
  const delta = actual > parsed ? actual - parsed : parsed - actual;
  return delta <= JSON_TYPE_TAG_TOLERANCE;
}

export function assertTypeTag(
  actual: bigint,
  expected: TypeTagLike | undefined,
  label = "typeTag",
): void {
  if (expected !== undefined && !typeTagsEqual(actual, expected)) {
    throw new Error(`${label} mismatch: expected=${expected}, payload=${actual}`);
  }
}

export function prefixTypeTag(typeTag: bigint, bytes: Uint8Array): Uint8Array {
  const serializer = new PostcardSerializer();
  serializer.serializeU64(typeTag);
  serializer.serializeFixedBytes(bytes);
  return serializer.toUint8Array();
}
