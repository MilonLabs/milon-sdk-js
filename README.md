# Milon TypeScript SDK

`@milonlabs/milon-sdk` is Milon's TypeScript/JavaScript SDK for creating and signing transactions, working with application IDLs, and calling the Milon invoke API.

## Installation

```bash
npm install @milonlabs/milon-sdk
# or
pnpm add @milonlabs/milon-sdk
```

Requirements: Node.js 20.19+, ESM, and TypeScript 5.4+ for TypeScript projects.

## Quick start

```ts
import {
  Address,
  IdlName,
  IdlProvider,
  Network,
  NetworkToChainId,
  SecretKey,
  Transaction,
  bytesToHex,
} from "@milonlabs/milon-sdk";

const secretKey = SecretKey.generateClassical();
const publicKey = await secretKey.ed25519Public();
const address = Address.fromPublicKey(publicKey);
const provider = new IdlProvider(IdlName.Token);

const instruction = provider.Create.arg({
  token: address,
  owner: address,
  metadata: {
    name: "SDK Token",
    symbol: "SDK",
    decimals: 6,
    icon: "https://example.com/token.png",
  },
}).encode;

const tx = new Transaction({
  stamp: BigInt(Date.now()),
  payer: address,
  instructions: [instruction],
  chainId: BigInt(NetworkToChainId[Network.DEVNET]),
});

await tx.signEd25519(address, secretKey, publicKey);
tx.validateWire();
console.log(bytesToHex(tx.txHash()));
```

## Networks and chain IDs

`NetworkToChainId` is the canonical mapping used by SDK helpers:

| Network | Chain ID |
| --- | ---: |
| `Network.MAINNET` | `1` |
| `Network.TESTNET` | `10001` |
| `Network.DEVNET` | `10010` |

Use `setNetwork(Network.DEVNET)` for lower-level APIs that share global chain state. A configured global chain state cannot be changed to a different chain ID. High-level RPC methods, including `getBlockHead()` and `getTxByHash()`, take the network as an explicit argument.

## Imports

Common types are exported from the package root:

```ts
import { Address, IdlName, IdlProvider, Transaction } from "@milonlabs/milon-sdk";
```

Module entry points are also available: `crypto`, `resource`, `transaction`, `transaction-json`, `app`, `executor`, `chain`, `utils`, `idl`, `bcs`, `postcard`, and `serde`.

## Keys, signatures, and addresses

| Algorithm | Private key | Public key | Signature |
| --- | ---: | ---: | ---: |
| Ed25519 | 32 bytes | 32 bytes | 64 bytes |
| secp256k1 | 32 bytes | 33 bytes | 65 bytes |
| BLS12-381 | 32-byte seed | 48 bytes | 96 bytes |
| FN-DSA-512 | 1281 bytes | 897 bytes | 666 bytes |

Ed25519, secp256k1, and BLS12-381 use a classical 32-byte private key. FN-DSA-512 uses its own 1281-byte key. `SecretKey.generate()` is shorthand for `generateClassical()`; legacy classical-generation APIs remain compatible.

Never log or commit private-key encodings.

## IDL providers

Milon instruction bytes use this wire format:

```text
app_id: u8 | discriminator: u16 little-endian | postcard(args)
```

Use a built-in provider or provide a custom IDL:

```ts
const provider = new IdlProvider(IdlName.Token);
const mintBytes = provider.Mint.arg({ token, to: recipient, amount: 1000n }).encode;
const decoded = provider.Mint.arg(mintBytes).decode;
```

Built-in providers include `System`, `Account`, `Token`, `Staking`, `Identity`, `Sftoken`, `Dex`, `Validator`, `Keyless`, `Social`, `Funds`, `Commission`, and `Demo`. `IdlRegistry` decodes resources, events, simulation results, and transaction histories. Register custom IDLs before decoding unknown type tags.

`Keyless.Authenticate` takes one `auth: Groth16Auth` argument. The removed `AuthenticateZk` and `BindZk` APIs are not supported. Token and Social Hongbao flows, social-follow APIs, and Sftoken total-balance methods are exposed through the current built-in IDLs.

### Keyless validator JWK reports

Validator-submitted JWK reports are now validator-authorized, gas-exempt, and require a post-quantum signature. `UpdateJwkReport` no longer accepts a `validator_account` signer argument; its arguments are now `provider_id` and `jwks`. Use `UpdateVersionedJwkReport(provider_id, issuer, report_version, jwks)` for versioned reports and `GetVersionedJwkReport(validator, provider_id)` to query one. Applications should handle the new `JwkVoteQuorumNotReached` and `JwkReportVersionMismatch` errors.

### Validator epoch migration

The legacy System validator-identity and validator-pool lifecycle APIs have been replaced. Use `System.BootstrapRegisteredValidatorSet(validators)` to seed a registered validator set. System proposal operations (`Propose`, `ProposeParams`, `Vote`, and `Cancel`) no longer receive a signer argument; they are validator-authorized, gas-exempt, and require a post-quantum signature.

