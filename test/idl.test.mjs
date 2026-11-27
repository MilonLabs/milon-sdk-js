import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  AccountSignature,
  Address,
  IdlRegistry,
  IdlName,
  IdlProvider,
  Network,
  Postcard,
  PublicKey,
  PublicKeyKind,
  Signer,
  Signature,
  SignatureKind,
  Transaction,
  bs58ToHex,
  bytesToBs58,
  bytesToHex,
  createToken,
  createTokenSimulate,
  get_resource_path_by_hash,
  totalSupplyHandle,
  BlockView,
  getAccountMethod,
  getBlockByHeight,
  getEventByHash,
  createAccount,
  decodeTransactionResponse,
  testCreateToken,
  get_resource_list_by_hash,
  getResource,
  getAccount,
  getBlockHead,
  getTxByHash,
  delay,
  decodeViewResults,
  decodeBatchViewResults,
  hexToBytes,
  setNetwork,
  unwrapFirstViewResult,
  bs58ToBytes,
} from "../dist/index.js";

function devnetTest(name, fn) {
  if (process.env.MILON_RUN_DEVNET === "1") test(name, fn);
}

const tokenIdl = JSON.parse(
  readFileSync(new URL("../IDL/token.idl.json", import.meta.url), "utf8"),
);
const accountIdl = JSON.parse(
  readFileSync(new URL("../IDL/account.idl.json", import.meta.url), "utf8"),
);
const identityIdl = JSON.parse(
  readFileSync(new URL("../IDL/identity.idl.json", import.meta.url), "utf8"),
);
const demoIdl = JSON.parse(
  readFileSync(new URL("../IDL/demo.idl.json", import.meta.url), "utf8"),
);
const stakingIdl = JSON.parse(
  readFileSync(new URL("../IDL/staking.idl.json", import.meta.url), "utf8"),
);
const owner = new Address(new Uint8Array(20).fill(1));
const token = new Address(new Uint8Array(20).fill(2));
const to = new Address(new Uint8Array(20).fill(3));
const rustOwner = new Address(
  hexToBytes("bf15a627698aa042340b30f22782b55e65271c7b"),
);
const rustTo = new Address(
  hexToBytes("691dda864846399887d025f21b37a5f6c3d18158"),
);
const rustOwnerV2 = new Address(
  hexToBytes("d9665776f8d8d410601da3b1e06d94a4b5b323f7"),
);
const rustToV2 = new Address(
  hexToBytes("bfb70e2ffe3e8919db12970ae1964dcd725df1ac"),
);
const rustAccountOwnerPk = hexToBytes(
  "ea4a6c63e29c520abef5507b132ec5f9954776aebebe7b92421eea691446d22c",
);
const rustCreateWithSignersOwner = bs58ToHex("949jr857tfm52vdXURNya9ZSmPc");

setNetwork(Network.DEVNET);

function deserializeInstructionDiscriminator(deserializer) {
  const bytes = deserializer.deserializeFixedBytes(2);
  return bytes[0] | (bytes[1] << 8);
}

async function waitForTxByHash(
  network,
  txHash,
  attempts = 10,
  intervalMs = 1000,
) {
  let last;
  for (let i = 0; i < attempts; i += 1) {
    try {
      last = await getTxByHash(network, txHash);
    } catch (error) {
      if (
        !/Request failed with status: 4\b/.test(String(error?.message ?? error))
      ) {
        throw error;
      }
      await delay(intervalMs);
      continue;
    }
    if (!("status" in last)) {
      return last;
    }
    await delay(intervalMs);
  }

  throw new Error(
    `getTxByHash failed after ${attempts} attempts for ${txHash}: ${JSON.stringify(last)}`,
  );
}

test("IdlProvider encodes token Create/Mint/BalanceOf instructions", () => {
  const provider = new IdlProvider(tokenIdl);

  const create = provider.Create.arg({
    token: owner,
    owner,
    metadata: {
      name: "TestCoin2",
      symbol: "TS2",
      decimals: 6,
      icon: "https://example.com/icon2.png",
      uri: "https://example.com/icon2.png",
    },
  }).encode;
  const createDeserializer = new Postcard.PostcardDeserializer(create);
  assert.equal(createDeserializer.deserializeU8(), 2);
  assert.equal(deserializeInstructionDiscriminator(createDeserializer), 2581);
  assert.deepEqual(
    Array.from(createDeserializer.deserializeFixedBytes(20)),
    Array.from(owner.bytes),
  );

  const mint = provider.Mint.arg({ token, to, amount: 1000n }).encode;
  const mintDeserializer = new Postcard.PostcardDeserializer(mint);
  assert.equal(mintDeserializer.deserializeU8(), 2);
  assert.equal(deserializeInstructionDiscriminator(mintDeserializer), 20481);
  assert.deepEqual(
    Array.from(mintDeserializer.deserializeFixedBytes(20)),
    Array.from(token.bytes),
  );
  assert.deepEqual(
    Array.from(mintDeserializer.deserializeFixedBytes(20)),
    Array.from(to.bytes),
  );
  assert.equal(mintDeserializer.deserializeU64(), 1000n);

  const balanceOf = provider.BalanceOf.arg({ token, account: to }).encode;
  const viewDeserializer = new Postcard.PostcardDeserializer(balanceOf);
  assert.equal(viewDeserializer.deserializeU8(), 2);
  assert.equal(deserializeInstructionDiscriminator(viewDeserializer), 59285);
});

