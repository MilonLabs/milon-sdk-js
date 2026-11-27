export interface FNDSAKeyPair {
  sign_key: Uint8Array;
  verify_key: Uint8Array;
}

export declare function keygen(logn: number): FNDSAKeyPair;
export declare function keygenFromSeed(logn: number, seed: Uint8Array): FNDSAKeyPair;
export declare function sign(
  sk: Uint8Array,
  ctx: Uint8Array | string,
  id: Uint8Array,
  hv: Uint8Array | string,
): Uint8Array;
export declare function verify(
  sig: Uint8Array,
  vk: Uint8Array,
  ctx: Uint8Array | string,
  id: Uint8Array,
  hv: Uint8Array | string,
): boolean;
export declare function normalize_sign_key(sk: Uint8Array): Uint8Array;
export declare function public_key_from_sign_key(sk: Uint8Array): Uint8Array;
export declare function normalize_verify_key(vk: Uint8Array): Uint8Array;
export declare function normalize_signature(sig: Uint8Array): Uint8Array;
export declare const ID_RAW: Uint8Array;