The Validator IDL now exposes epoch-oriented operations: `RecordValidatorActivity`, `BootstrapValidatorRules`, `FreezeValidatorEpoch`, `JoinValidator`, `ExitValidator`, `TopUpSelfStake`, and `SettleValidatorEpoch`. Query the resulting state through `ValidatorProposalActivity`, `ValidatorMemberships`, `ValidatorForOwner`, `ValidatorSelfStake`, and `RegisteredValidators`. Funding and operator-reward accounting are provided by the Funds application.

`RegisterValidator` now takes `owner`, `consensus_account`, consensus and BLS public-key material, `bls_proof`, `ed25519_pubkey`, `self_stake`, and `commission_rate_bps`. Existing callers of pool creation, pause/resume/close, candidate-pool, reward-policy, and validator-controller methods must migrate to the new epoch APIs.

### Funds, Commission, and Hongbao refunds

`Funds` provides operator reward claims and fee/reward budget queries. `Commission` provides collection schemes, collection payments, refunds, settlement, merchant/promoter claims, order queries, and commission quotes. Both are available through `new IdlProvider(IdlName.Funds)` and `new IdlProvider(IdlName.Commission)`.

Application fee events use `Funds.FeeDebited` and `Funds.FeeDistributed`; they replace the former application-fee and promotion-commission event types. Execution gas debits use `Token.GasCharged { payer, token, amount }`; a transaction's gas events total `receipt.gas_charged`. DEX fee recipients are named `promoter` (formerly `channel`), and `EventOrderFilled.fee_sequence` is optional. Consumers decoding historical events must use the event type tag and current IDL rather than assume the removed event schemas.

DEVNET faucet funding is now `1 MIL` per claim (`1_000_000` base units), down from the earlier `10,000 MIL` allocation. Test and onboarding flows must not assume the prior amount.

Expired Hongbao flows now support `ScheduleHongbaoRefund(hongbaoId)` followed by the sponsored `RunHongbaoRefund(hongbaoId)` task. The Token IDL also exposes the refund task state, queue resources, and `HongbaoRefunded` event through `IdlRegistry`.

## JSON transactions

`TransactionJsonCodec` validates arguments against registered IDLs and converts between DApp JSON, transactions, and Postcard bytes. JSON `u64`, `u128`, `i64`, `stamp`, and `chainId` values are decimal strings to preserve integer precision. Address and signer values use Base58; byte strings use a `0x` prefix.

Use `viewJsonToPostcard()` only for IDL View methods. For a low-level view request, pass `viewInstructionsFromJson(input)` directly as the body for `RpcMethodEnum.view`.

### Entry JSON example

```ts
import { Network, submitTransactionJson } from "@milonlabs/milon-sdk";

const result = await submitTransactionJson(Network.DEVNET, {
  app: "Token",
  tx: {
    stamp: String(Date.now()),
    payer: payer.toBase58(),
    chainId: "10010",
    instructions: [{
      method: "Transfer",
      args: {
        from: owner.toBase58(), token: token.toBase58(),
        to: recipient.toBase58(), amount: "1000",
      },
    }],
    signatures: [],
  },
});
```

The codec does not read private keys or sign automatically. Validate and display canonical JSON before requesting a wallet signature. Submit only a JSON transaction that already contains all required signatures.

### View JSON example

```ts
import { executeViewJson, Network } from "@milonlabs/milon-sdk";

const response = await executeViewJson(Network.DEVNET, {
  app: "Token",
  instructions: [{
    method: "BalanceOf",
    args: { token: token.toBase58(), owner: owner.toBase58() },
  }],
});
```

View envelopes do not include `stamp`, `payer`, `chainId`, or signatures. Entry methods are rejected from the View JSON API.

## Signing modes

| Mode | Payer | Signatures |
| --- | --- | --- |
| `UnifiedPayerSignAll` | payer address | payer authorizes every instruction and payer bit |
| `UnifiedDualSign` | payer address | payer bit plus instruction-owner signatures |
| `UnifiedPayerOnlyGas` | sponsor address | sponsor payer bit plus instruction-owner signatures |
| `Split` | `null` | each owner authorizes its instruction and gas |

An owner may call `addSignature()` only once per transaction. Combine all instruction indices for that owner into one signature. Multisig signing supports `multisigKeyIndex`, which sets `sigBit` and omits the inline public key.

### Transaction construction checklist

1. Select `Network` and resolve its chain ID through `NetworkToChainId`.
2. Encode every instruction with its current IDL.
3. Set a millisecond `stamp`, the correct `payer`, and the matching `chainId`.
4. Use the signing helper appropriate for the payer/instruction ownership model.
5. Call `validateWire()` before serializing or submitting the transaction.
6. Submit only through a trusted node endpoint and persist the returned transaction hash.

Do not hard-code an instruction discriminator, chain ID, or IDL error number. Those values are protocol data and are synchronized from the Rust repository in every SDK release.

### Typed and dynamic IDL calls

