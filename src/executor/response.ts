import { assertBytes, type BytesLike } from "../crypto/index";
import { IdlRegistry, decodeTransactionResponse } from "../idl/index";
import type { DecodedAnySerializeValue } from "../idl/manager";
import type { RpcMethodBodyMap } from "../idl/struct";
import {
  decodeBatchResourcePathList,
} from "../resource/index";
import { decodeJsonBody } from "../utils/index";
import { RpcMethodEnum } from "../utils/method";
import { PostcardDeserializer } from "../postcard/index";
import { Address, PublicKey, PublicKeyKind } from "../crypto/index";
import {
  AccountView,
  BlockView,
  ChainHead,
  EventsByTxHashResponse,
  TxHistoryInclusionProof,
  decodeTaggedValueBytes,
  decodeBatchViewResults,
} from "./wire";
import type { NodeCapabilityView, ValidatorLocationView } from "../idl/struct";

export function deserializeRpcBody<M extends RpcMethodEnum>(
  method: M,
  body: BytesLike,
): RpcMethodBodyMap[M] {
  const bytes = assertBytes(body, undefined, "RpcResponseBody");
  const registry = new IdlRegistry();
  let decoded: RpcMethodBodyMap[RpcMethodEnum];

  switch (method) {
    case RpcMethodEnum.chain_head:
      decoded = ChainHead.fromPostcard(bytes);
      break;
    case RpcMethodEnum.submit_tx:
      decoded = assertBytes(bytes, 32, "submit_tx hash");
      break;
    case RpcMethodEnum.simulate_tx:
      decoded = decodeTransactionResponse(bytes);
      break;
    case RpcMethodEnum.batch_view:
      // Request-aware IDL decoding is completed by ClientHandler.
      decoded = decodeBatchViewResults(bytes) as unknown as RpcMethodBodyMap[RpcMethodEnum.batch_view];
      break;
    case RpcMethodEnum.node_capability:
      decoded = decodeNodeCapability(bytes) as RpcMethodBodyMap[RpcMethodEnum.node_capability];
      break;
    case RpcMethodEnum.validator_locations:
      decoded = decodeValidatorLocations(bytes) as RpcMethodBodyMap[RpcMethodEnum.validator_locations];
      break;
    case RpcMethodEnum.get_resource: {
      const { typeTag, bytes: valueBytes } = decodeTaggedValueBytes(bytes);
      const value = registry.decodeAccessValue(typeTag, valueBytes);
      decoded = {
        bytes,
        typeTag,
        valueBytes,
        ...(value !== undefined ? { decoded: value } : {}),
      };
      break;
    }
    case RpcMethodEnum.get_block_by_height:
      decoded = BlockView.fromPostcard(bytes);
      break;
    case RpcMethodEnum.get_tx_by_hash:
      decoded = registry.decodeTransactionHistory(bytes);
      break;
    case RpcMethodEnum.get_account:
      decoded = AccountView.fromPostcard(bytes);
      break;
    case RpcMethodEnum.events_by_tx_hash:
      decoded = EventsByTxHashResponse.fromPostcard(bytes);
      break;
    case RpcMethodEnum.get_resource_path_by_hash:
      decoded = decodeJsonBody<string>(bytes);
      break;
    case RpcMethodEnum.get_access_value:
      decoded = decodeAccessValue(bytes, registry);
      break;
    case RpcMethodEnum.batch_get_resource_path_by_hash:
      decoded = decodeBatchResourcePathList(bytes);
      break;
    case RpcMethodEnum.get_tx_history_proof:
      decoded = TxHistoryInclusionProof.fromPostcard(bytes);
      break;
    case RpcMethodEnum.keyless_providers:
      decoded = decodeKeylessProviderList(bytes) as RpcMethodBodyMap[RpcMethodEnum.keyless_providers];
      break;
    case RpcMethodEnum.keyless_sessions:
      decoded = decodeKeylessSessions(bytes) as RpcMethodBodyMap[RpcMethodEnum.keyless_sessions];
      break;
    case RpcMethodEnum.keyless_binding:
      decoded = registry.decodeType("keyless", "option<KeylessBinding>", bytes) as RpcMethodBodyMap[RpcMethodEnum.keyless_binding];
      break;
    case RpcMethodEnum.keyless_is_keyless:
      decoded = registry.decodeType("keyless", "bool", bytes) as RpcMethodBodyMap[RpcMethodEnum.keyless_is_keyless];
      break;
    case RpcMethodEnum.keyless_provider:
      decoded = decodeOption(bytes, decodeKeylessProvider) as RpcMethodBodyMap[RpcMethodEnum.keyless_provider];
      break;
    case RpcMethodEnum.keyless_audience:
      decoded = decodeOption(bytes, (d) => ({ provider_id: d.deserializeFixedBytes(32), audience: d.deserializeStr(), registered_at_ms: d.deserializeU64() })) as RpcMethodBodyMap[RpcMethodEnum.keyless_audience];
      break;
    case RpcMethodEnum.keyless_params: {
      const d = new PostcardDeserializer(bytes);
      decoded = { max_session_ttl_ms: d.deserializeU64(), bind_activation_delay_ms: d.deserializeU64() } as RpcMethodBodyMap[RpcMethodEnum.keyless_params];
      d.assertEnd();
      break;
    }
    case RpcMethodEnum.keyless_provider_status:
      decoded = decodeOption(bytes, (d) => ({ enabled: d.deserializeBool(), session_version: d.deserializeU64() })) as RpcMethodBodyMap[RpcMethodEnum.keyless_provider_status];
      break;
    default:
      // Batch RPC responses preserve per-item Result values. Keep their raw
      // Postcard representation until a request-specific typed helper decodes it.
      decoded = bytes;
  }

  return decoded as RpcMethodBodyMap[M];
}