test("IdlProvider loads built-in IDLs and exposes chained encode methods", () => {
  const provider = new IdlProvider(IdlName.Token);
  const systemProvider = new IdlProvider(IdlName.System);
  const dexProvider = new IdlProvider(IdlName.Dex);
  const validatorProvider = new IdlProvider(IdlName.Validator);
  const identityProvider = new IdlProvider(IdlName.Identity);
  const keylessProvider = new IdlProvider(IdlName.Keyless);
  const fundsProvider = new IdlProvider(IdlName.Funds);
  const commissionProvider = new IdlProvider(IdlName.Commission);
  const args = { token, to, amount: 1000n };

  assert.equal(IdlName.System, "system-0");
  assert.equal(IdlName.Account, "account-1");
  assert.equal(IdlName.Token, "token-2");
  assert.equal(IdlName.Staking, "staking-3");
  assert.equal(IdlName.Identity, "identity-4");
  assert.equal(IdlName.Sftoken, "sftoken-5");
  assert.equal(IdlName.Dex, "dex-6");
  assert.equal(IdlName.Validator, "validator-7");
  assert.equal(IdlName.Keyless, "keyless-8");
  assert.equal(IdlName.Social, "social-10");
  assert.equal(IdlName.Funds, "funds-11");
  assert.equal(IdlName.Commission, "commission-12");
  assert.equal(IdlName.Demo, "demo-254");
  assert.equal(provider.idl.metadata.name, "token");
  assert.equal(provider.idl.metadata.app_id, 2);
  assert.ok(provider.methodNames.includes("Mint"));
  assert.ok(systemProvider.methodNames.includes("BootstrapEpochClock"));
  assert.ok(systemProvider.methodNames.includes("CommitBlockSeed"));
  assert.ok(dexProvider.methodNames.includes("PlaceLimitOrder"));
  assert.ok(validatorProvider.methodNames.includes("JoinValidator"));
  assert.ok(fundsProvider.methodNames.includes("ClaimOperatorReward"));
  assert.ok(commissionProvider.methodNames.includes("CreateCollection"));
  assert.ok(identityProvider.methodNames.includes("DisclosedVcSchemas"));
  assert.ok(identityProvider.methodNames.includes("DisclosedVcs"));
  assert.deepEqual(
    identityProvider
      .method("HasValidVcFromIssuer")
      .instruction.args.map((arg) => arg.name),
    ["subject", "issuer", "credential_schema"],
  );
  assert.deepEqual(
    keylessProvider
      .method("Authenticate")
      .instruction.args.map((arg) => arg.name),
    ["auth"],
  );
  assert.equal(keylessProvider.methodNames.includes("AuthenticateZk"), false);
  assert.equal(keylessProvider.methodNames.includes("BindZk"), false);
  assert.deepEqual(Object.keys(provider.Mint), ["arg"]);
  assert.deepEqual(
    provider.Mint.arg(args).encode,
    provider.method("Mint").arg(args).encode,
  );
  assert.throws(
    () => new IdlProvider("missing"),
    /built-in IDL not found: missing/,
  );
});

test("sftoken Token view requires token_id before u64 serialization", () => {
  const provider = new IdlProvider(IdlName.Sftoken);
  const sft = new Address(new Uint8Array(20).fill(4));

  assert.deepEqual(
    provider.Token.arg({ sft, token_id: 7n }).encode,
    provider.method("Token").arg({ sft, token_id: 7n }).encode,
  );
  assert.throws(
    () => provider.Token.arg({ sft, token_id: undefined }).encode,
    /missing IDL argument: token_id/,
  );
});

test("IdlRegistry decodes the Identity accepted issuer vector resource", () => {
  const serializer = new Postcard.PostcardSerializer();
  serializer.serializeU64(13839084772846465265n);
  serializer.serializeU32(0);

  const decoded = new IdlRegistry().decodeAnySerialize(
    serializer.toUint8Array(),
    { appName: "identity" },
  );

  assert.equal(decoded.type, "vec<AcceptedVcIssuer>");
  assert.equal(decoded.typeTag, 13839084772846465265n);
  assert.deepEqual(decoded.value, []);
});

test("IdlRegistry decodes the Identity disclosed VC schema vector resource", () => {
  const serializer = new Postcard.PostcardSerializer();
  serializer.serializeU64(2316261776970198819n);
  serializer.serializeU32(2);
  serializer.serializeStr("KYC");
  serializer.serializeStr("AgeCredential");

  const decoded = new IdlRegistry().decodeAnySerialize(
    serializer.toUint8Array(),
    { appName: "identity" },
  );

  assert.equal(decoded.type, "vec<String>");
  assert.equal(decoded.typeTag, 2316261776970198819n);
  assert.deepEqual(decoded.value, ["KYC", "AgeCredential"]);
});

test("IdlRegistry decodes keyless session vectors from the bundled IDL", () => {
  const serializer = new Postcard.PostcardSerializer();
  serializer.serializeU32(0);

  const decoded = new IdlRegistry().decodeType(
    "keyless",
    "vec<SessionEntry>",
    serializer.toUint8Array(),
  );

  assert.deepEqual(decoded, []);
});

