import type {
  DecodedAnySerializeValue,
  DecodedTransactionHistory,
} from "./manager";
import type { BatchResourcePathEntry } from "../resource/index";
import type { RpcMethodEnum } from "../utils/method";
import type {
  AccessValueEntry,
  AccountView,
  BlockView,
  ChainHead,
  EventsByTxHashResponse,
  SimulateReceipt,
  TxHistoryInclusionProof,
} from "../executor/wire";
import type { ApiFailure } from "../executor/wire";
import type { Address, PublicKey } from "../crypto/index";
import type { DetectedViewCandidate } from "./manager";

/**
 * Common JSON envelope returned by the Milon HTTP RPC endpoint.
 */
export interface RpcError {
  code?: number;
  name?: string;
  message?: string;
  [key: string]: unknown;
}

export interface RpcResponse<TBody = number[]> {
  request_id: number;
  status: number;
  body: TBody;
  postcardData?: number[];
  error?: RpcError | null;
  head?: unknown;
}

export interface ResourceValueResponse {
  bytes: Uint8Array;
  typeTag: bigint;
  valueBytes: Uint8Array;
  decoded?: DecodedAnySerializeValue;
}

export interface KeylessProviderView {
  provider_id: Uint8Array;
  kind: string;
  display_name: string;
  issuer: string;
  allowed_algs: string[];
  max_id_token_age_ms: bigint;
  max_session_ttl_ms: bigint;
  owner?: Address;
  key_revision: bigint;
  enabled: boolean;
  session_version: bigint;
}

export interface KeylessSessionEntry {
  session_id: Uint8Array;
  provider_id: Uint8Array;
  audience_hash: Uint8Array;
  session_version: bigint;
  session_pubkey: PublicKey;
  expires_at_ms: bigint;
  created_at_ms: bigint;
}

export interface KeylessAudienceView { provider_id: Uint8Array; audience: string; registered_at_ms: bigint }
export interface KeylessParamsView { max_session_ttl_ms: bigint; bind_activation_delay_ms: bigint }
export interface KeylessProviderStatusView { enabled: boolean; session_version: bigint }

export interface NodeCapabilityUnknownTx {
  kind: string;
  value: string;
  count: bigint;
}

export interface NodeCapabilityView {
  features: number[];
  binary_digest?: Uint8Array;
  height: bigint;
  missing_active: number[];
  missing_voting: number[];
  supports_all: boolean;
  tx_unknown: NodeCapabilityUnknownTx[];
}

/** Public validator location; the node deliberately omits peer IP addresses. */
export interface ValidatorLocationView {
  account_address: Address;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface KeylessBinding {
  owner: Address;
  slot_index: number;
  bound_at_ms: bigint;
  active_at_ms: bigint;
}

export type DecodedViewResult =
  | ({ ok: true; rawValue: Uint8Array } & DetectedViewCandidate)
  | { ok: false; error: ApiFailure };

export interface RpcMethodBodyMap {
  [RpcMethodEnum.chain_head]: ChainHead;
  [RpcMethodEnum.submit_tx]: Uint8Array;
  [RpcMethodEnum.batch_submit_tx]: Uint8Array;
  [RpcMethodEnum.simulate_tx]: SimulateReceipt;
  [RpcMethodEnum.batch_simulate_tx]: Uint8Array;
  [RpcMethodEnum.view]: DecodedViewResult;
  [RpcMethodEnum.batch_view]: DecodedViewResult[];
  [RpcMethodEnum.get_resource]: ResourceValueResponse;
  [RpcMethodEnum.batch_get_resource]: Uint8Array;
  [RpcMethodEnum.get_block_by_height]: BlockView;
  [RpcMethodEnum.batch_get_block_by_height]: Uint8Array;
  [RpcMethodEnum.get_tx_by_hash]: DecodedTransactionHistory;
  [RpcMethodEnum.batch_get_tx_by_hash]: Uint8Array;
  [RpcMethodEnum.get_account]: AccountView;
  [RpcMethodEnum.batch_get_account]: Uint8Array;
  [RpcMethodEnum.events_by_tx_hash]: EventsByTxHashResponse;
  [RpcMethodEnum.batch_events_by_tx_hash]: Uint8Array;
  [RpcMethodEnum.node_capability]: NodeCapabilityView;
  [RpcMethodEnum.validator_locations]: ValidatorLocationView[];
  [RpcMethodEnum.get_resource_path_by_hash]: string;
  [RpcMethodEnum.get_access_value]: AccessValueEntry<DecodedAnySerializeValue>;
  [RpcMethodEnum.batch_get_access_value]: Uint8Array;
  [RpcMethodEnum.batch_get_resource_path_by_hash]: BatchResourcePathEntry[];
  [RpcMethodEnum.get_tx_history_proof]: TxHistoryInclusionProof;
  [RpcMethodEnum.batch_get_tx_history_proof]: Uint8Array;
  [RpcMethodEnum.keyless_providers]: KeylessProviderView[];
  [RpcMethodEnum.keyless_sessions]: KeylessSessionEntry[];
  [RpcMethodEnum.keyless_binding]: KeylessBinding | undefined;
  [RpcMethodEnum.keyless_is_keyless]: boolean;
  [RpcMethodEnum.keyless_provider]: KeylessProviderView | undefined;
  [RpcMethodEnum.keyless_audience]: KeylessAudienceView | undefined;
  [RpcMethodEnum.keyless_params]: KeylessParamsView;
  [RpcMethodEnum.keyless_provider_status]: KeylessProviderStatusView | undefined;
  [RpcMethodEnum.keyless_selected_jwk]: Uint8Array;
}

export type RpcMethodResponse<M extends RpcMethodEnum> =
  RpcResponse<RpcMethodBodyMap[M]>;

/**
 * Postcard response structures used by individual RPC methods.
 *
 * They remain implemented in executor/wire for backward compatibility, while
 * this module is the canonical place from which application code should import
 * RPC response structures.
 */
export {
  AccountView,
  BlockView,
  ChainHead,
  EventEntry,
  EventsByTxHashResponse,
  InvokeResponse,
  SimulateAccessRecord,
  SimulateReceipt,
  TxHistoryInclusionProof,
} from "../executor/wire";
export type {
  AccessValueData,
  AccessValueEntry,
  ApiFailure,
  PersistedValue,
  TxFailurePayload,
  ViewResult,
} from "../executor/wire";
