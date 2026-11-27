import test from "node:test";
import assert from "node:assert/strict";
import { hash as blake3WasmHash } from "blake3-wasm";
import bs58 from "bs58";
import { bls12_381 } from "@noble/curves/bls12-381";
import { secp256k1 } from "@noble/curves/secp256k1";
import { ID_RAW, verify as verifyFnDsa512 } from "../dist/vendor/fndsa.js";
import {
  Address,
  Bcs,
  PublicKey,
  PublicKeyKind,
  SecretKey,
  Signature,
  SignatureKind,
  Signer,
  createMilonClassicalDerivationPath,
  createMilonDerivationPath,
  createMilonPqDerivationPath,
  deriveEd25519PrivateKeyFromMnemonic,
  deriveMilonAccountFromDerivationPath,
  deriveMilonClassicalAddressFromMnemonic,
  deriveMilonPqAddressFromMnemonic,
  VirAddress,
  VirSigner,
  assertBytes,
  blake3Hash,
  blake3Hash64,
  bs58ToHex,
  bs58ToBytes,
  bytesToBs58,
  hexToBs58,
  bytesToHex,
  concatBytes,
  configureHash,
  domainHash,
  hash32,
  hash64,
  hexToBytes,
  validateMnemonic24,
  toBytes,
  u32ToBeBytes,
  u64ToBeBytes,
} from "../dist/index.js";
import {
  PostcardDeserializer,
  PostcardSerializer,
} from "../dist/postcard/index.js";

function serializePostcardBytes(bytes) {
  const serializer = new PostcardSerializer();
  serializer.serializeBytes(bytes);
  return serializer.toUint8Array();
}

const FN_DSA512_SECRET_KEY_BS58 =
  "2qqoVKSsVPwApU7Y4PUAECnxmVb3jsA9w8yx4Vx53QJz6rFSUULyf7ZapHAKftwsreXVWbugkhTgjSkhtv8QMcgPFACrqCpDTzsuropfLoYfVhYurczoP5mnYkYfWo33sU1FvuDwRM9HnsRKhgdNfA27rQ4rxvTFgWKpt6YZzE9i9iFLgRTTZTFJbnAR1HvWZQDvPa7dFVbLqyHNytuR8HnxdyLTca8SDecubNefPNrxv8TaStD6u5jB33azZ5pF4ooZPLzdqMn7e8QLFFYfbf3rpbpJLXXgW6mbCgGVPtGXBtwXaSnF15Dn7j6FtsgCAdekFybYTLZ3YgDwdFuDNCNwimufVoePKQaYJrjfu9Y4z9bGZ11Bn13yva2LTTWtWLGXUDPcQCnoPS6toJapcf1G56EhU8R14hAaMnVHvbV7dwhDc7uRCyD1Ny8nXrAXwBjo8iB5JTRvzBzqpUbkCDbxGNV2NEVJHN1x98vV3kENNoxCRggLLQmfTN2UfB2UcWxAXYTTmFdAphn1B7hopaNs6qcdGou6hvZi9oaVbvuzrgM9P2CSuujCiXNyrCaDssiCE9fqszi4GQs9kH1VVUuFpdjSbNYemPLnArpJBbWcJr74sN5y7wUGipCHTpPWvshTsUZFcAXqtfEWVvjGJXTWzwyq9g7FhyojuCRJABDuhT9EdhBreQvsKg69hbAwKajkN1q13DgqjoQfDk1DokCWB41tTtkwjsDbbeT6BsWcxsgqsyaSWWgGJaw3NVeUxaSKpxiQuJGr3SAL6e9ta6E3y9GwByXTM9toz4haPdK5Rat7yJWCTYubwAsBmCVu2dY2Ct27HkKaGVPxKfS6PdtVNsaRoPn9rFJCju7fC4FZfTgLaVDRstQX6jqd6VPqocH3ajPFmqoM5EkoxAxLiWs2A7XfCmr4RepSYnhrVpGRbN6MFynro3RZpQqP4KTwdyE6wzoboSHY2vCYGQEDJMCbu4DZyF1zce6YFAqD9KMrT922MCTsohhxzVQTCJK3NvJ2mazPAyZDDv6NeFrtCntEGu2WZ28qxjCzSU8PmVtXWgjDa9NkhTyNzC3FhqBVs8XPqLqDBkieHigkSdJwZumPtmdTjQsCoFNZvqbuWPGPn4utnr11pbhJFcdwp8vT9Mk6iyTs3V2fHQRYLMwAX2YK2NoB6eLT2s26MYegAbVqQTnmypSVug4zRb7ZACwnsMAnLgfuB3KHXGZRXcBVLVtkbqPRKJoxRddbMCPYJWA8RuQWAAb8WDBUpeSJmQe3YaYuZP9pRV8SzxKzLMzzbwTn9E4116BA3oyitxr1bL7VncHkNgPXzas2ok9ZTPpe8GmcFxajbX5MnS2p6enpdn37fode59uRYvdJS5tycniY3XkQuEGbUkJ3k6F5ji6EAz3A9CHzgdTRNGbBkHHEPJ1ojLcmDShwQr4P5CZK5YnwondMjdR9NCvixURp84YfTtZ2CTkqMd5NHvK1VY4rgHVLDdqpzQxMvG7UQCUMxQoxvgWwMNVmh5SYj2xwbQzhADHBAh7FqhdkC8x3WeodJRxY42kcyDe4KHXSFYk9zDpNFAFgNYoELFjZRAoouu6yFAecdcDE72h1ejiidGHU5m5To5swnPDesYcgjZ5jopwRg6SQaQ1ygYQh7r7NNab7jojKGZjQzxCh7xFjVpJ8fr1Z9gWPA4L2XWWhiKYwr6fmjmLvzymT2GUrrbJnx67Fg92NmwfrguS448b5vqjvzJ";