test("IdlProvider token payloads match Rust fixtures", () => {
  const provider = new IdlProvider(tokenIdl);

  assert.equal(
    bytesToHex(
      provider.Create.arg({
        token: rustOwner,
        owner: rustOwner,
        metadata: {
          name: "TestCoin",
          symbol: "TST",
          decimals: 6,
          icon: "https://example.com/icon.png",
          uri: "https://example.com/icon.png",
        },
      }).encode,
    ),
    "02150abf15a627698aa042340b30f22782b55e65271c7bbf15a627698aa042340b30f22782b55e65271c7b0854657374436f696e03545354061c68747470733a2f2f6578616d706c652e636f6d2f69636f6e2e706e671c68747470733a2f2f6578616d706c652e636f6d2f69636f6e2e706e67",
  );

  assert.equal(
    bytesToHex(
      provider.Mint.arg({ token: rustOwner, to: rustTo, amount: 1000n }).encode,
    ),
    "020150bf15a627698aa042340b30f22782b55e65271c7b691dda864846399887d025f21b37a5f6c3d18158e807",
  );

  assert.equal(
    bytesToHex(
      provider.BalanceOf.arg({ token: rustOwner, account: rustTo }).encode,
    ),
    "0295e7bf15a627698aa042340b30f22782b55e65271c7b691dda864846399887d025f21b37a5f6c3d18158",
  );
});

test("IdlProvider can decode postcard payloads back into structured objects", () => {
  const provider = new IdlProvider(tokenIdl);
  const metadataPayload = provider.Metadata.arg({ token: rustOwner }).encode;
  const decoded = provider.Metadata.arg(metadataPayload).decode;
  assert.equal(decoded.appId, 2);
  assert.equal(decoded.method, "Metadata");
  assert.equal(decoded.args.token instanceof Address, true);
  assert.equal(decoded.args.token.toHex(), rustOwner.toHex());

  const metadataArgs = provider.method("Metadata").decode(metadataPayload);
  assert.equal(metadataArgs.token instanceof Address, true);
  assert.equal(metadataArgs.token.toHex(), rustOwner.toHex());
});

test("IdlProvider decodes BalanceOf tagged view bytes", () => {
  const provider = new IdlProvider(tokenIdl);
  const balanceBytes = Uint8Array.from([
    1, 242, 205, 181, 244, 147, 227, 244, 154, 77, 232, 7,
  ]);

  const values = provider.decodeViewValues("BalanceOf", balanceBytes);
  assert.equal(values.length, 1);
  assert.equal(values[0].typeTag, IdlProvider.typeTagForType("u64"));
  assert.equal(values[0].typeTag, 5563585020063213298n);
  assert.equal(values[0].value, 1000n);
  assert.equal(provider.decodeViewValue("BalanceOf", balanceBytes), 1000n);
});

test("IdlProvider decodes raw BalanceOf view bytes", () => {
  const provider = new IdlProvider(tokenIdl);
  const balanceBytes = Uint8Array.from([188, 5]);

  const values = provider.decodeViewValues("BalanceOf", balanceBytes);
  assert.equal(values.length, 1);
  assert.equal(values[0].typeTag, IdlProvider.typeTagForType("u64"));
  assert.equal(values[0].value, 700n);
  assert.equal(provider.decodeViewValue("BalanceOf", balanceBytes), 700n);
});

test("IdlProvider does not mistake raw OrganizationCapabilities for tagged values", () => {
  const provider = new IdlProvider(identityIdl);
  const rawCapabilities = Uint8Array.from([
    1, // roles length
    0, // EntityRole::VcIssuer
    1, // credential_schemas length
    9, // string length
    ...new TextEncoder().encode("milonTest"),
  ]);

  assert.deepEqual(
    provider.decodeViewValue("OrganizationCapabilities", rawCapabilities),
    {
      roles: ["VcIssuer"],
      credential_schemas: ["milonTest"],
    },
  );
});

test("IdlProvider decodes an empty ListActiveVotes result as an empty vector", () => {
  const provider = new IdlProvider(accountIdl);
  const value = provider.decodeViewValue(
    "ListActiveVotes",
    Uint8Array.from([0]),
  );

  assert.deepEqual(value, []);
});

test("IdlProvider unwraps legacy raw view response bytes", () => {
  const provider = new IdlProvider(tokenIdl);
  const legacyBody = Uint8Array.from([30]);

  const viewPayload = unwrapFirstViewResult(legacyBody);
  assert.deepEqual([...viewPayload], [30]);
  assert.equal(provider.decodeViewValue("BalanceOf", viewPayload), 30n);
});

test("IdlProvider decodes per-instruction view results", () => {
  const provider = new IdlProvider(tokenIdl);
  const balanceBytes = Uint8Array.from([188, 5]);
  const serializer = new Postcard.PostcardSerializer();
  serializer.serializeU32(2);
  serializer.serializeEnumVariant(0);
  serializer.serializeBytes(balanceBytes);
  serializer.serializeEnumVariant(1);
  serializer.serializeU16(42);
  serializer.serializeStr("view boom");
  serializer.serializeBytes(Uint8Array.from([9, 8, 7]));

  const results = decodeViewResults(serializer.toUint8Array());
  assert.equal(results.length, 2);
  assert.equal(results[0].ok, true);
  assert.deepEqual([...results[0].value], [...balanceBytes]);
  assert.equal(provider.decodeViewValue("BalanceOf", results[0].value), 700n);
  assert.equal(results[1].ok, false);
  assert.equal(results[1].error.code, 42);
  assert.equal(results[1].error.message, "view boom");
  assert.deepEqual([...results[1].error.data], [9, 8, 7]);
  assert.equal(
    provider.decodeViewValue(
      "BalanceOf",
      unwrapFirstViewResult(serializer.toUint8Array()),
    ),
    700n,
  );
});

