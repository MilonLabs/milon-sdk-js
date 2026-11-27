import test from "node:test";
import assert from "node:assert/strict";
import {
  Account,
  Address,
  PublicKey,
  PublicKeyKind,
  ResourceId,
  Signature,
  SignatureKind,
  Token,
  bytesToHex,
  defaultPathHasher,
  resourcePathKey
} from "../dist/index.js";

const addressA = new Address(new Uint8Array(20).fill(1));
const addressB = new Address(new Uint8Array(20).fill(2));
const publicKey = new PublicKey(PublicKeyKind.ED25519, new Uint8Array(32).fill(3));
const signature = new Signature(SignatureKind.ED25519, new Uint8Array(64).fill(4));

test("Account instruction builders expose expected variants and normalized fields", () => {
  assert.equal(Account.APP_NAME, "account");
  assert.equal(Account.create(publicKey).variant, "Create");
  assert.equal(Account.createIfNotExists(publicKey).variant, "CreateIfNotExists");

  const createWithSigners = Account.createWithSigners(addressA, [publicKey], 1);
  assert.equal(createWithSigners.app, "account");
  assert.equal(createWithSigners.variant, "CreateWithSigners");
  assert.equal(createWithSigners.fields.owner.address.equals(addressA), true);
  assert.equal(createWithSigners.fields.signers[0], publicKey);
  assert.equal(createWithSigners.fields.threshold, 1);

  assert.equal(Account.addSigner(addressA, publicKey).variant, "AddSigner");
  assert.equal(Account.setThreshold(addressA, 2).fields.threshold, 2);
  assert.equal(Account.get(addressA).fields.owner.equals(addressA), true);

  const verify = Account.verify(addressA, new Uint8Array([1]), [signature], 1n);
  assert.equal(verify.variant, "Verify");
  assert.equal(verify.fields.signatures[0], signature);
  assert.equal(verify.fields.sig_bit, 1n);
});

test("Token instruction builders expose expected variants and validate metadata", () => {
  assert.equal(Token.APP_NAME, "token");
  const metadata = Token.normalizeMetadata({ name: "Milon", symbol: "MIL", decimals: 9, icon: "https://icon", uri: "https://icon" });
  assert.deepEqual(metadata, { name: "Milon", symbol: "MIL", decimals: 9, icon: "https://icon", uri: "https://icon" });
  assert.equal(Token.normalizeMetadata({ name: "Milon", symbol: "MIL", decimals: 9, icon: "https://icon", uri: "" }).uri, "");
  assert.throws(() => Token.normalizeMetadata({ name: "", symbol: "MIL", decimals: 9, icon: "x" }), /name/);
  assert.throws(() => Token.normalizeMetadata({ name: "Milon", symbol: "", decimals: 9, icon: "x" }), /symbol/);
  assert.throws(() => Token.normalizeMetadata({ name: "Milon", symbol: "MIL", decimals: 10, icon: "x" }), /decimals/);
  assert.throws(() => Token.normalizeMetadata({ name: "Milon", symbol: "MIL", decimals: 9, icon: "" }), /icon/);

  assert.equal(Token.create(addressA, addressB, metadata).variant, "Create");
  assert.equal(Token.mint(addressA, addressB, 10n).fields.amount, 10n);
  assert.equal(Token.burn(addressA, addressB, 11n).variant, "Burn");
  assert.equal(Token.transfer(addressA, addressA, addressB, 12n).fields.to.equals(addressB), true);
  assert.equal(Token.transferVir(addressA, addressA, addressB, 13n).fields.to.primary.equals(addressB), true);
  assert.equal(Token.approve(addressA, addressA, addressB, 14n).fields.spender.equals(addressB), true);
  assert.equal(Token.transferFrom(addressA, addressA, addressB, 15n).fields.to.address.equals(addressB), true);
  assert.equal(Token.balanceOf(addressA, addressB).variant, "BalanceOf");
  assert.equal(Token.totalSupply(addressA).variant, "TotalSupply");
  assert.equal(Token.metadata(addressA).variant, "Metadata");
});

test("ResourceId and path helpers hash supported path values", () => {
  const id = new ResourceId({ app: "token", name: "_Balance", path: [addressA, "owner", 7n] });
  assert.equal(id.app, "token");
  assert.equal(id.name, "_Balance");
  assert.equal(id.hash.length, 32);
  assert.equal(id.toJSON().hash.length, 32);

  assert.deepEqual(Array.from(defaultPathHasher(addressA)), Array.from(addressA.bytes));
  assert.deepEqual(Array.from(defaultPathHasher(new Uint8Array([1, 2]))), [1, 2]);
  assert.equal(new TextDecoder().decode(defaultPathHasher("abc")), "abc");
  assert.equal(new TextDecoder().decode(defaultPathHasher(12)), "12");
  assert.equal(bytesToHex(resourcePathKey(addressA, "x")).startsWith(addressA.toHex()), true);
  assert.throws(() => new ResourceId({ app: "", name: "x" }), /requires app and name/);
});