const FN_DSA512_PUBLIC_KEY_BS58 =
  "32ZXB71MsMKdUGX62d1JAmB8BXaoJ7RAzGJqrkYoUH24h6fQ6udKVdXATxU6LsrWYMEUzAwU89HTDZ7vCNstC9TJftLdiNcsuaDJbTNA6fgX2E6t18MRRSm4iwRjhjTNFYkxyTtA5twnVuBJ5Q9pTrBVZdkG6zoouBS9nP96TDB5vqRCzYRcBxjHQA3FvBZ1LvaWkqrYf4ZPBDBeFEUAoossZ7vFngRfYQbTENpbLrPHWpcv24Jk5QsRxoV83UWaUwbULupCVbyYy3qH5U4S6DtTMfrhCWVctT8Gare66wHTdHxMsHPyce6w24EjwA7jJXBqzaCmjaMrmas2Gxp4YPrw5GdkAXA2PsFabzc9XwKj7i1eVMG9GSa4ZMrL8pWgtBwGrCnVkhn6wx31oieeoD6CpFD28cFpFJeNMy9A1VxXA7qzs1NRzwWSvGyYR199YCkGYbvZQHASTJrLxxbKHYVATwUQKW4yBZkCQBBJPtbcTMUuLzw7gc2kSPEvScfSaCQsKjN5Qa2dM9GsiNMLT51Lown5owmvpG8xmkPYiTQvandn1BfUGk6pjcNJZe7ExzZJ7Fw6p9o6uVSJpSuoAzDN1iapPyH1EFGRR9gmwKCvDTBrJrSEtEptMATzpNS6fuFTkrtBMQMfaXcGdoECYe6KNTjGuHUKn93PdMAQKtcCqdUhTrXSnZk2uoLBVRmDuAzU5rep7cbAx1HXac6VaSCJyhfTkn8xNV1ZSW1YFEoDcLpz5yRwm18V2Wo62gTQzXFdw95Gevdu4DDPXLLix44e1gNcf37mbuzCEPaPs6DM72m19mrukQ7UTP4LWuBfqvMwPCG1hAaB59gkoSWopUubNv15UE1hzQTnvirt3cbFJd1ucFqinTsSVUFd88BuD8r16VTJ1u1ysHCbe16NYYoUDaEL7QGRXPqzVXocqfwuYpVVHrPp7UsZM4XVKJpwhwTZ3ckMFwHnLgbjd43SwSHuks8yV7xVy2hSKi64erKMB95Qc8JdocDatj5fDBT6J6QzDqqfHS6PjFdCJ5ByK35tdVzwNdcKYNCWWUzXy8RVwnAe8yLKvPH3ZfAqYRJrPtD69qALgGk6DARNtNPN1YNtJhozKb6z4bp1MfRnQgjJDUYnJi6rCq2o6GREQVxxyyoXL4eZF9YYETQNEqjxahTGUukQt3v4PDVHHqdVzkFm51Jnu5CjtSAA2YKjRiNrueg4EK1BT";
const FN_DSA512_PUBLIC_KEY_HEX =
  "091d140b65045e2753ecad441b62296f5ea95849c6a07c09dd814cc942334871a7b9674a3a84fd08e8ee3e9ef580473c8752aa0e44a4bfc58c612249b18ee22f4fb622073e03be3e2507d0f2575c80f2933bd0ce6d633232075928a43add1f25e9cb5bb55e03f37a99b963c6e670a1cefcad483ec6df671f3b2814ab466847a43d3977014ab472698c6ad9848e7eb107c4d6efb5a98e0ae189682c1991c707d10bfa7bdebaabf1a4fe82a8e6c70304555b0c5969c54fbe7521fcab5ca24652da930969e2948bb605644988d3a968ea0289da6c92c1bc2a1c5cd9278d7eb952c4387072709aa0285d547daf6527acbc520113e64797378631842799661e3f621517fd933e6d9ceb148dc60756b53db686238969daeb095405199dc07945f9d765a216e52b596b12060e03b1d9a0964794dad938a8c62e6e065a3fdc2e2331574a2bd3f973f0b18adedfb1a0f58657a79b787e51c667c9c50336b6ca57860784b958ea24b857eb47c5956bdca2d7b8303bfb992c7182cd1b8731652f06a9d6a9f6832d76f8d0c3d928ae5c818b431e869d84c15c610c0b040620e3d4fa2063b2f432e649e134aa611d1260a77a34357a94c38eb553e0bac324dca4771e5f7baf6a42726c956acf598994c08ba1d718b714212e86d81f3f844821483b2af78d4af5426da5c15d38e8f24dd44130ca06eb8347eeb8eed0a03216b83c82d3f78caed41704aaa921a955246650673acf19438a3775915ded764e11326325a250107098490a296e2891d1f9019e317d3818c3ec2e11561cf23ee65b865c1c96274630b400ba4849e2a62d11c441b08ad98855dec6baebe17e128986dc5a89a4084f8b8cd6d98e64d9cb5ad6a163bdf1a466625943951c65ab945e989d2e78da557584f6a8567a16e16d913e3adf9f73832003696461467e2db6401d99ac6dc801395402515f4e79d77fd0763c5e92a963c6a7825442211cd97a2f82f91b6847f67cac6b65d7445f3a098b36bbd5a2083ad7d1dc452e38debde91f85a3a26cee00c881ef4f55ab67610e9f1568dbfa23ed0a27ccc1e32d815a1e1eb7f2946f45b92819d7e812d78b98c3c3532ed8ba4d602731a2be3db6d1b8cb23bf4d9ed195164a449ec60e31450f56be4c004b41de6cb084960129e9b1b98d6c1136dd66b38cad89ce9d0127ce3258ba2da965a4e3eac7923b7fa415a9566b63a138425686dabaa432897015eac00e71b5805e91ed3a348c01f185340f9d3018862ff06c5c2e7741261e";
const TEST_MNEMONIC =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art";

