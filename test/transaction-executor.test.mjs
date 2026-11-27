import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { keygen as keygenFnDsa } from "../dist/vendor/fndsa.js";
import {
  AccountSignature,
  AccountView,
  Address,
  Bcs,
  Block,
  ChainHead,
  ClientHandler,
  EventsByTxHashRequest,
  EventsByTxHashResponse,
  Network,
  NetworkToChainId,
  NetworkToNetworkName,
  PackedInstruction,
  Postcard,
  PublicKey,
  PublicKeyKind,
  SecretKey,
  Signature,
  SignatureKind,
  Transaction,
  TransactionCodec,
  TxHistoryInclusionProof,
  TokenMethods,
  MAX_PACKED_INSTRUCTION_LEN,
  MIN_PACKED_INSTRUCTION_LEN,
  RpcMethodEnum,
  bs58ToBytes,
  bytesToBs58,
  bytesToHex,
  chainIdToBytes,
  claim_faucet,
  createAccount,
  getChainId,
  getChainState,
  getAccount,
  getEndPoint,
  getResource,
  get_access_value,
  get_resource_path_by_hash,
  getTxByHash,
  getTxHistoryProof,
  getNetwork,
  normalizeNetwork,
  resolveChainId,
  serializeInvokeRequest,
  deserializeRpcBody,
  setChainId,
  setChainState,
  setNetwork,
  txProofIdentifier,
} from "../dist/index.js";
const accountIdl = JSON.parse(
  readFileSync(new URL("../IDL/account.idl.json", import.meta.url), "utf8"),
);
const tokenIdl = JSON.parse(
  readFileSync(new URL("../IDL/token.idl.json", import.meta.url), "utf8"),
);
const address = new Address(new Uint8Array(20).fill(3));
const publicKey = new PublicKey(
  PublicKeyKind.ED25519,
  new Uint8Array(32).fill(1),
);
const signature = new Signature(
  SignatureKind.ED25519,
  new Uint8Array(64).fill(2),
);

test("RpcMethodEnum matches the categorized Rust method IDs", () => {
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(RpcMethodEnum).filter(
        ([, value]) => typeof value === "number",
      ),
    ),
    {
      chain_head: 1,
      submit_tx: 5,
      batch_submit_tx: 6,
      simulate_tx: 10,
      batch_simulate_tx: 11,
      view: 15,
      batch_view: 16,
      get_account: 20,
      batch_get_account: 21,
      events_by_tx_hash: 25,
      batch_events_by_tx_hash: 26,
      node_capability: 30,
      get_block_by_height: 50,
      batch_get_block_by_height: 51,
      get_tx_by_hash: 55,
      batch_get_tx_by_hash: 56,
      get_tx_history_proof: 60,
      batch_get_tx_history_proof: 61,
      get_resource: 150,
      batch_get_resource: 151,
      get_resource_path_by_hash: 155,
      batch_get_resource_path_by_hash: 160,
      get_access_value: 165,
      batch_get_access_value: 166,
      keyless_providers: 200,
      keyless_sessions: 205,
      keyless_binding: 210,
      keyless_is_keyless: 215,
      keyless_provider: 220,
      keyless_audience: 225,
      keyless_params: 230,
      keyless_provider_status: 235,
      keyless_selected_jwk: 240,
      validator_locations: 300,
    },
  );
});

test("keyless RPC methods encode Rust request bodies and decode IDL responses", () => {
  const request = serializeInvokeRequest(
    RpcMethodEnum.keyless_sessions,
    7,
    address,
  );
  const deserializer = new Postcard.PostcardDeserializer(request);
  assert.equal(deserializer.deserializeU16(), 205);
  assert.equal(deserializer.deserializeU64(), 7n);
  assert.deepEqual(deserializer.deserializeBytes(), address.bytes);
  deserializer.assertEnd();

  assert.deepEqual(
    deserializeRpcBody(RpcMethodEnum.keyless_providers, Uint8Array.of(0)),
    [],
  );
  assert.deepEqual(
    deserializeRpcBody(RpcMethodEnum.keyless_sessions, Uint8Array.of(0)),
    [],
  );
  assert.equal(
    deserializeRpcBody(RpcMethodEnum.keyless_binding, Uint8Array.of(0)),
    undefined,
  );
  assert.equal(
    deserializeRpcBody(RpcMethodEnum.keyless_is_keyless, Uint8Array.of(1)),
    true,
  );
});

test("node_capability uses method 30 and decodes its postcard response", () => {
  const request = serializeInvokeRequest(
    RpcMethodEnum.node_capability,
    7,
    undefined,
  );
  const requestDeserializer = new Postcard.PostcardDeserializer(request);
  assert.equal(requestDeserializer.deserializeU16(), 30);
  assert.equal(requestDeserializer.deserializeU64(), 7n);
  assert.deepEqual(requestDeserializer.deserializeBytes(), new Uint8Array());

  const response = new Postcard.PostcardSerializer();
  response.serializeU32(1);
  response.serializeU32(9); // features
  response.serializeBool(true);
  response.serializeFixedBytes(new Uint8Array(32).fill(1));
  response.serializeU64(12n);
  response.serializeU32(1);
  response.serializeU32(7); // missing_active
  response.serializeU32(0); // missing_voting
  response.serializeBool(false);
  response.serializeU32(1);
  response.serializeStr("format");
  response.serializeStr("3");
  response.serializeU64(2n);
  const decoded = deserializeRpcBody(
    RpcMethodEnum.node_capability,
    response.toUint8Array(),
  );
  assert.deepEqual(decoded.features, [9]);
  assert.equal(decoded.height, 12n);
  assert.deepEqual(decoded.missing_active, [7]);
  assert.equal(decoded.supports_all, false);
  assert.deepEqual(decoded.tx_unknown, [
    { kind: "format", value: "3", count: 2n },
  ]);
  assert.deepEqual(Array.from(decoded.binary_digest), new Array(32).fill(1));
});

test("validator_locations uses method 300 and decodes optional coordinates", () => {
  const request = serializeInvokeRequest(
    RpcMethodEnum.validator_locations,
    8,
    undefined,
  );
  const requestDeserializer = new Postcard.PostcardDeserializer(request);
  assert.equal(requestDeserializer.deserializeU16(), 300);
  assert.equal(requestDeserializer.deserializeU64(), 8n);
  assert.deepEqual(requestDeserializer.deserializeBytes(), new Uint8Array());

  const response = new Postcard.PostcardSerializer();
  response.serializeU32(2);
  response.serializeFixedBytes(address.bytes);
  response.serializeBool(true);
  response.serializeStr("CN");
  response.serializeBool(true);
  response.serializeStr("Shanghai");
  response.serializeBool(true);
  response.serializeF64(31.2304);
  response.serializeBool(true);
  response.serializeF64(121.4737);
  response.serializeFixedBytes(new Uint8Array(20).fill(4));
  response.serializeBool(false);
  response.serializeBool(false);
  response.serializeBool(false);
  response.serializeBool(false);
  const decoded = deserializeRpcBody(
    RpcMethodEnum.validator_locations,
    response.toUint8Array(),
  );
  assert.equal(decoded.length, 2);
  assert.equal(decoded[0].account_address.equals(address), true);
  assert.equal(decoded[0].country, "CN");
  assert.equal(decoded[0].city, "Shanghai");
  assert.equal(decoded[0].latitude, 31.2304);
  assert.equal(decoded[0].longitude, 121.4737);
  assert.deepEqual(decoded[1], {
    account_address: new Address(new Uint8Array(20).fill(4)),
  });
});