test("batch_view decodes RPC ApiFailure rather than TxFailurePayload", () => {
  const serializer = new Postcard.PostcardSerializer();
  serializer.serializeU32(2);
  serializer.serializeEnumVariant(0);
  serializer.serializeBytes(Uint8Array.from([188, 5]));
  serializer.serializeEnumVariant(1);
  serializer.serializeStr("non-view instruction");
  serializer.serializeBool(true);
  serializer.serializeU16(6);
  serializer.serializeBool(true);
  serializer.serializeBytes(Uint8Array.from([9, 8, 7]));

  const results = decodeBatchViewResults(serializer.toUint8Array());
  assert.equal(results[0].ok, true);
  assert.equal(results[1].ok, false);
  assert.equal(results[1].error.message, "non-view instruction");
  assert.equal(results[1].error.code, 6);
  assert.deepEqual([...results[1].error.data], [9, 8, 7]);
});

test("IdlProvider decodes concatenated tagged BalanceOf view bytes", () => {
  const provider = new IdlProvider(tokenIdl);
  const balanceBytes = Uint8Array.from([
    242, 205, 181, 244, 147, 227, 244, 154, 77, 232, 7,
  ]);

  const values = provider.decodeViewValues("BalanceOf", balanceBytes);
  assert.equal(values.length, 1);
  assert.equal(values[0].typeTag, IdlProvider.typeTagForType("u64"));
  assert.equal(values[0].value, 1000n);
  assert.equal(provider.decodeViewValue("BalanceOf", balanceBytes), 1000n);
});

test("IdlRegistry routes view responses through the matching provider", () => {
  const manager = new IdlRegistry([tokenIdl, demoIdl]);
  const balanceBytes = Uint8Array.from([188, 5]);

  const decoded = manager.decodeView({
    appName: "token",
    method: "BalanceOf",
    bytes: balanceBytes,
  });
  assert.equal(decoded.appId, 2);
  assert.equal(decoded.returnType, "u64");
  assert.equal(decoded.value, 700n);

  const candidates = manager.detectView(balanceBytes, {
    appId: 2,
    method: "BalanceOf",
  });
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].value, 700n);
  assert.equal(manager.decodeType("token", "u64", balanceBytes), 700n);
});

test("IdlRegistry decodes AnySerializeOwned values", () => {
  const manager = new IdlRegistry([tokenIdl, demoIdl]);
  const metadataBytes = new Postcard.PostcardSerializer();
  metadataBytes.serializeU64(12540935430733747277n);
  metadataBytes.serializeStr("SDK Test Token");
  metadataBytes.serializeStr("SDKT");
  metadataBytes.serializeU8(6);
  metadataBytes.serializeStr("https://milon.test/token.png");
  metadataBytes.serializeStr("https://milon.test/token.png");

  const decoded = manager.decodeAnySerialize(metadataBytes.toUint8Array());
  assert.equal(decoded.appId, 2);
  assert.equal(decoded.appName, "token");
  assert.equal(decoded.typeTag, 12540935430733747277n);
  assert.equal(decoded.type, "Metadata");
  assert.deepEqual(decoded.value, {
    name: "SDK Test Token",
    symbol: "SDKT",
    decimals: 6,
    icon: "https://milon.test/token.png",
    uri: "https://milon.test/token.png",
  });
});

test("IdlRegistry decodes new resource-only type tags using their wire type", () => {
  const serializer = new Postcard.PostcardSerializer();
  serializer.serializeU64(5617274569088890347n); // account::_VoteSweepShard
  serializer.serializeU32(0); // vec<VoteSweepOwner>

  const decoded = new IdlRegistry([accountIdl]).decodeAnySerialize(
    serializer.toUint8Array(),
  );
  assert.equal(decoded.appName, "account");
  assert.equal(decoded.type, "vec<VoteSweepOwner>");
  assert.deepEqual(decoded.value, []);
});

test("IdlRegistry registers bundled IDLs by default", () => {
  const manager = new IdlRegistry();
  assert.deepEqual(
    manager.list().map((item) => item.name),
    [
      "system",
      "account",
      "token",
      "staking",
      "identity",
      "sftoken",
      "dex",
      "validator",
      "keyless",
      "social",
      "funds",
      "commission",
      "demo",
    ],
  );
});

test("IdlRegistry decodes the bundled Token GasCharged event", () => {
  const serializer = new Postcard.PostcardSerializer();
  serializer.serializeU64(15206978723640898879n);
  serializer.serializeFixedBytes(new Uint8Array(20).fill(1));
  serializer.serializeFixedBytes(new Uint8Array(20).fill(2));
  serializer.serializeU64(42n);

  const decoded = new IdlRegistry().decodeEventData(serializer.toUint8Array());
  assert.equal(decoded.appName, "token");
  assert.equal(decoded.eventName, "GasCharged");
  assert.equal(decoded.value.amount, 42n);
});