test("bytes helpers convert, concatenate, and validate byte arrays", () => {
  assert.deepEqual(Array.from(hexToBytes("0x0a0b")), [10, 11]);
  assert.equal(bytesToHex(new Uint8Array([10, 11])), "0a0b");
  assert.equal(bytesToBs58(new Uint8Array([10, 11])), "mL");
  assert.equal(bytesToBs58("0a0b"), "mL");
  assert.equal(hexToBs58("0a0b"), "mL");
  assert.equal(hexToBs58("0x0a0b"), "mL");
  assert.equal(bs58ToHex("mL"), "0a0b");
  assert.deepEqual(Array.from(bs58ToBytes("mL")), [10, 11]);
  assert.equal(bs58ToHex("mL", true), "0x0a0b");
  assert.deepEqual(Array.from(toBytes("0c")), [12]);
  assert.deepEqual(Array.from(toBytes(new Uint8Array([1]).buffer)), [1]);
  assert.deepEqual(Array.from(concatBytes("01", new Uint8Array([2]))), [1, 2]);
  assert.deepEqual(Array.from(assertBytes("abcd", 2, "two bytes")), [
    0xab,
    0xcd,
  ]);
  assert.throws(
    () => assertBytes("abcd", 3, "three bytes"),
    /three bytes must be 3 bytes/,
  );
  assert.throws(() => bs58ToHex(1), /expected base58 string/);
  assert.throws(() => hexToBytes("abc"), /invalid hex/);
  assert.throws(() => hexToBs58("abc"), /invalid hex/);
  assert.throws(() => toBytes(1), /expected bytes/);
});

test("integer byte helpers use big-endian wire layout", () => {
  assert.deepEqual(Array.from(u32ToBeBytes(0x01020304)), [1, 2, 3, 4]);
  assert.deepEqual(Array.from(u64ToBeBytes(0x0102030405060708n)), [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
  ]);
  assert.throws(() => u64ToBeBytes(-1n), /u64 out of range/);
});

test("blake3 hash functions return 32 byte digests and allow override", () => {
  configureHash({
    blake3: (bytes) => blake3WasmHash(bytes, { length: 32 }),
    blake3_64: (bytes) => blake3WasmHash(bytes, { length: 64 }),
  });
  const digest = blake3Hash(new Uint8Array([1, 2, 3]));
  const digest64 = blake3Hash64(new Uint8Array([1, 2, 3]));
  assert.equal(digest.length, 32);
  assert.equal(digest64.length, 64);
  assert.equal(
    bytesToHex(digest),
    "b177ec1bf26dfb3b7010d473e6d44713b29b765b99c6e60ecbfae742de496543",
  );

  configureHash({
    blake3: () => new Uint8Array(32).fill(7),
    blake3_64: () => new Uint8Array(64).fill(8),
  });
  assert.deepEqual(Array.from(blake3Hash("00")), Array(32).fill(7));
  assert.deepEqual(Array.from(blake3Hash64("00")), Array(64).fill(8));
  assert.throws(
    () => configureHash({ blake3: undefined }),
    /blake3 must be a function/,
  );
  assert.throws(
    () =>
      configureHash({ blake3: () => new Uint8Array(31) }) || blake3Hash("00"),
    /must return 32 bytes/,
  );
  assert.throws(
    () =>
      configureHash({
        blake3: () => new Uint8Array(32),
        blake3_64: () => new Uint8Array(63),
      }) || blake3Hash64("00"),
    /must return 64 bytes/,
  );

  configureHash({
    blake3: (bytes) => blake3WasmHash(bytes, { length: 32 }),
    blake3_64: (bytes) => blake3WasmHash(bytes, { length: 64 }),
  });
  assert.equal(domainHash("aa").length, 32);
});

test("hash32 and hash64 match Rust fixtures for hello world", () => {
  const message = new TextEncoder().encode("hello world");
  assert.equal(
    bytesToHex(hash32(message)),
    "5040f885605dd299d08116c7a253c611d11b493e210fc3a32938151eb2c07214",
  );
  assert.equal(
    bytesToHex(hash64(message)),
    "5040f885605dd299d08116c7a253c611d11b493e210fc3a32938151eb2c0721442a80ec7a0ca62fc0bd5d14d36c6c65457c2b9a425a303b9950ef09adec00363",
  );
});

test("public keys parse by length, serialize as BCS bytes, and round trip", () => {
  const ed = new PublicKey(PublicKeyKind.ED25519, new Uint8Array(32).fill(1));
  const secp = PublicKey.fromBytes(new Uint8Array(33).fill(2));
  const bls = PublicKey.fromHex(bytesToHex(new Uint8Array(48).fill(3)));
  const fnDsa = PublicKey.fromBytes(new Uint8Array(897).fill(4));
  assert.equal(PublicKey.from(ed), ed);
  assert.equal(ed.kind, PublicKeyKind.ED25519);
  assert.equal(secp.kind, PublicKeyKind.SECP256K1);
  assert.equal(bls.kind, PublicKeyKind.BLS12381);
  assert.equal(fnDsa.kind, PublicKeyKind.FN_DSA512);
  assert.equal(ed.toHex(true).startsWith("0x"), true);
  assert.deepEqual(ed.toJSON(), {
    kind: PublicKeyKind.ED25519,
    hex: ed.toHex(),
  });
  assert.throws(
    () => PublicKey.fromBytes(new Uint8Array(31)),
    /invalid public key length/,
  );
  assert.throws(
    () => new PublicKey("bad", new Uint8Array(32)),
    /invalid public key kind/,
  );

  const decoded = Bcs.deserializeBcs(Bcs.serializeBcs(ed), PublicKey);
  assert.equal(decoded.kind, ed.kind);
  assert.equal(bytesToHex(decoded.bytes), bytesToHex(ed.bytes));
});

test("signatures parse by length, serialize as BCS bytes, and round trip", () => {
  const ed = new Signature(SignatureKind.ED25519, new Uint8Array(64).fill(1));
  const secp = Signature.fromBytes(new Uint8Array(65).fill(2));
  const bls = Signature.fromHex(bytesToHex(new Uint8Array(96).fill(3)));
  const fnDsa = Signature.fromBytes(new Uint8Array(666).fill(4));
  assert.equal(Signature.from(ed), ed);
  assert.equal(ed.kind, SignatureKind.ED25519);
  assert.equal(secp.kind, SignatureKind.SECP256K1);
  assert.equal(bls.kind, SignatureKind.BLS12381);
  assert.equal(fnDsa.kind, SignatureKind.FN_DSA512);
  assert.equal(ed.toHex(true).startsWith("0x"), true);
  assert.deepEqual(ed.toJSON(), {
    kind: SignatureKind.ED25519,
    hex: ed.toHex(),
  });
  assert.throws(
    () => Signature.fromBytes(new Uint8Array(63)),
    /invalid signature length/,
  );
  assert.throws(
    () => new Signature("bad", new Uint8Array(64)),
    /invalid signature kind/,
  );

  const decoded = Bcs.deserializeBcs(Bcs.serializeBcs(ed), Signature);
  assert.equal(decoded.kind, ed.kind);
  assert.equal(bytesToHex(decoded.bytes), bytesToHex(ed.bytes));
});