When the app is known at compile time, use a built-in `IdlName` for typed method names and argument hints. For a dynamically chosen method, use `provider.method(name)`:

```ts
const provider = new IdlProvider(IdlName.Validator);
const bytes = provider.method("JoinValidator").arg({ owner, validator }).encode;
```

An IDL `Signer` field identifies the required transaction authorization; it is still encoded as part of the instruction arguments. Metadata such as `validator`, `requires_pq_signature`, `gas_exempt`, and `validator_signer_mode` describes protocol policy and must be honored by the caller's signing flow.

## Account and Token builders

The root export provides `Account` and `Token` namespaces. Builders return descriptive instruction objects; encode them with the matching `provider.<Method>.arg(args).encode` call before submitting them to the chain.

`createAccount` and `createToken` accept `fundWithFaucet: true` for DEVNET testing. DEVNET faucet transactions are sponsored and use no unified payer. Production callers must fund their own payer with MIL.

## RPC and resources

`ClientHandler` is the low-level invoke client. It defaults to `Network.DEVNET`, preserves the selected network for subsequent requests, and accepts shared `fetchImpl`, `requestId`, and timeout settings.

Useful high-level methods include `getBlockHead`, `getTxByHash`, `getAccount`, `getResource`, `get_resource_path_by_hash`, `get_access_value`, `get_resource_list_by_hash`, `nodeCapability`, and `validatorLocations`.

`getTxByHash` accepts a 32-byte transaction hash or 12-byte transaction ID and returns decoded history on success. `get_resource_path_by_hash` accepts an 18-byte resource hash directly; when given a 32-byte transaction hash, it resolves the transaction's changed resources and returns their paths as a batch result. `get_resource_list_by_hash` resolves and decodes inline and external resource values, retaining external blob metadata.

### RPC example and timeouts

```ts
import { ClientHandler, Network, RpcMethodEnum } from "@milonlabs/milon-sdk";

const client = new ClientHandler(Network.DEVNET, { timeoutMs: 10_000 });
const response = await client.request({ method: RpcMethodEnum.chain_head, body: [] });
if (response.status !== 0) {
  throw new Error(response.error?.message ?? `RPC status ${response.status}`);
}
```

The default request timeout is 30 seconds. A timeout raises `TimeoutError`. Successful typed responses expose decoded `body` and original `postcardData`; nonzero RPC statuses preserve the response error. Built-in IDL error codes are enriched with `error.name` when known.

### Resources and transaction history

`IdlRegistry.decodeTransactionHistory(bytes)` decodes the current Rust transaction-history wire format. The history receipt exposes decoded events and access-resource changes. A resource value may be `inline` or `external`; external values retain their blob hash and are resolved by `get_access_value` or batched through `get_resource_list_by_hash`.

Pass the source chain ID to `Transaction.fromPostcard(bytes, chainId)` whenever hashes or signatures will later be verified. Postcard transaction bytes do not include the chain ID.

## Postcard, BCS, and wire data

Prefer the SDK's `fromPostcard()` implementation when one is available. It validates the expected field order and trailing bytes. Use `PostcardDeserializer` for protocol payloads without an SDK type, and call `assertEnd()` unless the protocol explicitly allows trailing bytes.

Postcard uses unsigned varints for `u16` and larger unsigned integers, ZigZag varints for signed integers, length prefixes for strings and vectors, and a 0/1 tag for options and booleans.

`Transaction.fromPostcard(bytes, chainId)` requires the originating chain ID when later hash or signature validation is needed. Transaction history is decoded with `new IdlRegistry().decodeTransactionHistory(bytes)`.

## Errors

Fixed-length types validate byte lengths. RPC responses with `status !== 0` indicate failure; inspect `error.message` and, when present, `error.name`. A `NotFound` response has status `2`.

`TransactionJsonError` adds a stable `code` and `path` for invalid JSON. Treat error names and codes as protocol-facing data: refresh the SDK IDLs when a target node introduces new errors rather than matching unstructured message text.

## Maintaining the SDK IDLs

IDL files in `IDL/` are generated protocol artifacts. Do not hand-edit them. To synchronize against the adjacent Rust repository and regenerate the SDK catalog:

```bash
npm run sync:idls
```

The command copies the Rust IDL catalog, preserves large type tags as decimal strings, validates app metadata, and regenerates `src/idl/default-idls.ts`. After a Rust update, review instruction additions/removals, changed argument lists, resources/events, and error-code changes; update builders and this README if a public integration contract changed.

## Development

```bash
npm run check
npm run build
npm test
npm run test:devnet
```

`npm test` runs local tests only. `npm run test:devnet` enables online integration tests; their results depend on node state, network connectivity, faucet cooldowns, and retained history.

The `example/` directory contains focused runnable examples for keys and addresses, IDL signing, JSON conversion, Account/Token builders, resource codecs, the bundled IDL catalog, and RPC/View calls. Network examples require `MILON_RUN_NETWORK_EXAMPLES=1`.
