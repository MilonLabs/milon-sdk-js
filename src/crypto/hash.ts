import { blake3 } from "@noble/hashes/blake3.js";
import { concatBytes, toBytes, type BytesLike } from "./bytes";

export const MILON_ROOT_DOMAIN = new TextEncoder().encode("Milon-blake3");
export const HASH_CONTEXT = MILON_ROOT_DOMAIN;

export type Blake3HashFn = (bytes: Uint8Array) => BytesLike;
export type Blake3Hash64Fn = (bytes: Uint8Array) => BytesLike;

let blake3Impl: Blake3HashFn = defaultBlake3Hash;
let blake3Impl64: Blake3Hash64Fn = defaultBlake3Hash64;

export function configureHash({
  blake3,
  blake3_64,
}: {
  blake3: Blake3HashFn;
  blake3_64?: Blake3Hash64Fn;
}): void {
  if (typeof blake3 !== "function") {
    throw new TypeError("blake3 must be a function");
  }
  if (blake3_64 !== undefined && typeof blake3_64 !== "function") {
    throw new TypeError("blake3_64 must be a function");
  }
  blake3Impl = blake3;
  blake3Impl64 = blake3_64 ?? defaultBlake3Hash64;
}

export function blake3Hash(bytes: BytesLike): Uint8Array {
  const digest = toBytes(blake3Impl(toBytes(bytes)));
  assertBlake3Digest(digest);
  return digest;
}

export function blake3Hash64(bytes: BytesLike): Uint8Array {
  const digest = toBytes(blake3Impl64(toBytes(bytes)));
  assertBlake3Digest64(digest);
  return digest;
}

export function hash32Hasher(domain: BytesLike): Uint8Array {
  return concatBytes(MILON_ROOT_DOMAIN, toBytes(domain));
}

export function domainHash(domain: BytesLike, ...parts: BytesLike[]): Uint8Array {
  return hash32(domain, parts);
}

export function hash32(domain: BytesLike, parts: Iterable<BytesLike>): Uint8Array;
export function hash32(part: BytesLike): Uint8Array;
export function hash32(domainOrFirstPart: BytesLike, parts?: Iterable<BytesLike>): Uint8Array {
  if (parts !== undefined) {
    return blake3Hash(concatBytes(
      hash32Hasher(domainOrFirstPart),
      ...Array.from(parts, (part) => toBytes(part)),
    ));
  }
  return blake3Hash(concatBytes(MILON_ROOT_DOMAIN, toBytes(domainOrFirstPart)));
}

export function hash64(domain: BytesLike, parts: Iterable<BytesLike>): Uint8Array;
export function hash64(part: BytesLike): Uint8Array;
export function hash64(domainOrFirstPart: BytesLike, parts?: Iterable<BytesLike>): Uint8Array {
  if (parts !== undefined) {
    return blake3Hash64(concatBytes(
      hash32Hasher(domainOrFirstPart),
      ...Array.from(parts, (part) => toBytes(part)),
    ));
  }
  return blake3Hash64(concatBytes(MILON_ROOT_DOMAIN, toBytes(domainOrFirstPart)));
}

function defaultBlake3Hash(bytes: Uint8Array): Uint8Array {
  return toBytes(blake3(bytes, { dkLen: 32 }));
}

function defaultBlake3Hash64(bytes: Uint8Array): Uint8Array {
  return toBytes(blake3(bytes, { dkLen: 64 }));
}

function assertBlake3Digest(digest: Uint8Array): void {
  if (digest.length !== 32) {
    throw new Error("Blake3 hash implementation must return 32 bytes");
  }
}

function assertBlake3Digest64(digest: Uint8Array): void {
  if (digest.length !== 64) {
    throw new Error("Blake3 hash64 implementation must return 64 bytes");
  }
}