test("ed25519 secret key signs hello world with Rust-compatible bytes", async () => {
  const secretKey = SecretKey.fromHex(
    "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
  );
  const publicKey = await secretKey.ed25519Public();
  const signature = await secretKey.signEd25519(
    new TextEncoder().encode("hello world"),
  );

  assert.equal(
    publicKey.toHex(),
    "03a107bff3ce10be1d70dd18e74bc09967e4d6309ba50d5f1ddc8664125531b8",
  );
  assert.equal(
    signature.toHex(),
    "c9e88a06c88855aa75f90bcfdc5a87b76a99c0d2044114b8931e72089e7b8c7ac6b4a9776b57326f2d781aa8da8821fe6b4c7296fde0b63ca24d7f6343ac6a0a",
  );
});

test("SecretKey.generateEd25519 creates a 32-byte classical key", async () => {
  const secretKey = SecretKey.generateEd25519();
  const publicKey = await secretKey.ed25519Public();

  assert.equal(secretKey.kind, "CLASSICAL");
  assert.equal(secretKey.bytes.length, 32);
  assert.equal(publicKey.kind, PublicKeyKind.ED25519);
  assert.equal(publicKey.bytes.length, 32);
});

test("one classical SecretKey supports Ed25519, secp256k1, and BLS12-381", async () => {
  const secretKey = SecretKey.generateClassical();
  const alias = SecretKey.generate();
  const message = new TextEncoder().encode("shared classical secret");

  const [edPublic, secpPublic, blsPublic] = await Promise.all([
    secretKey.ed25519Public(),
    secretKey.secp256k1Public(),
    secretKey.bls12381Public(),
  ]);
  const [edSignature, secpSignature, blsSignature] = await Promise.all([
    secretKey.signEd25519(message),
    secretKey.signSecp256k1(message),
    secretKey.signBls12381(message),
  ]);

  assert.equal(secretKey.kind, "CLASSICAL");
  assert.equal(secretKey.bytes.length, 32);
  assert.equal(alias.kind, "CLASSICAL");
  assert.equal(edPublic.kind, PublicKeyKind.ED25519);
  assert.equal(secpPublic.kind, PublicKeyKind.SECP256K1);
  assert.equal(blsPublic.kind, PublicKeyKind.BLS12381);
  assert.equal(edSignature.kind, SignatureKind.ED25519);
  assert.equal(secpSignature.kind, SignatureKind.SECP256K1);
  assert.equal(blsSignature.kind, SignatureKind.BLS12381);
});

test("SecretKey generation helpers create curve-compatible keys", async () => {
  const message = new TextEncoder().encode("generated secret key");

  const secpSecretKey = SecretKey.generateSecp256k1();
  const secpPublicKey = await secpSecretKey.secp256k1Public();
  const secpSignature = await secpSecretKey.signSecp256k1(message);
  assert.equal(secpSecretKey.kind, "CLASSICAL");
  assert.equal(secpSecretKey.bytes.length, 32);
  assert.equal(secpPublicKey.kind, PublicKeyKind.SECP256K1);
  assert.equal(secpPublicKey.bytes.length, 33);
  assert.equal(secpSignature.kind, SignatureKind.SECP256K1);
  assert.equal(
    secp256k1.verify(
      secpSignature.bytes.slice(0, 64),
      blake3Hash(message),
      secpPublicKey.bytes,
    ),
    true,
  );

  const blsSecretKey = SecretKey.generateBls12381();
  const blsPublicKey = await blsSecretKey.bls12381Public();
  const blsSignature = await blsSecretKey.signBls12381(message);
  assert.equal(blsSecretKey.kind, "CLASSICAL");
  assert.equal(blsSecretKey.bytes.length, 32);
  assert.equal(blsPublicKey.kind, PublicKeyKind.BLS12381);
  assert.equal(blsPublicKey.bytes.length, 48);
  assert.equal(blsSignature.kind, SignatureKind.BLS12381);
  assert.equal(bls12_381.verify(blsSignature.bytes, message, blsPublicKey.bytes), true);

  const fnDsaSecretKey = SecretKey.generateFnDsa512();
  const fnDsaAlias = SecretKey.generateDsa512();
  const fnDsaPublicKey = await fnDsaSecretKey.fnDsa512Public();
  const fnDsaSignature = await fnDsaSecretKey.signFnDsa512(message);
  assert.equal(fnDsaSecretKey.kind, "FN_DSA512");
  assert.equal(fnDsaAlias.kind, "FN_DSA512");
  assert.equal(fnDsaSecretKey.bytes.length, 1281);
  assert.equal(fnDsaAlias.bytes.length, 1281);
  assert.equal(fnDsaPublicKey.kind, PublicKeyKind.FN_DSA512);
  assert.equal(fnDsaPublicKey.bytes.length, 897);
  assert.equal(fnDsaSignature.kind, SignatureKind.FN_DSA512);
  assert.equal(fnDsaSignature.bytes.length, 666);
  assert.equal(verifyFnDsa512(fnDsaSignature.bytes, fnDsaPublicKey.bytes, new Uint8Array(), ID_RAW, message), true);
});