test("bundled IDLs use app-scoped error codes and updated instructions", () => {
  assert.equal(accountIdl.errors[0].code, 256);
  assert.equal(
    tokenIdl.errors.find((error) => error.name === "FaucetDisabled")?.code,
    522,
  );
  assert.ok(
    demoIdl.instructions.some((instruction) => instruction.name === "DrawU64"),
  );

  const system = new IdlRegistry().get("system").provider.idl;
  assert.equal(system.metadata?.app_id, 0);
  assert.ok(
    system.instructions.some(
      (instruction) => instruction.name === "CommitBlockSeed",
    ),
  );
  assert.ok(
    system.instructions.some(
      (instruction) => instruction.name === "BootstrapEpochClock",
    ),
  );

  const keyless = new IdlRegistry().get("keyless").provider.idl;

  const identity = new IdlRegistry().get("identity").provider.idl;
  assert.ok(
    identity.instructions.some(
      (instruction) => instruction.name === "DiscloseVcAttestation",
    ),
  );
});

test("decodeTransactionResponse decodes gas_charged and legacy receipts", () => {
  const serializeReceipt = (gasCharged) => {
    const serializer = new Postcard.PostcardSerializer();
    serializer.serializeFixedBytes(new Uint8Array(12).fill(1));
    serializer.serializeFixedBytes(new Uint8Array(32).fill(2));
    serializer.serializeU8(1);
    serializer.serializeU32(0); // access
    serializer.serializeU32(0); // events
    serializer.serializeBool(false); // error
    if (gasCharged !== undefined) serializer.serializeU64(gasCharged);
    return serializer.toUint8Array();
  };

  assert.equal(
    decodeTransactionResponse(serializeReceipt(73n)).gasCharged,
    73n,
  );
  assert.equal(decodeTransactionResponse(serializeReceipt()).gasCharged, 0n);
});

test("decodeTransactionResponse decodes MSDK v1 framed dynamic values", () => {
  const accountBody = new Postcard.PostcardSerializer();
  accountBody.serializeU64(3n); // bitmap
  accountBody.serializeU8(2); // weight
  accountBody.serializeU8(2); // threshold
  accountBody.serializeU64(0n); // last_modified_block

  const serializer = new Postcard.PostcardSerializer();
  serializer.serializeFixedBytes(Uint8Array.from([0x4d, 0x53, 0x44, 0x4b]));
  serializer.serializeU8(1); // framed wire version
  serializer.serializeFixedBytes(new Uint8Array(12).fill(1));
  serializer.serializeFixedBytes(new Uint8Array(32).fill(2));
  serializer.serializeU8(1);
  serializer.serializeU32(1); // access
  serializer.serializeFixedBytes(new Uint8Array(18).fill(3));
  serializer.serializeBool(false); // first_snapshot
  serializer.serializeEnumVariant(0); // Inline
  serializer.serializeU64(4728916202331225981n); // account::Account
  serializer.serializeBytes(accountBody.toUint8Array());
  serializer.serializeU32(0); // events
  serializer.serializeBool(false); // error
  serializer.serializeU64(91n);

  const receipt = decodeTransactionResponse(serializer.toUint8Array());
  assert.equal(receipt.gasCharged, 91n);
  assert.deepEqual(receipt.signers, []);
  assert.equal(receipt.access[0].lastWritten.kind, "inline");
  assert.equal(receipt.access[0].lastWritten.value.name, "Account");
  assert.deepEqual(receipt.access[0].lastWritten.value.token, {
    method: "Account",
    fields: [
      { name: "bitmap", value: 3n },
      { name: "weight", value: 2 },
      { name: "threshold", value: 2 },
      { name: "last_modified_block", value: 0n },
    ],
  });
});

test("decodeTransactionResponse decodes MSDK v2 signer requirements", () => {
  const serializer = new Postcard.PostcardSerializer();
  serializer.serializeFixedBytes(Uint8Array.from([0x4d, 0x53, 0x44, 0x4b]));
  serializer.serializeU8(2); // framed wire version
  serializer.serializeFixedBytes(new Uint8Array(12).fill(1));
  serializer.serializeFixedBytes(new Uint8Array(32).fill(2));
  serializer.serializeU8(1);
  serializer.serializeU32(0); // access
  serializer.serializeU32(0); // events
  serializer.serializeBool(false); // error
  serializer.serializeU64(17n);
  serializer.serializeU32(2); // signers
  serializer.serializeFixedBytes(new Uint8Array(20).fill(4));
  serializer.serializeBool(false);
  serializer.serializeFixedBytes(new Uint8Array(20).fill(5));
  serializer.serializeBool(true);

  const receipt = decodeTransactionResponse(serializer.toUint8Array());
  assert.equal(receipt.gasCharged, 17n);
  assert.deepEqual(
    receipt.signers.map(({ address, requiresPqSignature }) => ({
      address: bytesToHex(address.bytes),
      requiresPqSignature,
    })),
    [
      {
        address: "0404040404040404040404040404040404040404",
        requiresPqSignature: false,
      },
      {
        address: "0505050505050505050505050505050505050505",
        requiresPqSignature: true,
      },
    ],
  );
});

