import {
  Address,
  SecretKey,
  blake3Hash,
  bytesToBs58,
  bytesToHex,
  hexToBytes,
} from "../dist/index.js";
import { ID_RAW, verify as verifyFnDsa512 } from "../dist/vendor/fndsa.js";
import { ed25519 } from "@noble/curves/ed25519";
import { secp256k1 } from "@noble/curves/secp256k1";
import { bls12_381 } from "@noble/curves/bls12-381";

const message = new TextEncoder().encode("hello milon");
const classical = SecretKey.generateClassical();

const edPublic = await classical.ed25519Public();
const secpPublic = await classical.secp256k1Public();
const blsPublic = await classical.bls12381Public();
const edSignature = await classical.signEd25519(message);
const secpSignature = await classical.signSecp256k1(message);
const blsSignature = await classical.signBls12381(message);

console.log("Ed25519", {
  address: Address.fromPublicKey(edPublic).toBase58(),
  verified: ed25519.verify(edSignature.bytes, message, edPublic.bytes),
});
console.log("secp256k1", {
  address: Address.fromPublicKey(secpPublic).toBase58(),
  // The final SDK signature byte is the recovery ID; the first 64 bytes are the compact signature.
  verified: secp256k1.verify(
    secpSignature.bytes.slice(0, 64),
    blake3Hash(message),
    secpPublic.bytes,
    { prehash: false },
  ),
});
console.log("BLS12-381", {
  address: Address.fromPublicKey(blsPublic).toBase58(),
  verified: bls12_381.verify(blsSignature.bytes, message, blsPublic.bytes),
});

const fnSecret = SecretKey.generateFnDsa512();
const fnPublic = await fnSecret.fnDsa512Public();
const fnSignature = await fnSecret.signFnDsa512(message);
console.log("FN-DSA-512", {
  address: Address.fromPublicKey(fnPublic).toBase58(),
  verified: verifyFnDsa512(
    fnSignature.bytes,
    fnPublic.bytes,
    new Uint8Array(),
    ID_RAW,
    message,
  ),
});

const bytes = hexToBytes("00112233aabbccdd");
console.log("encoding", { hex: bytesToHex(bytes), base58: bytesToBs58(bytes) });