test("mnemonic derivation produces stable classical and pq addresses", async () => {
  assert.equal(validateMnemonic24(TEST_MNEMONIC), true);
  assert.equal(validateMnemonic24(TEST_MNEMONIC.split(" ").slice(0, 23).join(" ")), false);
  assert.equal(createMilonClassicalDerivationPath(0), "m/44'/1111'/0'/0'");
  assert.equal(createMilonPqDerivationPath(0), "m/44'/1111'/0'/1'");
  assert.equal(createMilonDerivationPath(0), "m/44'/1111'/0'/1'");

  const classicalPath0 = createMilonClassicalDerivationPath(0);
  const classicalPath1 = createMilonClassicalDerivationPath(1);
  const classicalKey0a = deriveEd25519PrivateKeyFromMnemonic(classicalPath0, TEST_MNEMONIC);
  const classicalKey0b = deriveEd25519PrivateKeyFromMnemonic(classicalPath0, TEST_MNEMONIC);
  const classicalKey1 = deriveEd25519PrivateKeyFromMnemonic(classicalPath1, TEST_MNEMONIC);
  assert.deepEqual(Array.from(classicalKey0a), Array.from(classicalKey0b));
  assert.notDeepEqual(Array.from(classicalKey0a), Array.from(classicalKey1));

  const classical0a = await deriveMilonClassicalAddressFromMnemonic(0, TEST_MNEMONIC);
  const classical0b = await deriveMilonAccountFromDerivationPath(classicalPath0, TEST_MNEMONIC);
  const classical1 = await deriveMilonClassicalAddressFromMnemonic(1, TEST_MNEMONIC);
  assert.equal(classical0a.toHex(), classical0b.address.toHex());
  assert.notEqual(classical0a.toHex(), classical1.toHex());
  assert.equal(classical0b.secretKey.kind, "CLASSICAL");
  assert.equal(classical0b.publicKey.kind, PublicKeyKind.ED25519);

  const pqPath0 = createMilonPqDerivationPath(0);
  const pq0a = await deriveMilonPqAddressFromMnemonic(0, TEST_MNEMONIC);
  const pq0b = await deriveMilonAccountFromDerivationPath(pqPath0, TEST_MNEMONIC);
  const pq1 = await deriveMilonPqAddressFromMnemonic(1, TEST_MNEMONIC);
  assert.equal(pq0a.toHex(), pq0b.address.toHex());
  assert.notEqual(pq0a.toHex(), pq1.toHex());
  assert.equal(pq0b.secretKey.kind, "FN_DSA512");
  assert.equal(pq0b.publicKey.kind, PublicKeyKind.FN_DSA512);
});

test("ed25519 secret key signs serde with expected address, signature, and postcard bytes", async () => {
  const secretKey = SecretKey.fromBytes(
    Uint8Array.from([
      246,
      139,
      69,
      97,
      122,
      224,
      49,
      119,
      98,
      212,
      145,
      225,
      141,
      78,
      141,
      165,
      26,
      252,
      149,
      80,
      139,
      72,
      226,
      66,
      166,
      75,
      25,
      1,
      42,
      80,
      106,
      50,
    ]),
  );
  const publicKey = await secretKey.ed25519Public();
  const address = Address.fromEd25519PublicKey(publicKey);
  const signature = await secretKey.signEd25519(
    new TextEncoder().encode("serde"),
  );
  const postcardBytes = serializePostcardBytes(signature.bytes);
  const postcardHex = Buffer.from(postcardBytes).toString("hex");
  const postcardDeserializer = new PostcardDeserializer(postcardBytes);

  assert.equal(
    publicKey.toHex(),
    "0aca5161e6e07f550c63fa307de166a9803c1438baf266e2fe1e52a496c719e0",
  );
  assert.equal(
    bs58.encode(publicKey.bytes),
    "j81TkwY2pqx9fHeQY8kVNYj2rmYwaKeVct1ZpPejQB1",
  );
  assert.equal(address.toHex(), "1543ddbbc89e6e1e07c4899278f02804ff3b38cf");
  assert.equal(address.toBase58(), "JBccRoX8DWt1W4bTkB2uAfEupKp");
  assert.equal(
    signature.toHex(),
    "2ca5fc7575b8e6809894aba359045b150219a9600b289c83efd38b9268a336fa0b907dbb89cecd9ecc20c7578a56c73ef15d68af253963b2c1fac8998225e70e",
  );
  assert.equal(
    bs58.encode(signature.bytes),
    "tmvVmCeWafiGL5wvV2Vni25GhycVkdLNASKG5NLHBxovBtsMQ6xo4roJcGunrPyac8TLuCMGUUdqagv76xDsan9",
  );
  assert.equal(
    postcardHex,
    "402ca5fc7575b8e6809894aba359045b150219a9600b289c83efd38b9268a336fa0b907dbb89cecd9ecc20c7578a56c73ef15d68af253963b2c1fac8998225e70e",
  );
  assert.equal(
    bytesToHex(postcardDeserializer.deserializeBytes()),
    signature.toHex(),
  );
  postcardDeserializer.assertEnd();
  assert.deepEqual(Array.from(postcardBytes), [
    64,
    44,
    165,
    252,
    117,
    117,
    184,
    230,
    128,
    152,
    148,
    171,
    163,
    89,
    4,
    91,
    21,
    2,
    25,
    169,
    96,
    11,
    40,
    156,
    131,
    239,
    211,
    139,
    146,
    104,
    163,
    54,
    250,
    11,
    144,
    125,
    187,
    137,
    206,
    205,
    158,
    204,
    32,
    199,
    87,
    138,
    86,
    199,
    62,
    241,
    93,
    104,
    175,
    37,
    57,
    99,
    178,
    193,
    250,
    200,
    153,
    130,
    37,
    231,
    14,
  ]);
});

test("ed25519 secret key derives expected public key hex and base58", async () => {
  const secretKey = SecretKey.fromHex(
    "931128dbe5f975089a4e770354f78afcddced3412b683270f0f5194b10080f02",
  );
  const publicKey = await secretKey.ed25519Public();

  assert.equal(
    publicKey.toHex(),
    "c9aab3b2727578d80272d7c72cad046aa47b2a67aa82ed581a9a5bc2950900bd",
  );
  assert.equal(
    bs58.encode(publicKey.bytes),
    "EaDvBVeBA5ydj93n94n1pSMxACQER6x2QNHGUBpC2VjJ",
  );
});