test("decodeTransactionResponse keeps legacy inline dynamic values compatible", () => {
  const serializer = new Postcard.PostcardSerializer();
  serializer.serializeFixedBytes(new Uint8Array(12).fill(1));
  serializer.serializeFixedBytes(new Uint8Array(32).fill(2));
  serializer.serializeU8(1);
  serializer.serializeU32(1); // access
  serializer.serializeFixedBytes(new Uint8Array(18).fill(3));
  serializer.serializeBool(false); // first_snapshot
  serializer.serializeEnumVariant(0); // Inline
  serializer.serializeU64(4728916202331225981n); // account::Account
  serializer.serializeU64(5n); // bitmap, directly follows the legacy type tag
  serializer.serializeU8(1); // weight
  serializer.serializeU8(1); // threshold
  serializer.serializeU64(0n); // last_modified_block
  serializer.serializeU32(0); // events
  serializer.serializeBool(false); // error
  serializer.serializeU64(17n);

  const receipt = decodeTransactionResponse(serializer.toUint8Array());
  assert.equal(receipt.gasCharged, 17n);
  assert.equal(receipt.access[0].lastWritten.kind, "inline");
  assert.deepEqual(receipt.access[0].lastWritten.value.token.fields, [
    { name: "bitmap", value: 5n },
    { name: "weight", value: 1 },
    { name: "threshold", value: 1 },
    { name: "last_modified_block", value: 0n },
  ]);
});

test("IdlRegistry reports ambiguous postcard payloads instead of guessing", () => {
  const manager = new IdlRegistry([tokenIdl]);
  const balanceBytes = Uint8Array.from([188, 5]);
  const candidates = manager.detectView(balanceBytes, { appName: "token" });

  assert.equal(candidates.length > 1, true);
  assert.throws(
    () => manager.detectUniqueView(balanceBytes, { appName: "token" }),
    /ambiguous/,
  );
});

test("IdlRegistry decodes generated Rust aliases and fixed arrays", () => {
  const manager = new IdlRegistry([stakingIdl]);

  assert.equal(
    manager.decodeType("staking", "Amount", Uint8Array.from([188, 5])),
    700n,
  );
  assert.equal(
    manager.decodeType("staking", "Bitmap64", Uint8Array.from([3])),
    3n,
  );
  assert.deepEqual(
    manager.decodeType("staking", "HashValue", new Uint8Array(32).fill(9)),
    new Uint8Array(32).fill(9),
  );
});

test("IdlRegistry decodes nested byte vectors from updated IDLs", () => {
  const serializer = new Postcard.PostcardSerializer();
  serializer.serializeU32(2);
  serializer.serializeBytes(Uint8Array.from([1, 2]));
  serializer.serializeBytes(Uint8Array.from([3, 4, 5]));
  serializer.serializeU64(3n);

  const manager = new IdlRegistry([accountIdl]);
  const proposal = manager.decodeType(
    "account",
    "VoteProposal",
    serializer.toUint8Array(),
  );
  assert.deepEqual(proposal.instructions, [
    Uint8Array.from([1, 2]),
    Uint8Array.from([3, 4, 5]),
  ]);
  assert.equal(proposal.auth_bit, 3n);
});

test("IdlRegistry decodes TxHistory with TxReceipt returned by deployed nodes", () => {
  const serializer = new Postcard.PostcardSerializer();
  serializer.serializeU64(456n);
  serializer.serializeBool(false); // payer index
  serializer.serializeU32(0); // projected signatures
  serializer.serializeU32(0); // instructions
  serializer.serializeFixedBytes(new Uint8Array(12).fill(1));
  serializer.serializeFixedBytes(new Uint8Array(32).fill(2));
  serializer.serializeU8(1);
  serializer.serializeU32(1);
  serializer.serializeFixedBytes(
    Uint8Array.from([1, 1, ...new Uint8Array(16).fill(3)]),
  );
  serializer.serializeBool(false); // first_snapshot
  serializer.serializeEnumVariant(0); // PersistedValue::Inline
  serializer.serializeU64(4728916202331225981n); // account::Account
  serializer.serializeU64(1n); // bitmap
  serializer.serializeU8(1); // weight
  serializer.serializeU8(1); // threshold
  serializer.serializeU64(0n); // last_modified_block
  serializer.serializeU32(0); // events
  serializer.serializeBool(false); // error
  serializer.serializeU64(300n); // gas_charged

  const history = new IdlRegistry([accountIdl]).decodeTransactionHistory(
    Uint8Array.from([0, ...serializer.toUint8Array()]),
  );
  const access = history.receipt.accessResourceChanges[0];
  assert.equal(history.stamp, 456n);
  assert.equal(history.receipt.gasCharged, 300n);
  assert.equal(access.firstSnapshot, undefined);
  assert.equal(access.lastWritten.kind, "inline");
  assert.equal(access.lastWritten.decoded.type, "Account");
  assert.deepEqual(access.lastWritten.decoded.value, {
    bitmap: 1n,
    weight: 1,
    threshold: 1,
    last_modified_block: 0n,
  });
});

test("IdlProvider decodes Metadata tagged view bytes", () => {
  const provider = new IdlProvider(tokenIdl);
  const serializer = new Postcard.PostcardSerializer();
  serializer.serializeU32(1);
  serializer.serializeU64(12540935430733747277n);
  serializer.serializeStr("SDK Test Token");
  serializer.serializeStr("SDKT");
  serializer.serializeU8(6);
  serializer.serializeStr("https://milon.test/token.png");
  serializer.serializeStr("https://milon.test/token.json");

  const values = provider.decodeViewValues(
    "Metadata",
    serializer.toUint8Array(),
  );
  assert.deepEqual(values, [
    {
      typeTag: 12540935430733747277n,
      value: {
        name: "SDK Test Token",
        symbol: "SDKT",
        decimals: 6,
        icon: "https://milon.test/token.png",
        uri: "https://milon.test/token.json",
      },
    },
  ]);
});