test("claim_faucet builds a sponsored ClaimFaucet transaction", async () => {
  const claimerSecretKey = SecretKey.fromHex(
    "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
  );
  const responseHash = new Uint8Array(32).fill(9);
  let capturedMethodBody;
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async (_endpoint, init) => {
    const request = new Postcard.PostcardDeserializer(
      new Uint8Array(init.body),
    );
    assert.equal(request.deserializeU16(), RpcMethodEnum.submit_tx);
    request.deserializeU64();
    capturedMethodBody = request.deserializeBytes();
    request.assertEnd();
    return {
      async json() {
        return { request_id: 1, status: 0, body: Array.from(responseHash) };
      },
    };
  };

  try {
    const result = await claim_faucet({
      network: Network.DEVNET,
      tokenIdl,
      claimerSecretKey,
      stamp: 1_000n,
    });

    assert.deepEqual(Array.from(result.body), Array.from(responseHash));
    assert.equal(result.tx.payer, null);
    assert.equal(result.tx.stamp, 1_000n);
    assert.equal(result.tx.instructions.length, 1);
    assert.deepEqual(
      Array.from(result.tx.instructions[0].slice(0, 3)),
      [2, 52, 249],
    );
    assert.deepEqual(
      Array.from(result.tx.instructions[0].slice(3)),
      Array.from(result.claimer.bytes),
    );
    assert.equal(result.tx.signatures.length, 1);
    assert.equal(result.tx.signatures[0][1].authBit, 1n);
    // Pubkey signature mode uses authBit; sigBit is only used for multisig indexes.
    assert.equal(result.tx.signatures[0][1].sigBit, 0n);
    assert.ok(capturedMethodBody instanceof Uint8Array);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

setChainState({
  chainId: 10010n,
  chainName: "milon-devnet",
  genesisHash: new Uint8Array(32).fill(8),
});

// Verifies that chain/network helpers share a stable cached chain state.
test("chain identity helpers manage ChainId and ChainState", () => {
  assert.equal(NetworkToChainId[Network.DEVNET], 10010);
  assert.equal(NetworkToNetworkName.devnet, Network.DEVNET);
  assert.equal(normalizeNetwork("devnet"), Network.DEVNET);
  assert.equal(resolveChainId("devnet"), 10010n);
  assert.equal(getChainId(), 10010n);
  assert.equal(resolveChainId(), 10010n);
  assert.equal(resolveChainId(1n), 1n);
  assert.deepEqual(Array.from(chainIdToBytes(1n)), [0, 0, 0, 0, 0, 0, 0, 1]);
  assert.deepEqual(
    Array.from(chainIdToBytes()),
    Array.from(chainIdToBytes(10010n)),
  );

  const state = getChainState();
  assert.equal(state.chainId, 10010n);
  assert.equal(state.network, Network.DEVNET);
  assert.equal(state.chainName, "milon-devnet");
  assert.equal(state.genesisHash.length, 32);
  state.genesisHash[0] = 1;
  assert.equal(getChainState().genesisHash[0], 8);

  assert.equal(setChainId(10010n).chainId, 10010n);
  assert.equal(setNetwork(Network.DEVNET).chainId, 10010n);
  assert.equal(getNetwork(), Network.DEVNET);
  assert.throws(() => setChainId(900000002n), /already set/);
  assert.throws(
    () => setChainState({ chainId: 1n, network: Network.DEVNET }),
    /does not match network|already set/,
  );
});

// Covers single-sig and multisig account signatures plus their BCS/JSON encodings.
test("AccountSignature single, multisig, BCS, and JSON methods work", () => {
  const single = AccountSignature.single(signature, publicKey);
  assert.equal(single.sigBit, 0n);
  assert.equal(single.signatures[0], signature);
  assert.equal(single.publicKey, publicKey);
  assert.equal(single.toJSON().sig_bit, "0");

  const multi = AccountSignature.multisig([
    { index: 0, signature },
    { index: 2, signature },
  ]);
  assert.equal(multi.sigBit, 5n);
  assert.equal(multi.signatures.length, 2);
  assert.throws(
    () => AccountSignature.multisig([{ index: 64, signature }]),
    /0..63/,
  );

  const decoded = Bcs.deserializeBcs(
    Bcs.serializeBcs(single),
    AccountSignature,
  );
  assert.equal(decoded.sigBit, single.sigBit);
  assert.equal(decoded.publicKey.kind, publicKey.kind);

  const voted = AccountSignature.unsigned(
    AccountSignature.authVoteIxes([0, 2]),
  );
  assert.equal(AccountSignature.AUTH_VOTE_BIT, 62);
  assert.equal(voted.authorizesVote(), true);
  assert.equal(voted.authorizesIx(0), true);
  assert.equal(voted.authorizesIx(2), true);
  assert.equal(voted.signatures.length, 0);
  assert.equal(voted.publicKey, null);
  assert.throws(() => AccountSignature.authIx(62), /0..61/);
});

test("Transaction.addSignature rejects the same owner more than once", () => {
  const owner = new Address(new Uint8Array(20).fill(7));
  const sameOwnerBytes = new Uint8Array(owner.bytes);
  const accountSignature = new AccountSignature({
    authBit: AccountSignature.authIx(0),
  });
  const tx = new Transaction({
    instructions: [new Uint8Array([1, 2, 3])],
  });

  assert.equal(tx.addSignature(owner, accountSignature), tx);
  assert.throws(
    () => tx.addSignature(sameOwnerBytes, accountSignature),
    /duplicate signature owner/,
  );
  assert.equal(tx.signatures.length, 1);
});

// Checks transaction hashing, mutation helpers, codec hooks, and BCS round trips.
test("Transaction hash, mutation, JSON, codec, and BCS round trip work", () => {
  const instructions = [new Uint8Array([9, 8, 7])];
  const packed = new PackedInstruction(instructions[0]);
  assert.deepEqual(Array.from(packed.toBytes()), [9, 8, 7]);
  assert.equal(MIN_PACKED_INSTRUCTION_LEN, 3);
  assert.equal(MAX_PACKED_INSTRUCTION_LEN, 64 * 1024);
  const hash = Transaction.hash(123n, instructions);
  const otherChainHash = Transaction.hash(123n, instructions, 900000002n);
  assert.notEqual(bytesToHex(hash), bytesToHex(otherChainHash));
  const tx = new Transaction({ stamp: 123n, instructions });
  assert.equal(bytesToHex(tx.hash), bytesToHex(hash));
  assert.equal(
    tx.addSignature(address, AccountSignature.single(signature, publicKey)),
    tx,
  );
  assert.equal(tx.toJSON().stamp, "123");
  assert.equal(tx.toJSON().signatures.length, 1);

  const bytes = tx.bcsToBytes();
  const decoded = Bcs.deserializeBcs(bytes, Transaction);
  assert.equal(decoded.stamp, 123n);
  assert.deepEqual(Array.from(decoded.instructions[0]), [9, 8, 7]);
  assert.equal(decoded.signatures.length, 1);
  assert.equal(decoded.signatures[0][0].equals(address), true);

  const codec = new TransactionCodec({
    encodeInstruction: (instruction) => new Uint8Array([instruction.value]),
    encodeTransaction: (value) => value.bcsToBytes(),
    decodeTransaction: (payload) => Bcs.deserializeBcs(payload, Transaction),
  });
  assert.deepEqual(Array.from(codec.encodeInstruction({ value: 5 })), [5]);
  assert.deepEqual(
    codec.decodeTransaction(codec.encodeTransaction(tx)).toJSON(),
    tx.toJSON(),
  );

  assert.throws(
    () =>
      new Transaction({ instructions: [new Uint8Array([1])] }).validateWire(),
    /packed instruction length/,
  );
});

// Confirms postcard transaction bytes and signer helpers match the Milon wire layout.
test("Transaction postcard round trip and signing helpers match Milon wire expectations", async () => {
  const secretKey = SecretKey.fromHex(
    "0101010101010101010101010101010101010101010101010101010101010101",
  );
  const signerAddress = Address.fromEd25519PublicKey(
    await secretKey.ed25519Public(),
  );
  const tx = new Transaction({
    stamp: 456n,
    instructions: [new Uint8Array([2, 5, 9])],
  });

  await tx.signEd25519(signerAddress, secretKey);
  assert.equal(tx.signatures.length, 1);
  assert.equal(tx.signatures[0][0].equals(signerAddress), true);
  assert.equal(tx.signatures[0][1].publicKey.kind, PublicKeyKind.ED25519);

  const postcardBytes = tx.postcardToBytes();
  const decoded = Transaction.fromPostcard(postcardBytes);
  const txHex = tx.toHex();
  const decodedFromHex = Transaction.fromHex(txHex);
  const decodedFromPrefixedHex = Transaction.fromHex(tx.toHex(true));
  assert.equal(bytesToHex(postcardBytes), txHex);
  assert.equal(bytesToHex(decodedFromHex.postcardToBytes()), txHex);
  assert.equal(bytesToHex(decodedFromPrefixedHex.hash), bytesToHex(tx.hash));
  assert.equal(bytesToHex(decoded.hash), bytesToHex(tx.hash));
  assert.equal(decoded.stamp, tx.stamp);
  assert.equal(decodedFromHex.stamp, tx.stamp);
  assert.equal(decoded.payer.equals(signerAddress), true);
  assert.equal(decodedFromHex.payer.equals(signerAddress), true);
  assert.deepEqual(
    decoded.instructions.map((instruction) => Array.from(instruction)),
    tx.instructions.map((instruction) => Array.from(instruction)),
  );
  assert.deepEqual(
    decodedFromHex.instructions.map((instruction) => Array.from(instruction)),
    tx.instructions.map((instruction) => Array.from(instruction)),
  );
  assert.equal(decoded.signatures.length, tx.signatures.length);
  assert.equal(decoded.signatures[0][0].equals(tx.signatures[0][0]), true);
  assert.equal(decoded.signatures[0][1].authBit, tx.signatures[0][1].authBit);
  assert.equal(decoded.signatures[0][1].sigBit, tx.signatures[0][1].sigBit);
  assert.equal(
    decoded.signatures[0][1].signatures[0].toHex(),
    tx.signatures[0][1].signatures[0].toHex(),
  );
  assert.equal(
    decoded.signatures[0][1].publicKey.toHex(),
    tx.signatures[0][1].publicKey.toHex(),
  );
  tx.validateWire();

  const splitTx = new Transaction({
    stamp: 457n,
    instructions: [new Uint8Array([2, 5, 10])],
  });
  splitTx.addSignature(
    signerAddress,
    await splitTx.signIxGasEd25519(signerAddress, secretKey, [0]),
  );
  assert.equal(splitTx.payer, null);
  splitTx.validateWire();

  const d = new Postcard.PostcardDeserializer(postcardBytes);
  assert.equal(d.deserializeU8(), 0);
  assert.equal(d.deserializeU64(), 456n);
  assert.equal(d.deserializeBool(), true);
  assert.deepEqual(
    Array.from(d.deserializeFixedBytes(20)),
    Array.from(signerAddress.bytes),
  );
  assert.equal(d.deserializeU32(), 1);
  assert.deepEqual(Array.from(d.deserializeBytes()), [2, 5, 9]);
  assert.equal(d.deserializeU32(), 1);
  assert.deepEqual(
    Array.from(d.deserializeFixedBytes(20)),
    Array.from(signerAddress.bytes),
  );
  assert.equal(d.deserializeU64(), AccountSignature.authIxAndPayer(0));
  assert.equal(d.deserializeU64(), 0n);
  assert.equal(d.deserializeU32(), 1);
  assert.equal(d.deserializeEnumVariant(), 1);
  assert.deepEqual(
    Array.from(d.deserializeFixedBytes(64)),
    Array.from(tx.signatures[0][1].signatures[0].bytes),
  );
  assert.equal(d.deserializeBool(), true);
  assert.equal(d.deserializeEnumVariant(), 1);
  assert.deepEqual(
    Array.from(d.deserializeFixedBytes(32)),
    Array.from(tx.signatures[0][1].publicKey.bytes),
  );
  d.assertEnd();
});

test("Transaction signing helpers cover all four gas payment modes", async () => {
  const payerSecret = SecretKey.generateClassical();
  const ownerSecret = SecretKey.generateClassical();
  const payerPublic = await payerSecret.ed25519Public();
  const ownerPublic = await ownerSecret.ed25519Public();
  const payer = Address.fromPublicKey(payerPublic);
  const owner = Address.fromPublicKey(ownerPublic);
  const instructions = [new Uint8Array([1, 1, 1]), new Uint8Array([1, 1, 2])];
  const allIxAuth = AccountSignature.authIxes([0, 1]);

  // UnifiedPayerSignAll: one payer authorizes every ix and the payer bit.
  const signAllTx = new Transaction({
    stamp: 1n,
    payer,
    instructions,
  });
  await signAllTx.signEd25519(payer, payerSecret, payerPublic);
  assert.equal(
    signAllTx.signatures[0][1].authBit,
    allIxAuth | AccountSignature.authPayer(),
  );
  signAllTx.validateWire();

  // UnifiedDualSign: payer signs gas, owner signs the business instructions.
  const dualSignTx = new Transaction({
    stamp: 2n,
    payer,
    instructions,
  });
  dualSignTx.addSignature(
    payer,
    await dualSignTx.signPayerEd25519(payer, payerSecret, payerPublic),
  );
  dualSignTx.addSignature(
    owner,
    await dualSignTx.signIxEd25519(owner, ownerSecret, [0, 1], ownerPublic),
  );
  assert.equal(
    dualSignTx.signatures[0][1].authBit,
    AccountSignature.authPayer(),
  );
  assert.equal(dualSignTx.signatures[1][1].authBit, allIxAuth);
  dualSignTx.validateWire();

  // UnifiedPayerOnlyGas uses the same wire roles for a gas sponsor.
  const sponsoredTx = new Transaction({
    stamp: 3n,
    payer,
    instructions,
  });
  sponsoredTx.addSignature(
    payer,
    await sponsoredTx.signPayerEd25519(payer, payerSecret, payerPublic),
  );
  sponsoredTx.addSignature(
    owner,
    await sponsoredTx.signIxEd25519(owner, ownerSecret, [0, 1], ownerPublic),
  );
  assert.equal(sponsoredTx.signatures[0][1].authorizesIx(0), false);
  assert.equal(sponsoredTx.signatures[0][1].authorizesPayer(), true);
  sponsoredTx.validateWire();

  // Split: no unified payer; each owner signature carries ix + gas auth.
  const splitTx = new Transaction({
    stamp: 4n,
    payer: null,
    instructions,
  });
  splitTx.addSignature(
    owner,
    await splitTx.signIxGasEd25519(owner, ownerSecret, [0, 1], {
      publicKey: ownerPublic,
    }),
  );
  assert.equal(splitTx.payer, null);
  assert.equal(
    splitTx.signatures[0][1].authBit,
    allIxAuth | AccountSignature.authPayer(),
  );
  splitTx.validateWire();
});

test("Transaction signing helpers support rotated account signer keys", async () => {
  const originalSecret = SecretKey.generateClassical();
  const rotatedSecret = SecretKey.generateClassical();
  const originalPublic = await originalSecret.ed25519Public();
  const rotatedPublic = await rotatedSecret.ed25519Public();
  const owner = Address.fromPublicKey(originalPublic);
  assert.equal(Address.fromPublicKey(rotatedPublic).equals(owner), false);
  const mode = {
    publicKey: rotatedPublic,
    multisigKeyIndex: 4,
  };
  const instruction = new Uint8Array([2, 4, 6]);

  const payerTx = new Transaction({
    payer: owner,
    instructions: [instruction],
  });
  const payerSignature = await payerTx.signPayerEd25519(
    owner,
    rotatedSecret,
    mode,
  );
  assert.equal(payerSignature.authBit, AccountSignature.authPayer());
  assert.equal(payerSignature.sigBit, 1n << 4n);
  assert.equal(payerSignature.publicKey, null);
  payerTx.addSignature(owner, payerSignature);
  payerTx.validateWire();

  const ixTx = new Transaction({ instructions: [instruction] });
  const ixSignature = await ixTx.signIxEd25519(owner, rotatedSecret, [0], mode);
  assert.equal(ixSignature.authBit, AccountSignature.authIx(0));
  assert.equal(ixSignature.sigBit, 1n << 4n);
  assert.equal(ixSignature.publicKey, null);

  const combinedTx = new Transaction({
    payer: owner,
    instructions: [instruction],
  });
  const combinedSignature = await combinedTx.signIxAndPayerEd25519(
    owner,
    rotatedSecret,
    [0],
    owner,
    mode,
  );
  assert.equal(combinedSignature.authBit, AccountSignature.authIxAndPayer(0));
  assert.equal(combinedSignature.sigBit, 1n << 4n);
  assert.equal(combinedSignature.publicKey, null);
  combinedTx.addSignature(owner, combinedSignature);
  combinedTx.validateWire();

  const signAllTx = new Transaction({
    payer: owner,
    instructions: [instruction],
  });
  await signAllTx.signEd25519(owner, rotatedSecret, mode);
  assert.equal(signAllTx.signatures[0][1].sigBit, 1n << 4n);
  assert.equal(signAllTx.signatures[0][1].publicKey, null);
  signAllTx.validateWire();

  await assert.rejects(
    () =>
      payerTx.signPayerEd25519(owner, rotatedSecret, {
        publicKey: rotatedPublic,
        multisigKeyIndex: 64,
      }),
    /multisig key index must be in 0..63/,
  );
});

test("Transaction FN-DSA512 signing helper appends FN_DSA512 account signatures", async () => {
  const { sign_key: secretKeyBytes } = keygenFnDsa(9);
  const secretKey = SecretKey.fromBytes(secretKeyBytes);
  const publicKey = await secretKey.fnDsa512Public();
  const signerAddress = Address.fromPublicKey(publicKey);
  const tx = new Transaction({
    stamp: 654n,
    instructions: [new Uint8Array([4, 3, 2, 1])],
  });

  await tx.signFnDsa512(signerAddress, secretKey, publicKey);

  assert.equal(tx.signatures.length, 1);
  assert.equal(tx.signatures[0][0].equals(signerAddress), true);
  assert.equal(tx.signatures[0][1].publicKey?.kind, PublicKeyKind.FN_DSA512);
  assert.equal(tx.signatures[0][1].signatures[0].kind, SignatureKind.FN_DSA512);
});

test("Transaction BLS12381 signing helpers cover payer and ix auth flows", async () => {
  const secretKey = SecretKey.fromBytes(
    Uint8Array.from([
      246, 139, 69, 97, 122, 224, 49, 119, 98, 212, 145, 225, 141, 78, 141, 165,
      26, 252, 149, 80, 139, 72, 226, 66, 166, 75, 25, 1, 42, 80, 106, 50,
    ]),
  );
  const publicKey = await secretKey.bls12381Public();
  const signerAddress = Address.fromPublicKey(publicKey);
  const tx = new Transaction({
    stamp: 777n,
    instructions: [new Uint8Array([1, 3, 5]), new Uint8Array([2, 4, 6])],
  });

  const payerSignature = await tx.signPayerBls12381(
    signerAddress,
    secretKey,
    publicKey,
  );
  const ixSignature = await tx.signIxBls12381(
    signerAddress,
    secretKey,
    [1],
    publicKey,
  );
  const ixAndPayerSignature = await tx.signIxAndPayerBls12381(
    signerAddress,
    secretKey,
    [0, 1],
    signerAddress,
    publicKey,
  );

  assert.equal(payerSignature.publicKey?.kind, PublicKeyKind.BLS12381);
  assert.equal(payerSignature.signatures[0].kind, SignatureKind.BLS12381);
  assert.equal(payerSignature.authBit, AccountSignature.authPayer());
  assert.equal(ixSignature.authBit, AccountSignature.authIx(1));
  assert.equal(
    ixAndPayerSignature.authBit,
    AccountSignature.authIxes([0, 1]) | AccountSignature.authPayer(),
  );
});

// Validates block proof identifiers, block hashing, and constructor invariants.
test("Block proof identifiers, hash, BCS, and constructor validation work", () => {
  const proof = txProofIdentifier(0x0102030405060708n, 0x090a0b0c);
  assert.deepEqual(Array.from(proof), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  const block = new Block({
    number: 7n,
    epoch: 3n,
    prevHash: new Uint8Array(32).fill(1),
    stateHash: new Uint8Array(32).fill(2),
    txRoot: new Uint8Array(32).fill(3),
    txCount: 1,
    timestamp: 99n,
  });
  assert.equal(block.hash.length, 32);
  assert.equal(Block.hash(block).length, 32);
  assert.notEqual(
    bytesToHex(Block.hash(block)),
    bytesToHex(Block.hash({ ...block, chainId: 900000002n })),
  );

  const decoded = Bcs.deserializeBcs(block.bcsToBytes(), Block);
  assert.equal(decoded.number, 7n);
  assert.equal(decoded.epoch, 3n);
  assert.equal(decoded.timestamp, 99n);
  assert.equal(decoded.txCount, 1);
  assert.deepEqual(decoded.txRoot, new Uint8Array(32).fill(3));
  assert.throws(
    () =>
      new Block({
        number: 1n,
        epoch: 0n,
        prevHash: new Uint8Array(31),
        stateHash: new Uint8Array(32),
        txRoot: new Uint8Array(32),
        txCount: 0,
        timestamp: 1n,
      }),
    /prevHash/,
  );
});

// Verifies postcard wire helpers decode the main typed payloads used by invoke APIs.
test("Invoke wire helpers round trip chain/account/event payloads", async () => {
  const chainHead = new ChainHead({
    chainId: 10010n,
    blockHeight: 12n,
    blockHash: new Uint8Array(32).fill(7),
    timestampMsecs: 999n,
  });
  const headBytes = new Postcard.PostcardSerializer();
  headBytes.serializeU64(chainHead.chainId);
  headBytes.serializeU64(chainHead.blockHeight);
  headBytes.serializeFixedBytes(chainHead.blockHash);
  headBytes.serializeU64(chainHead.timestampMsecs);
  assert.deepEqual(
    ChainHead.fromPostcard(headBytes.toUint8Array()).toJSON(),
    chainHead.toJSON(),
  );

  const currentHeadBytes = new Postcard.PostcardSerializer();
  currentHeadBytes.serializeU64(chainHead.chainId);
  currentHeadBytes.serializeU64(chainHead.blockHeight);
  currentHeadBytes.serializeFixedBytes(chainHead.blockHash);
  currentHeadBytes.serializeU64(chainHead.timestampMsecs);
  currentHeadBytes.serializeFixedBytes(new Uint8Array(32).fill(8));
  const currentHead = ChainHead.fromPostcard(currentHeadBytes.toUint8Array());
  assert.deepEqual(currentHead.stateHash, new Uint8Array(32).fill(8));
  assert.equal(currentHead.toJSON().state_hash, "08".repeat(32));

  const accountBytes = new Postcard.PostcardSerializer();
  accountBytes.serializeFixedBytes(address.bytes);
  accountBytes.serializeU8(2);
  accountBytes.serializeU32(2);
  accountBytes.serializeStr("pk1");
  accountBytes.serializeStr("pk2");
  const account = AccountView.fromPostcard(accountBytes.toUint8Array());
  assert.equal(account.address.equals(address), true);
  assert.deepEqual(account.pubkeysBs58, ["pk1", "pk2"]);

  const eventsRequest = new EventsByTxHashRequest({
    txHash: new Uint8Array(32).fill(9),
    typeTagFilter: 88n,
  });
  const reqDeserializer = new Postcard.PostcardDeserializer(
    eventsRequest.toPostcardBytes(),
  );
  assert.deepEqual(
    Array.from(reqDeserializer.deserializeFixedBytes(32)),
    Array(32).fill(9),
  );
  assert.equal(reqDeserializer.deserializeBool(), true);
  assert.equal(reqDeserializer.deserializeU64(), 88n);

  const eventsBytes = new Postcard.PostcardSerializer();
  eventsBytes.serializeU32(1);
  eventsBytes.serializeU64(123n);
  eventsBytes.serializeFixedBytes(new Uint8Array(32).fill(4));
  eventsBytes.serializeU32(5);
  eventsBytes.serializeU32(6);
  const eventData = new Postcard.PostcardSerializer();
  eventData.serializeU64(7n);
  eventData.serializeFixedBytes(new Uint8Array([1, 2, 3]));
  eventsBytes.serializeBytes(eventData.toUint8Array());
  const events = EventsByTxHashResponse.fromPostcard(
    eventsBytes.toUint8Array(),
  );
  assert.equal(events.events.length, 1);
  assert.equal(events.events[0].blockHeight, 123n);
  assert.equal(events.events[0].txIndex, 5);
  assert.equal(events.events[0].typeTag, 7n);
  assert.equal(bytesToHex(events.events[0].data), "07010203");
});

// Verifies that ClientHandler sends the expected JSON request payload.
test("ClientHandler sends invoke postcard requests", async () => {
  const requests = [];
  const chainHeadBytes = new Postcard.PostcardSerializer();
  chainHeadBytes.serializeU64(10010n);
  chainHeadBytes.serializeU64(123n);
  chainHeadBytes.serializeFixedBytes(new Uint8Array(32).fill(7));
  chainHeadBytes.serializeU64(456n);
  const responseValue = {
    request_id: 1,
    status: 0,
    body: Array.from(chainHeadBytes.toUint8Array()),
  };

  const client = new ClientHandler(Network.DEVNET, {
    fetchImpl: async (endpoint, init) => {
      requests.push([endpoint, init]);
      return {
        async json() {
          return responseValue;
        },
      };
    },
  });
  const res = await client.request({
    method: RpcMethodEnum.chain_head,
    body: [],
  });

  assert.ok(res.body instanceof ChainHead);
  assert.equal(res.body.blockHeight, 123n);
  assert.deepEqual(res.postcardData, responseValue.body);
  assert.equal(requests.length, 1);
  assert.equal(requests[0][1].method, "POST");
  assert.equal(
    requests[0][1].headers["Content-Type"],
    "application/x-milon+postcard",
  );
  const requestDeserializer = new Postcard.PostcardDeserializer(
    requests[0][1].body,
  );

  assert.equal(requestDeserializer.deserializeU16(), RpcMethodEnum.chain_head);
  assert.equal(requestDeserializer.deserializeU64(), 1n);
  assert.deepEqual(Array.from(requestDeserializer.deserializeBytes()), []);
  requestDeserializer.assertEnd();
});

test("ClientHandler sends a single encoded view instruction", async () => {
  let requestBody;
  const client = new ClientHandler(Network.DEVNET, {
    fetchImpl: async (_endpoint, init) => {
      requestBody = init.body;
      return {
        async json() {
          return { request_id: 1, status: 1, body: [0] };
        },
      };
    },
  });
  const instruction = new Uint8Array([2, 149, 231]);

  await client.request({
    method: RpcMethodEnum.view,
    body: instruction,
  });

  const request = new Postcard.PostcardDeserializer(requestBody);
  assert.equal(request.deserializeU16(), RpcMethodEnum.view);
  assert.equal(request.deserializeU64(), 1n);
  const viewBody = new Postcard.PostcardDeserializer(
    request.deserializeBytes(),
  );
  assert.deepEqual(
    Array.from(viewBody.deserializeBytes()),
    Array.from(instruction),
  );
  viewBody.assertEnd();
  request.assertEnd();
});

test("ClientHandler decodes TotalSupply view values through its IDL return type", async () => {
  const value = new Postcard.PostcardSerializer();
  value.serializeU64(1234n);

  const client = new ClientHandler(Network.DEVNET, {
    fetchImpl: async () => ({
      async json() {
        return {
          request_id: 1,
          status: 0,
          body: Array.from(value.toUint8Array()),
        };
      },
    }),
  });
  const response = await client.request({
    method: RpcMethodEnum.view,
    body: TokenMethods.totalSupply({ token: address }),
  });

  assert.equal(response.body.ok, true);
  assert.equal(response.body.method, "TotalSupply");
  assert.equal(response.body.returnType, "u64");
  assert.equal(response.body.value, 1234n);
  assert.deepEqual(Array.from(response.body.rawValue), [210, 9]);
});

test("ClientHandler binds requests to its configured network", async () => {
  const requests = [];
  const chainHeadBytes = new Postcard.PostcardSerializer();
  chainHeadBytes.serializeU64(10010n);
  chainHeadBytes.serializeU64(9n);
  chainHeadBytes.serializeFixedBytes(new Uint8Array(32).fill(1));
  chainHeadBytes.serializeU64(10n);
  const accountBytes = new Postcard.PostcardSerializer();
  accountBytes.serializeFixedBytes(new Uint8Array(20));
  accountBytes.serializeU8(1);
  accountBytes.serializeU32(0);
  const client = new ClientHandler(Network.TESTNET, {
    requestId: 9,
    fetchImpl: async (endpoint, init) => {
      requests.push([endpoint, init]);
      const request = new Postcard.PostcardDeserializer(init.body);
      const method = request.deserializeU8();
      return {
        async json() {
          return {
            request_id: 9,
            status: 0,
            body: Array.from(
              method === RpcMethodEnum.chain_head
                ? chainHeadBytes.toUint8Array()
                : accountBytes.toUint8Array(),
            ),
          };
        },
      };
    },
  });

  const first = await client.request({
    method: RpcMethodEnum.chain_head,
    body: [],
  });
  const second = await client.request({
    method: RpcMethodEnum.get_account,
    body: new Uint8Array(20),
  });

  assert.ok(first.body instanceof ChainHead);
  assert.ok(second.body instanceof AccountView);
  assert.equal(client.network, Network.TESTNET);
  assert.equal(client.endpoint, getEndPoint(Network.TESTNET));
  assert.equal(requests.length, 2);
  assert.equal(requests[0][0], getEndPoint(Network.TESTNET));
  assert.equal(requests[1][0], getEndPoint(Network.TESTNET));

  const requestDeserializer = new Postcard.PostcardDeserializer(
    requests[0][1].body,
  );
  assert.equal(requestDeserializer.deserializeU16(), RpcMethodEnum.chain_head);
  assert.equal(requestDeserializer.deserializeU64(), 9n);
});

test("ClientHandler defaults to DEVNET", () => {
  const client = new ClientHandler();
  assert.equal(client.network, Network.DEVNET);
  assert.equal(client.endpoint, getEndPoint(Network.DEVNET));
  assert.equal(client.timeoutMs, 30_000);
});

test("ClientHandler aborts requests after the configured timeout", async () => {
  const client = new ClientHandler(Network.DEVNET, {
    timeoutMs: 10,
    fetchImpl: async (_endpoint, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener("abort", () => {
          reject(init.signal.reason);
        });
      }),
  });

  await assert.rejects(
    client.request({
      method: RpcMethodEnum.chain_head,
      body: [],
    }),
    (error) => {
      assert.equal(error.name, "TimeoutError");
      assert.match(error.message, /timed out after 10ms/);
      return true;
    },
  );
});

test("ClientHandler resolves RPC error names from built-in IDLs", async () => {
  const client = new ClientHandler(Network.DEVNET, {
    fetchImpl: async () => ({
      async json() {
        return {
          request_id: 1,
          status: 6,
          body: [],
          error: {
            code: 513,
            message: "insufficient balance",
          },
        };
      },
    }),
  });

  const response = await client.request({
    method: RpcMethodEnum.submit_tx,
    body: [],
  });

  assert.equal(response.error.code, 513);
  assert.equal(response.error.name, "InsufficientBalance");
  assert.equal(response.error.message, "insufficient balance");
});

test("getTxByHash accepts 12-byte TxID request bodies", async () => {
  const txId = new Uint8Array(12).fill(7);
  let capturedBody;
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async (_endpoint, init) => {
    capturedBody = new Uint8Array(init.body);
    return {
      async json() {
        return {
          request_id: 1,
          status: 2,
          body: [],
        };
      },
    };
  };
  try {
    const res = await getTxByHash(Network.DEVNET, txId);
    assert.equal(res.status, 2);

    const requestDeserializer = new Postcard.PostcardDeserializer(capturedBody);
    assert.equal(
      requestDeserializer.deserializeU16(),
      RpcMethodEnum.get_tx_by_hash,
    );
    assert.equal(requestDeserializer.deserializeU64(), 1n);
    const methodBody = requestDeserializer.deserializeBytes();
    requestDeserializer.assertEnd();

    const bodyDeserializer = new Postcard.PostcardDeserializer(methodBody);
    assert.deepEqual(
      Array.from(bodyDeserializer.deserializeBytes()),
      Array.from(txId),
    );
    bodyDeserializer.assertEnd();
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("getTxHistoryProof sends method 60 and decodes the current Rust proof", async () => {
  const txId = new Uint8Array(12).fill(6);
  const proofBytes = new Postcard.PostcardSerializer();
  proofBytes.serializeU64(12n);
  proofBytes.serializeU64(3n);
  proofBytes.serializeFixedBytes(new Uint8Array(32).fill(1));
  proofBytes.serializeFixedBytes(new Uint8Array(32).fill(2));
  proofBytes.serializeFixedBytes(new Uint8Array(32).fill(3));
  proofBytes.serializeFixedBytes(new Uint8Array(32).fill(4));
  proofBytes.serializeU32(2);
  proofBytes.serializeU64(999n);
  proofBytes.serializeU32(1);
  proofBytes.serializeU32(1);
  proofBytes.serializeFixedBytes(new Uint8Array(32).fill(5));
  proofBytes.serializeBytes(Uint8Array.from([9, 8, 7]));

  let capturedBody;
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async (_endpoint, init) => {
    capturedBody = new Uint8Array(init.body);
    return {
      async json() {
        return {
          request_id: 1,
          status: 0,
          body: Array.from(proofBytes.toUint8Array()),
        };
      },
    };
  };
  try {
    const proof = await getTxHistoryProof(Network.DEVNET, txId);
    assert.equal(proof instanceof TxHistoryInclusionProof, true);
    assert.equal(proof.block.number, 12n);
    assert.equal(proof.block.epoch, 3n);
    assert.equal(proof.block.txCount, 2);
    assert.equal(proof.index, 1);
    assert.deepEqual(proof.history, Uint8Array.from([9, 8, 7]));

    const request = new Postcard.PostcardDeserializer(capturedBody);
    assert.equal(request.deserializeU16(), RpcMethodEnum.get_tx_history_proof);
    assert.equal(request.deserializeU64(), 1n);
    const body = new Postcard.PostcardDeserializer(request.deserializeBytes());
    assert.deepEqual(body.deserializeBytes(), txId);
    body.assertEnd();
    request.assertEnd();
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("getAccount serializes Address and decodes AccountView", async () => {
  const address = new Address(new Uint8Array(20).fill(7));
  const accountBytes = new Postcard.PostcardSerializer();
  accountBytes.serializeFixedBytes(address.bytes);
  accountBytes.serializeU8(2);
  accountBytes.serializeU32(2);
  accountBytes.serializeStr("pk1");
  accountBytes.serializeStr("pk2");

  let capturedBody;
  const fetchImpl = async (_endpoint, init) => {
    capturedBody = new Uint8Array(init.body);
    return {
      async json() {
        return {
          request_id: 1,
          status: 0,
          body: Array.from(accountBytes.toUint8Array()),
        };
      },
    };
  };
  const previousFetch = globalThis.fetch;
  globalThis.fetch = fetchImpl;
  try {
    const res = await getAccount(Network.DEVNET, address);

    const requestDeserializer = new Postcard.PostcardDeserializer(capturedBody);
    assert.equal(
      requestDeserializer.deserializeU16(),
      RpcMethodEnum.get_account,
    );
    assert.equal(requestDeserializer.deserializeU64(), 1n);
    assert.deepEqual(
      Array.from(requestDeserializer.deserializeBytes()),
      Array.from(address.bytes),
    );
    requestDeserializer.assertEnd();

    assert.equal(res.body.address.equals(address), true);
    assert.equal(res.body.threshold, 2);
    assert.deepEqual(res.body.pubkeysBs58, ["pk1", "pk2"]);
    assert.deepEqual(res.postcardData, Array.from(accountBytes.toUint8Array()));
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("getResource serializes RsHash and decodes AnySerialize resource values", async () => {
  const resourceHash = Uint8Array.from([
    2, 149, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
  ]);
  const resourceBytes = new Postcard.PostcardSerializer();
  resourceBytes.serializeStr("SDK Test Token");
  resourceBytes.serializeStr("SDKT");
  resourceBytes.serializeU8(6);
  resourceBytes.serializeStr("https://milon.test/token.png");
  resourceBytes.serializeStr("https://milon.test/token.png");
  const responseBytes = new Postcard.PostcardSerializer();
  responseBytes.serializeU64(12540935430733747277n);
  responseBytes.serializeFixedBytes(resourceBytes.toUint8Array());

  let capturedBody;
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async (_endpoint, init) => {
    capturedBody = new Uint8Array(init.body);
    return {
      async json() {
        return {
          request_id: 1,
          status: 0,
          body: Array.from(responseBytes.toUint8Array()),
        };
      },
    };
  };
  try {
    const res = await getResource(Network.DEVNET, resourceHash, {
      idl: tokenIdl,
    });

    const requestDeserializer = new Postcard.PostcardDeserializer(capturedBody);
    assert.equal(
      requestDeserializer.deserializeU16(),
      RpcMethodEnum.get_resource,
    );
    assert.equal(requestDeserializer.deserializeU64(), 1n);
    assert.deepEqual(
      Array.from(requestDeserializer.deserializeBytes()),
      Array.from(resourceHash),
    );
    requestDeserializer.assertEnd();

    assert.deepEqual(
      Array.from(res.body.bytes),
      Array.from(responseBytes.toUint8Array()),
    );
    assert.deepEqual(
      res.postcardData,
      Array.from(responseBytes.toUint8Array()),
    );
    assert.equal(res.body.typeTag, 12540935430733747277n);
    assert.deepEqual(
      Array.from(res.body.valueBytes),
      Array.from(resourceBytes.toUint8Array()),
    );
    assert.equal(res.body.decoded.type, "Metadata");
    assert.deepEqual(res.body.decoded.value, {
      name: "SDK Test Token",
      symbol: "SDKT",
      decimals: 6,
      icon: "https://milon.test/token.png",
      uri: "https://milon.test/token.png",
    });
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("get_resource_path_by_hash serializes RsHash and decodes JSON path", async () => {
  const resourceHash = Uint8Array.from([
    2, 149, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  ]);
  const path = "token::Metadata/2z3mDaJLnGnSaur9She2KWj3wSDT";
  const responseBody = new TextEncoder().encode(JSON.stringify(path));

  let capturedBody;
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async (_endpoint, init) => {
    capturedBody = new Uint8Array(init.body);
    return {
      async json() {
        return {
          request_id: 1,
          status: 0,
          body: Array.from(responseBody),
        };
      },
    };
  };
  try {
    const res = await get_resource_path_by_hash(Network.DEVNET, resourceHash);
    const requestDeserializer = new Postcard.PostcardDeserializer(capturedBody);
    assert.equal(
      requestDeserializer.deserializeU16(),
      RpcMethodEnum.get_resource_path_by_hash,
    );
    assert.equal(requestDeserializer.deserializeU64(), 1n);
    assert.deepEqual(
      Array.from(requestDeserializer.deserializeBytes()),
      Array.from(resourceHash),
    );
    requestDeserializer.assertEnd();

    assert.equal(res.body, path);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("get_resource_path_by_hash returns an unresolved result for NotFound", async () => {
  const resourceHash = Uint8Array.from([2, 34, ...new Uint8Array(16).fill(7)]);
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    async json() {
      return {
        request_id: 1,
        status: 2,
        body: [],
        error: { message: "resource path not found" },
      };
    },
  });
  try {
    const result = await get_resource_path_by_hash(
      Network.DEVNET,
      resourceHash,
    );
    assert.equal(result.status, 2);
    assert.equal(result.body, undefined);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("get_resource_path_by_hash batches hash arrays and decodes per-item results", async () => {
  const foundHash = Uint8Array.from([2, 149, ...new Uint8Array(16).fill(4)]);
  const missingHash = Uint8Array.from([2, 34, ...new Uint8Array(16).fill(5)]);
  const responseBody = new TextEncoder().encode(
    JSON.stringify([
      [Array.from(foundHash), { Ok: "token::Metadata/found" }],
      [Array.from(missingHash), { Err: "resource not found" }],
    ]),
  );
  let capturedBody;
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async (_endpoint, init) => {
    capturedBody = new Uint8Array(init.body);
    return {
      async json() {
        return { request_id: 1, status: 0, body: Array.from(responseBody) };
      },
    };
  };
  try {
    const res = await get_resource_path_by_hash(Network.DEVNET, [
      foundHash,
      missingHash,
    ]);
    const request = new Postcard.PostcardDeserializer(capturedBody);
    assert.equal(
      request.deserializeU16(),
      RpcMethodEnum.batch_get_resource_path_by_hash,
    );
    assert.equal(request.deserializeU64(), 1n);
    const body = new Postcard.PostcardDeserializer(request.deserializeBytes());
    assert.equal(body.deserializeU32(), 2);
    assert.deepEqual(body.deserializeFixedBytes(18), foundHash);
    assert.deepEqual(body.deserializeFixedBytes(18), missingHash);
    body.assertEnd();
    request.assertEnd();

    assert.deepEqual(res.body, [
      { hash: foundHash, ok: true, path: "token::Metadata/found" },
      { hash: missingHash, ok: false, error: "resource not found" },
    ]);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("get_resource_path_by_hash accepts Base58 RsHash and resolves TxHash lookups", async () => {
  const resourceHash = Uint8Array.from([2, 149, ...new Uint8Array(16).fill(6)]);
  const base58Hash = bytesToBs58(resourceHash);
  const txHash = "HiVryMAVGaPzBWVqp2GiwK2RGDaaz11qLhFx4qU46DZj";
  let requestedMethod;
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async (_endpoint, init) => {
    const request = new Postcard.PostcardDeserializer(new Uint8Array(init.body));
    requestedMethod = request.deserializeU16();
    return {
      async json() {
        if (requestedMethod === RpcMethodEnum.get_tx_by_hash) {
          return { request_id: 1, status: 2, body: [] };
        }
        return {
          request_id: 1,
          status: 0,
          body: Array.from(
            new TextEncoder().encode(JSON.stringify("token::Metadata/test")),
          ),
        };
      },
    };
  };
  try {
    const result = await get_resource_path_by_hash(Network.DEVNET, base58Hash);
    assert.equal(result.body, "token::Metadata/test");
    const unresolved = await get_resource_path_by_hash(Network.DEVNET, txHash);
    assert.equal(requestedMethod, RpcMethodEnum.get_tx_by_hash);
    assert.equal(unresolved.status, 2);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("get_access_value serializes one BlobHash and decodes its postcard value", async () => {
  const blobHash = new Uint8Array(32).fill(4);
  const resourceBytes = new Postcard.PostcardSerializer();
  resourceBytes.serializeU64(12540935430733747277n);
  resourceBytes.serializeStr("SDK Test Token");
  resourceBytes.serializeStr("SDKT");
  resourceBytes.serializeU8(6);
  resourceBytes.serializeStr("https://milon.test/token.png");
  resourceBytes.serializeStr("https://milon.test/token.png");

  const responseBytes = new Postcard.PostcardSerializer();
  responseBytes.serializeFixedBytes(blobHash);
  responseBytes.serializeBool(true);
  responseBytes.serializeBytes(resourceBytes.toUint8Array());

  let capturedBody;
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async (_endpoint, init) => {
    capturedBody = new Uint8Array(init.body);
    return {
      async json() {
        return {
          request_id: 1,
          status: 0,
          body: Array.from(responseBytes.toUint8Array()),
        };
      },
    };
  };
  try {
    const res = await get_access_value(Network.DEVNET, blobHash);

    const requestDeserializer = new Postcard.PostcardDeserializer(capturedBody);
    assert.equal(
      requestDeserializer.deserializeU16(),
      RpcMethodEnum.get_access_value,
    );
    assert.equal(requestDeserializer.deserializeU64(), 1n);
    const methodBody = requestDeserializer.deserializeBytes();
    requestDeserializer.assertEnd();
    const bodyDeserializer = new Postcard.PostcardDeserializer(methodBody);
    assert.deepEqual(
      Array.from(bodyDeserializer.deserializeFixedBytes(32)),
      Array.from(blobHash),
    );
    bodyDeserializer.assertEnd();

    assert.deepEqual(Array.from(res.body.hash), Array.from(blobHash));
    assert.equal(res.body.value.typeTag, 12540935430733747277n);
    assert.equal(res.body.value.decoded.type, "Metadata");
    assert.equal(res.body.value.decoded.value.symbol, "SDKT");
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("createAccount submits account Create transaction", async () => {
  const responseHash = new Uint8Array(32).fill(9);
  let capturedBody;
  const fetchImpl = async (_endpoint, init) => {
    capturedBody = new Uint8Array(init.body);
    return {
      async json() {
        return {
          request_id: 1,
          status: 0,
          body: Array.from(responseHash),
        };
      },
    };
  };
  const previousFetch = globalThis.fetch;
  globalThis.fetch = fetchImpl;
  try {
    const res = await createAccount(Network.DEVNET, accountIdl);

    const requestDeserializer = new Postcard.PostcardDeserializer(capturedBody);
    assert.equal(requestDeserializer.deserializeU16(), RpcMethodEnum.submit_tx);
    assert.equal(requestDeserializer.deserializeU64(), 1n);
    const tx = Transaction.fromPostcard(requestDeserializer.deserializeBytes());
    requestDeserializer.assertEnd();

    assert.equal(tx.payer.equals(res.owner), true);
    assert.equal(tx.signatures.length, 1);
    assert.equal(tx.signatures[0][0].equals(res.owner), true);
    assert.equal(tx.signatures[0][1].authorizesPayer(), true);
    assert.equal(tx.signatures[0][1].authorizesIx(0), true);
    assert.equal(
      tx.signatures[0][1].publicKey.toHex(),
      res.ownerPublicKey.toHex(),
    );
    assert.deepEqual(Array.from(res.body), Array.from(responseHash));

    const instruction = new Postcard.PostcardDeserializer(tx.instructions[0]);
    assert.equal(instruction.deserializeU8(), 1);
    const discriminator = instruction.deserializeFixedBytes(2);
    assert.deepEqual(Array.from(discriminator), [65, 79]);
    assert.deepEqual(
      Array.from(instruction.deserializeFixedBytes(20)),
      Array.from(res.owner.bytes),
    );
    assert.equal(instruction.deserializeU32(), 1);
    assert.equal(instruction.deserializeEnumVariant(), 3);
    assert.deepEqual(
      Array.from(instruction.deserializeFixedBytes(897)),
      Array.from(res.ownerPublicKey.bytes),
    );
    assert.deepEqual(Array.from(instruction.deserializeBytes()), [1]);
    assert.equal(instruction.deserializeU8(), 1);
    instruction.assertEnd();
  } finally {
    globalThis.fetch = previousFetch;
  }
});