test("ed25519 secret key 7011 derives expected public key hex and base58", async () => {
  const secretKey = SecretKey.fromHex(
    "70119711fcfce14858c4eee22c6aa6c626575eeee203e0887edc4f218480ce5a",
  );
  const publicKey = await secretKey.ed25519Public();

  assert.equal(
    publicKey.toHex(),
    "a487bb63695584a5e77c600a35f6bec0cdff5228e905362938d758b9cfca6dc1",
  );
  assert.equal(
    bs58.encode(publicKey.bytes),
    "C5FuThfUw7WSWTTirkpGREEDvQL45poY33osCnMfu6de",
  );
});

test("secp256k1 secret key 7011 derives expected public key hex and base58", async () => {
  const secretKey = SecretKey.fromHex(
    "70119711fcfce14858c4eee22c6aa6c626575eeee203e0887edc4f218480ce5a",
  );
  const publicKey = await secretKey.secp256k1Public();

  assert.equal(
    publicKey.toHex(),
    "02c079a97bbcd7a3ab1dfbdfc4e7ad57e8bc5082fd80e7105ff381080351eed853",
  );
  assert.equal(
    bs58.encode(publicKey.bytes),
    "pQycq7xkRnKRjgWGHboTFcS1ZfTYduTFoL8VEc1A4WTL",
  );
});

test("secp256k1 public key fixed vector postcard bytes", () => {
  const publicKey = PublicKey.fromHex(
    "0287a04607429484645df89421b0e6a6980931d4bd56d5d97fb0663f1885826ba9",
  );
  const postcardBytes = serializePostcardBytes(publicKey.bytes);
  const postcardDeserializer = new PostcardDeserializer(postcardBytes);

  assert.equal(
    bs58.encode(publicKey.bytes),
    "kb4XaU7pK7QY2wEJCKLhMHo3TsaDxPovHr1BYcpWctet",
  );
  assert.equal(
    Buffer.from(postcardBytes).toString("hex"),
    "210287a04607429484645df89421b0e6a6980931d4bd56d5d97fb0663f1885826ba9",
  );
  assert.equal(
    bytesToHex(postcardDeserializer.deserializeBytes()),
    publicKey.toHex(),
  );
  postcardDeserializer.assertEnd();
  assert.deepEqual(Array.from(postcardBytes), [
    33,
    2,
    135,
    160,
    70,
    7,
    66,
    148,
    132,
    100,
    93,
    248,
    148,
    33,
    176,
    230,
    166,
    152,
    9,
    49,
    212,
    189,
    86,
    213,
    217,
    127,
    176,
    102,
    63,
    24,
    133,
    130,
    107,
    169,
  ]);
});

test("secp256k1 signature over serde has expected signature and postcard bytes", async () => {
  // Rust sign_secp256k1(b"serde") for this secret key:
  // sk bytes -> f68b45617ae0317762d491e18d4e8da51afc95508b48e242a64b19012a506a32
  // message  -> "serde" -> 7365726465
  // raw blake3(message) ->
  //   731a15093da15e7277bc1e223a2b0b62115b7dbf6a1edf81e383df869c511096
  // recoverable secp256k1 signature parts:
  //   r = d4bc0629cd1b04a678fbab55ba2bcd1352fa6129a36913676bcacc6e901b0018
  //   s = 3ae6cbefe91d7ce6660e159569c7f482109d9d35700ddfe4c771038d1e9e2d54
  //   recovery_id = 1
  // Rust stores the last byte as recovery_id + 27 = 28 = 0x1c
  // final 65-byte signature:
  //   d4bc0629cd1b04a678fbab55ba2bcd1352fa6129a36913676bcacc6e901b0018
  //   3ae6cbefe91d7ce6660e159569c7f482109d9d35700ddfe4c771038d1e9e2d54
  //   1c
  // postcard bytes then encode serialize_bytes(sig): postcard u32 length (0x41) || 65-byte signature
  const secretKey = SecretKey.fromBytes(
    Uint8Array.from([
      246,
      139,
      69,
      97,
      122,
      224,
      49,
      119,
      98,
      212,
      145,
      225,
      141,
      78,
      141,
      165,
      26,
      252,
      149,
      80,
      139,
      72,
      226,
      66,
      166,
      75,
      25,
      1,
      42,
      80,
      106,
      50,
    ]),
  );
  const digest = blake3Hash(new TextEncoder().encode("serde"));
  const signature = await secretKey.signSecp256k1(
    new TextEncoder().encode("serde"),
  );
  const postcardBytes = serializePostcardBytes(signature.bytes);
  const postcardDeserializer = new PostcardDeserializer(postcardBytes);

  assert.equal(
    bytesToHex(digest),
    "731a15093da15e7277bc1e223a2b0b62115b7dbf6a1edf81e383df869c511096",
  );
  assert.equal(
    signature.toHex(),
    "d4bc0629cd1b04a678fbab55ba2bcd1352fa6129a36913676bcacc6e901b00183ae6cbefe91d7ce6660e159569c7f482109d9d35700ddfe4c771038d1e9e2d541c",
  );
  assert.equal(
    bs58.encode(signature.bytes),
    "KmqABJZQ3VNpUMBKEwqCK1KT23ZxZVJhiw6mf7Lddb94CnYUHx8JiGgQGdZ2Sdsput6hJ1utL3pDwthgJFhr1zC5Z",
  );
  assert.equal(
    Buffer.from(postcardBytes).toString("hex"),
    "41d4bc0629cd1b04a678fbab55ba2bcd1352fa6129a36913676bcacc6e901b00183ae6cbefe91d7ce6660e159569c7f482109d9d35700ddfe4c771038d1e9e2d541c",
  );
  assert.equal(
    bytesToHex(postcardDeserializer.deserializeBytes()),
    signature.toHex(),
  );
  postcardDeserializer.assertEnd();
  assert.deepEqual(Array.from(postcardBytes), [
    65,
    212,
    188,
    6,
    41,
    205,
    27,
    4,
    166,
    120,
    251,
    171,
    85,
    186,
    43,
    205,
    19,
    82,
    250,
    97,
    41,
    163,
    105,
    19,
    103,
    107,
    202,
    204,
    110,
    144,
    27,
    0,
    24,
    58,
    230,
    203,
    239,
    233,
    29,
    124,
    230,
    102,
    14,
    21,
    149,
    105,
    199,
    244,
    130,
    16,
    157,
    157,
    53,
    112,
    13,
    223,
    228,
    199,
    113,
    3,
    141,
    30,
    158,
    45,
    84,
    28,
  ]);
});

