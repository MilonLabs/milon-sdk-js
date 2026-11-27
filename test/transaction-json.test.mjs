import test from "node:test";
import assert from "node:assert/strict";
import {
  Address,
  Postcard,
  SecretKey,
  TransactionJsonCodec,
  TransactionJsonError,
  bytesToHex,
  transactionFromJson,
  transactionToJson,
  viewInstructionsFromJson,
  viewJsonToPostcard,
} from "../dist/index.js";

const codec = new TransactionJsonCodec();
const token = new Address(new Uint8Array(20).fill(2)).toBase58();
const owner = new Address(new Uint8Array(20).fill(3)).toBase58();
const recipient = new Address(new Uint8Array(20).fill(4)).toBase58();

function createTokenJson(overrides = {}) {
  return {
    app: "Token",
    tx: {
      stamp: "1212121212",
      payer: owner,
      instructions: [
        {
          method: "Create",
          args: {
            token,
            owner,
            metadata: {
              name: "SDK Test Token",
              symbol: "SDKT",
              decimals: 6,
              icon: "https://milon.test/token.png",
              uri: "https://milon.test/token.png",
            },
          },
        },
      ],
      chainId: "10010",
      ...overrides,
    },
  };
}

test("TransactionJsonCodec converts the needs.md Token JSON in both directions", () => {
  const tx = codec.fromJson(JSON.stringify(createTokenJson()));
  const json = codec.toJson(tx);

  assert.equal(tx.stamp, 1212121212n);
  assert.equal(tx.chainId, 10010n);
  assert.equal(tx.payer.toBase58(), owner);
  assert.equal(tx.instructions.length, 1);
  assert.equal(json.app.toLowerCase(), "token");
  assert.equal(json.tx.instructions[0].method, "Create");
  assert.deepEqual(json.tx.instructions[0].args.metadata, {
    name: "SDK Test Token",
    symbol: "SDKT",
    decimals: 6,
    icon: "https://milon.test/token.png",
              uri: "https://milon.test/token.png",
  });
  assert.equal(json.tx.stamp, "1212121212");
  assert.equal(json.tx.chainId, "10010");

  const roundTripped = codec.fromJson(json);
  assert.equal(
    bytesToHex(roundTripped.postcardToBytes()),
    bytesToHex(tx.postcardToBytes()),
  );
  assert.equal(bytesToHex(roundTripped.hash), bytesToHex(tx.hash));
});

test("TransactionJsonCodec supports instructions from multiple app IDLs", () => {
  const tx = transactionFromJson({
    tx: {
      stamp: "100",
      payer: owner,
      chainId: "10010",
      instructions: [
        {
          app: "Token",
          method: "Transfer",
          args: {
            from: owner,
            token,
            to: recipient,
            amount: "9007199254740993",
          },
        },
        {
          app: "Account",
          method: "SetThreshold",
          args: {
            owner,
            threshold: 2,
          },
        },
      ],
    },
  });
  const json = transactionToJson(tx);

  assert.equal(json.app, undefined);
  assert.deepEqual(
    json.tx.instructions.map(({ method }) => method),
    ["Transfer", "SetThreshold"],
  );
  assert.equal(
    json.tx.instructions[0].args.amount,
    "9007199254740993",
  );
  assert.deepEqual(
    json.tx.instructions.map(({ app }) => app.toLowerCase()),
    ["token", "account"],
  );
});

test("TransactionJsonCodec preserves signatures made with a rotated key", async () => {
  const originalSecret = SecretKey.generateClassical();
  const rotatedSecret = SecretKey.generateClassical();
  const originalPublic = await originalSecret.ed25519Public();
  const rotatedPublic = await rotatedSecret.ed25519Public();
  const accountOwner = Address.fromPublicKey(originalPublic);
  const accountOwnerBase58 = accountOwner.toBase58();
  const tx = codec.fromJson(
    createTokenJson({
      payer: accountOwnerBase58,
      instructions: [
        {
          method: "Transfer",
          args: {
            from: accountOwnerBase58,
            token,
            to: recipient,
            amount: "42",
          },
        },
      ],
    }),
  );

  await tx.signEd25519(accountOwner, rotatedSecret, {
    publicKey: rotatedPublic,
    multisigKeyIndex: 4,
  });
  const json = codec.toJson(tx);
  const decoded = codec.fromJson(json);

  assert.equal(json.tx.signatures.length, 1);
  assert.equal(json.tx.signatures[0].owner, accountOwnerBase58);
  assert.equal(json.tx.signatures[0].sigBit, (1n << 4n).toString());
  assert.equal(json.tx.signatures[0].publicKey, null);
  assert.equal(
    bytesToHex(decoded.postcardToBytes()),
    bytesToHex(tx.postcardToBytes()),
  );
  decoded.validateWire();
});