function decodeOption<T>(bytes: Uint8Array, decode: (d: PostcardDeserializer) => T): T | undefined {
  const d = new PostcardDeserializer(bytes);
  const value = d.deserializeBool() ? decode(d) : undefined;
  d.assertEnd();
  return value;
}

function decodeNodeCapability(bytes: Uint8Array): NodeCapabilityView {
  const d = new PostcardDeserializer(bytes);
  const readU32Vec = () => Array.from({ length: d.deserializeU32() }, () => d.deserializeU32());
  const features = readU32Vec();
  const binary_digest = d.deserializeBool() ? d.deserializeFixedBytes(32) : undefined;
  const height = d.deserializeU64();
  const missing_active = readU32Vec();
  const missing_voting = readU32Vec();
  const supports_all = d.deserializeBool();
  const tx_unknown = Array.from({ length: d.deserializeU32() }, () => ({
    kind: d.deserializeStr(),
    value: d.deserializeStr(),
    count: d.deserializeU64(),
  }));
  d.assertEnd();
  return {
    features,
    ...(binary_digest === undefined ? {} : { binary_digest }),
    height,
    missing_active,
    missing_voting,
    supports_all,
    tx_unknown,
  };
}

function decodeValidatorLocations(bytes: Uint8Array): ValidatorLocationView[] {
  const d = new PostcardDeserializer(bytes);
  const locations = Array.from({ length: d.deserializeU32() }, () => ({
    account_address: new Address(d.deserializeFixedBytes(Address.LENGTH)),
    ...(d.deserializeBool() ? { country: d.deserializeStr() } : {}),
    ...(d.deserializeBool() ? { city: d.deserializeStr() } : {}),
    ...(d.deserializeBool() ? { latitude: d.deserializeF64() } : {}),
    ...(d.deserializeBool() ? { longitude: d.deserializeF64() } : {}),
  }));
  d.assertEnd();
  return locations;
}

function decodeKeylessProviderList(bytes: Uint8Array) {
  const d = new PostcardDeserializer(bytes);
  const count = d.deserializeU32();
  const providers = Array.from({ length: count }, () => decodeKeylessProvider(d));
  d.assertEnd();
  return providers;
}

function decodeKeylessProvider(d: PostcardDeserializer) {
  const provider_id = d.deserializeFixedBytes(32);
  const kind = d.deserializeStr();
  const display_name = d.deserializeStr();
  const issuer = d.deserializeStr();
  const count = d.deserializeU32();
  const allowed_algs = Array.from({ length: count }, () => d.deserializeStr());
  const max_id_token_age_ms = d.deserializeU64();
  const max_session_ttl_ms = d.deserializeU64();
  const owner = d.deserializeBool() ? new Address(d.deserializeFixedBytes(20)) : undefined;
  const key_revision = d.deserializeU64();
  const enabled = d.deserializeBool();
  const session_version = d.deserializeU64();
  return { provider_id, kind, display_name, issuer, allowed_algs, max_id_token_age_ms, max_session_ttl_ms, owner, key_revision, enabled, session_version };
}