test("seed array derives expected ed25519 public key hex and base58", async () => {
  const secretKey = SecretKey.fromBytes(
    Uint8Array.from([
      246,
      139,
      69,
      97,
      122,
      224,
      49,
      119,
      98,
      212,
      145,
      225,
      141,
      78,
      141,
      165,
      26,
      252,
      149,
      80,
      139,
      72,
      226,
      66,
      166,
      75,
      25,
      1,
      42,
      80,
      106,
      50,
    ]),
  );

  const publicKey = await secretKey.ed25519Public();
  const address = Address.fromEd25519PublicKey(publicKey);
  assert.equal(
    publicKey.toHex(),
    "0aca5161e6e07f550c63fa307de166a9803c1438baf266e2fe1e52a496c719e0",
  );
  assert.equal(
    bs58.encode(publicKey.bytes),
    "j81TkwY2pqx9fHeQY8kVNYj2rmYwaKeVct1ZpPejQB1",
  );
  assert.equal(address.toHex(), "1543ddbbc89e6e1e07c4899278f02804ff3b38cf");
  assert.equal(address.toBase58(), "JBccRoX8DWt1W4bTkB2uAfEupKp");
});

test("seed array derives expected secp256k1 public key hex and base58", async () => {
  const secretKey = SecretKey.fromBytes(
    Uint8Array.from([
      246,
      139,
      69,
      97,
      122,
      224,
      49,
      119,
      98,
      212,
      145,
      225,
      141,
      78,
      141,
      165,
      26,
      252,
      149,
      80,
      139,
      72,
      226,
      66,
      166,
      75,
      25,
      1,
      42,
      80,
      106,
      50,
    ]),
  );
  const publicKey = await secretKey.secp256k1Public();

  assert.equal(
    publicKey.toHex(),
    "0287a04607429484645df89421b0e6a6980931d4bd56d5d97fb0663f1885826ba9",
  );
  assert.equal(
    bs58.encode(publicKey.bytes),
    "kb4XaU7pK7QY2wEJCKLhMHo3TsaDxPovHr1BYcpWctet",
  );
});

test("bls12381 fixed vector public key hex and base58 round trip", () => {
  const publicKey = PublicKey.fromHex(
    "abd55fc825d4795ad0387d2eb6c6ddd65632cb038999ab67a07f253d1bd2126636585f1b4fe76e028b8f800ab9e6ebe1",
  );

  assert.equal(publicKey.kind, PublicKeyKind.BLS12381);
  assert.equal(
    publicKey.toHex(),
    "abd55fc825d4795ad0387d2eb6c6ddd65632cb038999ab67a07f253d1bd2126636585f1b4fe76e028b8f800ab9e6ebe1",
  );
  assert.equal(
    bs58.encode(publicKey.bytes),
    "7JbEaxqUAbV9KWgcLMyS2LrMKWREDVkTiT5F29Uq1qrp7Nn5GLfGZsXrH6KKAsDNbS",
  );
  assert.equal(PublicKey.fromBytes(publicKey.bytes).toHex(), publicKey.toHex());
});

test("seed array maps to expected bls12381 public key vector", () => {
  const seed = Uint8Array.from([
    246,
    139,
    69,
    97,
    122,
    224,
    49,
    119,
    98,
    212,
    145,
    225,
    141,
    78,
    141,
    165,
    26,
    252,
    149,
    80,
    139,
    72,
    226,
    66,
    166,
    75,
    25,
    1,
    42,
    80,
    106,
    50,
  ]);
  const seedHex = bytesToHex(seed);
  const publicKey = PublicKey.fromHex(
    "a26bbb5f02579e2fa9888b833f832cb94861f5da018cce5a06fe574df52813845ecbad418834d6af2f38bc171b5ec303",
  );

  assert.equal(
    seedHex,
    "f68b45617ae0317762d491e18d4e8da51afc95508b48e242a64b19012a506a32",
  );
  assert.equal(publicKey.kind, PublicKeyKind.BLS12381);
  assert.equal(
    publicKey.toHex(),
    "a26bbb5f02579e2fa9888b833f832cb94861f5da018cce5a06fe574df52813845ecbad418834d6af2f38bc171b5ec303",
  );
  assert.equal(
    bs58.encode(publicKey.bytes),
    "6xZiKY2vwFj5kabxj5dfCb1dQHRxwQzAZA44apGPDCadZYtr2yXnNDeJf6QN6bPv5x",
  );
  assert.equal(PublicKey.fromBytes(publicKey.bytes).toHex(), publicKey.toHex());
});

test("fn-dsa512 secret key derives expected public key encodings", async () => {
  const secretKey = SecretKey.fromBytes(bs58.decode(FN_DSA512_SECRET_KEY_BS58));
  const publicKey = await secretKey.fnDsa512Public();
  const expectedPublicKey = PublicKey.fromHex(FN_DSA512_PUBLIC_KEY_HEX);
  const address = Address.fromPublicKey(publicKey);

  assert.equal(secretKey.kind, "FN_DSA512");
  assert.equal(secretKey.bytes.length, 1281);
  assert.equal(secretKey.toHex(), bs58ToHex(FN_DSA512_SECRET_KEY_BS58));

  assert.equal(publicKey.kind, PublicKeyKind.FN_DSA512);
  assert.equal(publicKey.bytes.length, 897);
  assert.equal(publicKey.toHex(), FN_DSA512_PUBLIC_KEY_HEX);
  assert.equal(bs58.encode(publicKey.bytes), FN_DSA512_PUBLIC_KEY_BS58);
  assert.equal(PublicKey.fromBytes(publicKey.bytes).toHex(), FN_DSA512_PUBLIC_KEY_HEX);
  assert.equal(publicKey.toHex(), expectedPublicKey.toHex());
  assert.equal(bs58.encode(expectedPublicKey.bytes), FN_DSA512_PUBLIC_KEY_BS58);

  assert.equal(address.bytes.length, Address.LENGTH);
  assert.equal(Address.fromPublicKey(publicKey).equals(address), true);
});