test("TransactionJsonCodec decodes postcard bytes when chainId is supplied", () => {
  const tx = codec.fromJson(createTokenJson());
  const json = codec.fromPostcard(tx.postcardToBytes(), {
    chainId: tx.chainId,
  });

  assert.equal(json.tx.chainId, "10010");
  assert.equal(json.tx.instructions[0].method, "Create");
});

test("TransactionJsonCodec returns stable error codes and JSON paths", () => {
  assert.throws(
    () =>
      codec.fromJson(
        createTokenJson({ stamp: Number.MAX_SAFE_INTEGER + 1 }),
      ),
    (error) => {
      assert.ok(error instanceof TransactionJsonError);
      assert.equal(error.code, "UNSAFE_INTEGER");
      assert.equal(error.path, "$.tx.stamp");
      return true;
    },
  );

  const typo = createTokenJson();
  typo.tx.instructions[0].args.metdata =
    typo.tx.instructions[0].args.metadata;
  delete typo.tx.instructions[0].args.metadata;
  assert.throws(
    () => codec.fromJson(typo),
    (error) => {
      assert.equal(error.code, "UNKNOWN_ARGUMENT");
      assert.equal(
        error.path,
        "$.tx.instructions[0].args.metdata",
      );
      return true;
    },
  );
});

test("TransactionJsonCodec rejects duplicate signature owners", async () => {
  const secret = SecretKey.generateClassical();
  const publicKey = await secret.ed25519Public();
  const signer = Address.fromPublicKey(publicKey);
  const tx = codec.fromJson(
    createTokenJson({
      payer: signer.toBase58(),
      instructions: [
        {
          method: "Transfer",
          args: {
            from: signer.toBase58(),
            token,
            to: recipient,
            amount: "1",
          },
        },
      ],
    }),
  );
  await tx.signEd25519(signer, secret, publicKey);
  const json = codec.toJson(tx);
  json.tx.signatures.push(structuredClone(json.tx.signatures[0]));

  assert.throws(
    () => codec.fromJson(json),
    (error) => {
      assert.equal(error.code, "DUPLICATE_SIGNATURE_OWNER");
      assert.equal(error.path, "$.tx.signatures[1].owner");
      return true;
    },
  );
});

test("TransactionJsonCodec converts BalanceOf View JSON to postcard", () => {
  const input = {
    app: "Token",
    instructions: [{
      method: "BalanceOf",
      args: {
        token: "M11on1111111111111111111111",
        account: "4KHYuLR2NVPPJ72u2w5uEyZvA5MH",
      },
    }],
  };
  const instructions = viewInstructionsFromJson(JSON.stringify(input));
  const postcard = viewJsonToPostcard(input);

  assert.equal(instructions.length, 1);
  assert.equal(instructions[0][0], 2);

  const deserializer = new Postcard.PostcardDeserializer(postcard);
  assert.equal(deserializer.deserializeU32(), 1);
  assert.deepEqual(
    deserializer.deserializeBytes(),
    instructions[0],
  );
  deserializer.assertEnd();
});

test("TransactionJsonCodec rejects entry methods in View JSON", () => {
  assert.throws(
    () =>
      codec.viewFromJson({
        app: "Token",
        instructions: [{
          method: "Create",
          args: {
            token,
            owner,
            metadata: {
              name: "SDK Test Token",
              symbol: "SDKT",
              decimals: 6,
              icon: "https://milon.test/token.png",
              uri: "https://milon.test/token.png",
            },
          },
        }],
      }),
    (error) => {
      assert.equal(error.code, "METHOD_NOT_VIEW");
      assert.equal(error.path, "$.instructions[0].method");
      return true;
    },
  );
});