test("IdlProvider encode/decode round trip preserves token instruction shape", () => {
  const provider = new IdlProvider(tokenIdl);
  const encoded = provider.Create.arg({
    token: rustOwner,
    owner: rustOwner,
    metadata: {
      name: "TestCoin",
      symbol: "TST",
      decimals: 6,
      icon: "https://example.com/icon.png",
      uri: "https://example.com/icon.png",
    },
  }).encode;
  const decoded = provider.Create.arg(encoded).decode;

  assert.equal(decoded.method, "Create");
  assert.equal(decoded.args.token instanceof Signer, true);
  assert.equal(decoded.args.token.address.toHex(), rustOwner.toHex());
  assert.equal(decoded.args.owner instanceof Address, true);
  assert.equal(decoded.args.owner.toHex(), rustOwner.toHex());
  assert.deepEqual(decoded.args.metadata, {
    name: "TestCoin",
    symbol: "TST",
    decimals: 6,
    icon: "https://example.com/icon.png",
    uri: "https://example.com/icon.png",
  });
});

test("IdlProvider token payloads match Rust fixtures with hash32-derived addresses", () => {
  const provider = new IdlProvider(tokenIdl);

  assert.equal(
    bytesToHex(
      provider.Create.arg({
        token: rustOwnerV2,
        owner: rustOwnerV2,
        metadata: {
          name: "TestCoin",
          symbol: "TST",
          decimals: 6,
          icon: "https://example.com/icon.png",
          uri: "https://example.com/icon.png",
        },
      }).encode,
    ),
    "02150ad9665776f8d8d410601da3b1e06d94a4b5b323f7d9665776f8d8d410601da3b1e06d94a4b5b323f70854657374436f696e03545354061c68747470733a2f2f6578616d706c652e636f6d2f69636f6e2e706e671c68747470733a2f2f6578616d706c652e636f6d2f69636f6e2e706e67",
  );

  assert.equal(
    bytesToHex(
      provider.Mint.arg({
        token: rustOwnerV2,
        to: rustToV2,
        amount: 1000n,
      }).encode,
    ),
    "020150d9665776f8d8d410601da3b1e06d94a4b5b323f7bfb70e2ffe3e8919db12970ae1964dcd725df1ace807",
  );

  assert.equal(
    bytesToHex(
      provider.BalanceOf.arg({ token: rustOwnerV2, account: rustToV2 }).encode,
    ),
    "0295e7d9665776f8d8d410601da3b1e06d94a4b5b323f7bfb70e2ffe3e8919db12970ae1964dcd725df1ac",
  );
});

test("IdlProvider encodes account PublicKey instructions", () => {
  const provider = new IdlProvider(accountIdl);
  const publicKey = new Uint8Array(32).fill(7);
  const bytes = provider.Create.arg({ owner_pk: publicKey }).encode;
  const deserializer = new Postcard.PostcardDeserializer(bytes);
  assert.equal(deserializer.deserializeU8(), 1);
  assert.equal(deserializeInstructionDiscriminator(deserializer), 2182);
  assert.equal(deserializer.deserializeEnumVariant(), 1);
  assert.deepEqual(
    Array.from(deserializer.deserializeFixedBytes(32)),
    Array.from(publicKey),
  );
});

test("IdlProvider account Create payload matches Rust fixture", () => {
  const provider = new IdlProvider(accountIdl);

  assert.equal(
    bytesToHex(provider.Create.arg({ owner_pk: rustAccountOwnerPk }).encode),
    "01860801ea4a6c63e29c520abef5507b132ec5f9954776aebebe7b92421eea691446d22c",
  );
});

test("IdlProvider account CreateMultisig payload matches fixture", () => {
  const provider = new IdlProvider(accountIdl);

  const postcardBytes = provider.CreateMultisig.arg({
    owner: rustCreateWithSignersOwner,
    signers: [
      "be9c16837dbd843fe11e476bb79703a283e72694cdb8fa626b0e3f7da065105a",
      "0299ea5e885d89f3dbcbbfa3cc944e40373256d2c0e625625637c7316ea2445c30",
      "9844dd3c2eb2aed447a06bb9df6892a19470c24a9ab043651fa045e091bd2817ad0ac5941ad5fe46327886ef45c5eec4",
    ],
    weights: [1, 1, 1],
    threshold: 2,
  }).encode;

  assert.equal(
    bytesToHex(postcardBytes),
    "01414f09f7bef7e806b43ec550c906b8ffeb3d23787f770301be9c16837dbd843fe11e476bb79703a283e72694cdb8fa626b0e3f7da065105a000299ea5e885d89f3dbcbbfa3cc944e40373256d2c0e625625637c7316ea2445c30029844dd3c2eb2aed447a06bb9df6892a19470c24a9ab043651fa045e091bd2817ad0ac5941ad5fe46327886ef45c5eec40301010102",
  );
});