test("fn-dsa512 secret key signs messages with FN_DSA512 signatures", async () => {
  const secretKey = SecretKey.fromBytes(bs58.decode(FN_DSA512_SECRET_KEY_BS58));
  const publicKey = await secretKey.fnDsa512Public();
  const message = new Uint8Array([1, 2, 3, 4, 5]);
  const signature = await secretKey.signFnDsa512(message);

  assert.equal(signature.kind, SignatureKind.FN_DSA512);
  assert.equal(signature.bytes.length, 666);
  assert.equal(verifyFnDsa512(signature.bytes, publicKey.bytes, new Uint8Array(), ID_RAW, message), true);
});

test("bls12381 secret key signs messages with BLS12381 signatures", async () => {
  const secretKey = SecretKey.fromBytes(
    Uint8Array.from([
      246,
      139,
      69,
      97,
      122,
      224,
      49,
      119,
      98,
      212,
      145,
      225,
      141,
      78,
      141,
      165,
      26,
      252,
      149,
      80,
      139,
      72,
      226,
      66,
      166,
      75,
      25,
      1,
      42,
      80,
      106,
      50,
    ]),
  );
  const publicKey = await secretKey.bls12381Public();
  const message = new Uint8Array([9, 8, 7, 6, 5]);
  const signature = await secretKey.signBls12381(message);

  assert.equal(signature.kind, SignatureKind.BLS12381);
  assert.equal(signature.bytes.length, 96);
  assert.equal(bls12_381.verify(signature.bytes, message, publicKey.bytes), true);
});

test("addresses and virtual addresses derive, encode, and round trip", () => {
  const pk = new PublicKey(
    PublicKeyKind.ED25519,
    hexToBytes(
      "037a590c5fb52127718c7487547e829bf1918a40d6005e3797756dd565b28d5e",
    ),
  );
  const address = Address.fromPublicKey(pk);
  const fnDsaPublicKey = new PublicKey(PublicKeyKind.FN_DSA512, new Uint8Array(897).fill(7));
  const fnDsaAddress = Address.fromPublicKey(fnDsaPublicKey);
  const supportedPublicKeys = [
    pk,
    new PublicKey(PublicKeyKind.SECP256K1, new Uint8Array(33).fill(2)),
    new PublicKey(PublicKeyKind.BLS12381, new Uint8Array(48).fill(3)),
    fnDsaPublicKey,
  ];
  for (const publicKey of supportedPublicKeys) {
    assert.equal(Address.fromPublicKey(publicKey).bytes.length, Address.LENGTH);
  }
  assert.equal(address.bytes.length, Address.LENGTH);
  assert.equal(fnDsaAddress.bytes.length, Address.LENGTH);
  assert.equal(fnDsaAddress.equals(address), false);
  assert.equal(Address.from(address), address);
  assert.equal(Address.fromHex(address.toHex(true)).equals(address), true);
  assert.equal(address.toBase58(), bs58.encode(address.bytes));
  assert.equal(
    Address.zero().toHex(),
    "0000000000000000000000000000000000000000",
  );
  assert.equal(
    Address.fromEd25519PublicKey(pk).equals(address),
    true,
  );

  const vir = VirAddress.fromPublicKey(pk, 0x01020304);
  const pqVir = VirAddress.fromPublicKey(fnDsaPublicKey, 9);
  assert.equal(vir.bytes.length, VirAddress.LENGTH);
  assert.equal(pqVir.bytes.length, VirAddress.LENGTH);
  assert.equal(VirAddress.from(vir), vir);
  assert.equal(VirAddress.from(address).no, 0);
  assert.equal(VirAddress.from(vir.bytes).no, 0x01020304);
  assert.equal(vir.asSigner().address.equals(address), true);
  assert.deepEqual(vir.toJSON(), { primary: address.toJSON(), no: 0x01020304 });
  assert.throws(() => new VirAddress(address, -1), /u32/);

  const signer = new Signer(address);
  const virSigner = new VirSigner(vir);
  assert.equal(signer.toJSON(), address.toJSON());
  assert.equal(virSigner.asSigner().address.equals(address), true);
  assert.deepEqual(virSigner.toJSON(), vir.toJSON());

  assert.equal(
    Bcs.deserializeBcs(Bcs.serializeBcs(address), Address).equals(address),
    true,
  );
  assert.equal(
    Bcs.deserializeBcs(Bcs.serializeBcs(vir), VirAddress).no,
    vir.no,
  );
});

test("secret keys accept classical and fn-dsa512 lengths and gate classical-only helpers", async () => {
  const classical = SecretKey.fromBytes(new Uint8Array(32).fill(1));
  const fnDsa = SecretKey.fromBytes(new Uint8Array(1281).fill(2));

  assert.equal(classical.kind, "CLASSICAL");
  assert.equal(fnDsa.kind, "FN_DSA512");
  assert.deepEqual(fnDsa.toJSON(), {
    kind: "FN_DSA512",
    hex: fnDsa.toHex(),
  });
  await assert.rejects(() => fnDsa.ed25519Public(), /classical secret keys/);
  await assert.rejects(() => fnDsa.secp256k1Public(), /classical secret keys/);
  await assert.rejects(() => fnDsa.bls12381Public(), /classical secret keys/);
  await assert.rejects(() => fnDsa.signEd25519(new Uint8Array([1])), /classical secret keys/);
  await assert.rejects(() => fnDsa.signSecp256k1(new Uint8Array([1])), /classical secret keys/);
  await assert.rejects(() => classical.fnDsa512Public(), /FN_DSA512 secret keys/);
  await assert.rejects(() => classical.signFnDsa512(new Uint8Array([1])), /FN_DSA512 secret keys/);
  assert.throws(() => SecretKey.fromBytes(new Uint8Array(31)), /32 or 1281 bytes/);
});