function decodeKeylessSessions(bytes: Uint8Array) {
  const d = new PostcardDeserializer(bytes);
  const count = d.deserializeU32();
  const sessions = Array.from({ length: count }, () => ({
    session_id: d.deserializeFixedBytes(32),
    provider_id: d.deserializeFixedBytes(32),
    audience_hash: d.deserializeFixedBytes(32),
    session_version: d.deserializeU64(),
    session_pubkey: decodePublicKey(d),
    expires_at_ms: d.deserializeU64(),
    created_at_ms: d.deserializeU64(),
  }));
  d.assertEnd();
  return sessions;
}

function decodePublicKey(d: PostcardDeserializer): PublicKey {
  switch (d.deserializeEnumVariant()) {
    case 0: return new PublicKey(PublicKeyKind.SECP256K1, d.deserializeFixedBytes(33));
    case 1: return new PublicKey(PublicKeyKind.ED25519, d.deserializeFixedBytes(32));
    case 2: return new PublicKey(PublicKeyKind.BLS12381, d.deserializeFixedBytes(48));
    case 3: return new PublicKey(PublicKeyKind.FN_DSA512, d.deserializeFixedBytes(897));
    case 4: return new PublicKey(PublicKeyKind.KEYLESS_DERIVED, d.deserializeFixedBytes(32));
    default: throw new Error("unknown PublicKey variant");
  }
}

function decodeAccessValue(bytes: Uint8Array, registry: IdlRegistry): RpcMethodBodyMap[RpcMethodEnum.get_access_value] {
  const d = new PostcardDeserializer(bytes);
  const hash = d.deserializeFixedBytes(32);
  if (!d.deserializeBool()) {
    d.assertEnd();
    return { hash };
  }
  const rawValueBytes = d.deserializeBytes();
  const { typeTag, bytes: valueBytes } = decodeTaggedValueBytes(rawValueBytes);
  const value: { typeTag: bigint; bytes: Uint8Array; decoded?: DecodedAnySerializeValue; error?: string } = { typeTag, bytes: valueBytes };
  try {
    value.decoded = registry.decodeAccessValue(typeTag, valueBytes);
  } catch (error) {
    value.error = error instanceof Error ? error.message : String(error);
  }
  d.assertEnd();
  return { hash, value };
}

/** Decode each successful view result using the IDL method from its request instruction. */
export function deserializeViewRpcBody(
  requestBody: unknown,
  responseBody: BytesLike,
): RpcMethodBodyMap[RpcMethodEnum.view] {
  const instructionBytes = assertBytes(requestBody as BytesLike, undefined, "ViewInstruction");
  const registry = new IdlRegistry();
  const appId = instructionBytes[0];
  if (appId === undefined) throw new Error("view instruction is empty");
  const registered = registry.get(appId);
  const instruction = registered.provider.decodeAny(instructionBytes);
  const decoded = registry.decodeView({ appId, method: instruction.method, bytes: assertBytes(responseBody) });
  return { ok: true, rawValue: assertBytes(responseBody), ...decoded };
}

/** Decode successful items in a `batch_view` response with their matching IDL method. */
export function deserializeBatchViewRpcBody(
  requestBody: unknown,
  responseBody: BytesLike,
): RpcMethodBodyMap[RpcMethodEnum.batch_view] {
  if (!Array.isArray(requestBody)) throw new TypeError("BatchViewInstruction must be an array");
  const instructions = requestBody.map((value, index) => assertBytes(value, undefined, `BatchViewInstruction[${index}]`));
  return decodeBatchViewResults(responseBody).map((result, index) => {
    if (!result.ok) return result;
    const instructionBytes = instructions[index];
    if (!instructionBytes) throw new Error(`batch view response has no matching request instruction at index ${index}`);
    return deserializeViewRpcBody(instructionBytes, result.value);
  });
}