devnetTest("create Account", async () => {
  const knownTxHash = "ybNJUGhZLuM3HY8pFAPhtsftFYCRRwo3Yy87hN7EUE9";
  const resHash = await get_resource_path_by_hash(Network.DEVNET, knownTxHash);
  assert.ok(resHash);

  const res = await createAccount(Network.DEVNET, accountIdl, {
    fundWithFaucet: true,
    tokenIdl,
  });

  const txHash = bytesToHex(new Uint8Array(res.body));
  const history = await waitForTxByHash(Network.DEVNET, txHash);
  const accountRes = await getAccount(Network.DEVNET, res.owner);

  // const owner = bs58ToBytes("483XtZ6ZijSjvH8JawjakpmL7PRa");
  await getAccountMethod(Network.DEVNET, res.owner);
  await totalSupplyHandle(
    Network.DEVNET,
    bs58ToBytes("M11on1111111111111111111111"),
  );
  const accountResource = history.receipt.accessResourceChanges.find(
    (item) => item.resourceIdParsed.appName === "account",
  );
  assert.ok(accountResource);

  await getResource(Network.DEVNET, accountResource.resourceId);
});
devnetTest(
  "createTokenSimulate sends auth metadata without signature bytes",
  async () => {
    await createTokenSimulate(Network.DEVNET, tokenIdl);

    // const txhash = bytesToHex(new Uint8Array(res.body.txHash));
    // const hashHex = txhash;
  },
);
devnetTest("get_resource_list_by_hash test", async () => {
  const created = await createAccount(Network.DEVNET, accountIdl, {
    fundWithFaucet: true,
    tokenIdl,
  });
  await waitForTxByHash(
    Network.DEVNET,
    bytesToHex(new Uint8Array(created.body)),
  );
  // const hash = 'By5iVQJTFm8F1VU4UMF3vQhYxNSSvWP9J8GHdGpf6Fd9'
  // const hash = '3JKuZoduMR8uTW9pvmFmZLTpJVgLaMxDViTwWJPzn6zX'
  const res = await get_resource_list_by_hash(
    Network.DEVNET,
    bytesToHex(new Uint8Array(created.body)),
  );
  // const res = await get_resource_list_by_hash(Network.DEVNET, created.body);

  assert.ok(res.txChanges.length > 0);
  assert.ok(
    res.txChanges.every(
      (item) =>
        item.resourceIdParsed.bytes[0] === 2 &&
        item.resourceIdParsed.bytes[1] === 34,
    ),
  );
});

devnetTest("createToken", async () => {
  await getBlockHead(Network.DEVNET);

  const tokenDsa512 = await createToken(Network.DEVNET, tokenIdl, {
    fundWithFaucet: true,
  });
  const hashBase58 = bytesToBs58(new Uint8Array(tokenDsa512.body));
  const resultHash = await waitForTxByHash(
    Network.DEVNET,
    hashBase58,
    30,
    1000,
  );
  if ("status" in resultHash) {
    throw new Error(`getTxByHash failed: ${JSON.stringify(resultHash.error)}`);
  }
  const decodedHistory = resultHash;

  const eventRes = await getEventByHash(
    Network.DEVNET,
    resultHash.receipt.txHashParsed.hex,
  );
  assert.equal(
    eventRes.body.events.length,
    decodedHistory.receipt.events.length,
  );
  assert.ok(eventRes.body.events.length > 0);
});

test("IdlProvider view builds executeView transaction with explicit options", async () => {
  const provider = new IdlProvider(tokenIdl, {
    async request(method, params) {
      return { method, params };
    },
  });

  const expectedInstruction = provider.BalanceOf.arg({
    token,
    account: to,
  }).encode;

  const view = await provider.view(
    "BalanceOf",
    { token, account: to },
    { stamp: 789n, chainId: 900000002n },
  );

  assert.equal(view.method, "executeView");
  assert.deepEqual(Array.from(view.params), Array.from(expectedInstruction));
});

test("IdlProvider dynamic view forwards stamp and chainId but ignores signatures", async () => {
  const provider = new IdlProvider(tokenIdl, {
    async request(method, params) {
      return { method, params };
    },
  });

  const dynamicView = await provider.BalanceOf(
    { token, account: to },
    {
      stamp: 999n,
      chainId: 900000002n,
      signatures: [
        [
          owner,
          AccountSignature.single(
            new Signature(SignatureKind.ED25519, new Uint8Array(64).fill(9)),
            new PublicKey(PublicKeyKind.ED25519, new Uint8Array(32).fill(6)),
          ),
        ],
      ],
    },
  );

  assert.equal(dynamicView.method, "executeView");
  assert.deepEqual(
    Array.from(dynamicView.params),
    Array.from(provider.BalanceOf.arg({ token, account: to }).encode),
  );
});

test("IdlProvider reports missing methods, args, wrong kind, and unsupported types", async () => {
  const provider = new IdlProvider(tokenIdl);
  assert.throws(() => provider.method("Nope").arg({}).encode, /not found/);
  assert.throws(
    () => provider.Mint.arg({ token, amount: 1n }).encode,
    /missing IDL argument: to/,
  );
  assert.throws(
    () => provider.transaction("BalanceOf", { token, account: to }),
    /not an entry/,
  );
  await assert.rejects(
    () => provider.view("Mint", { token, to, amount: 1n }),
    /transport is required/,
  );
  assert.throws(
    () =>
      new IdlProvider({
        ...tokenIdl,
        instructions: [
          {
            name: "X",
            kind: "view",
            discriminator: 0,
            handler: "x",
            args: [{ name: "x", role: "input", type: "Map" }],
          },
        ],
      }).X.arg({ x: 1 }).encode,
    /unsupported IDL type/,
  );
});
