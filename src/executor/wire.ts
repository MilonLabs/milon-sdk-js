import { Address, assertBytes, bytesToHex, type BytesLike, type U64Like } from "../crypto/index";
import { PostcardDeserializer, PostcardSerializer } from "../postcard/index";

export const MIME_POSTCARD = "application/x-milon+postcard";
export const MIME_JSON = "application/json";
export const TCP_POSTCARD_FORMAT = 0;
export const MAX_FRAME_BYTES = 64 * 1024 * 1024;

export enum InvokeMethod {
  ChainHead = 1,
  SubmitTx = 2,
  SimulateTx = 3,
  View = 4,
  GetResource = 5,
  GetBlockByHeight = 6,
  GetTxByHash = 7,
  GetAccount = 8,
  EventsByTxHash = 9,
  ListResourcePath = 10,
  GetResourcePathByHash = 11,
  GetAccessValue = 12,
}

export enum ResponseStatus {
  Ok = 0,
  Invalid = 1,
  NotFound = 2,
  Disabled = 3,
  Unavailable = 4,
  Internal = 5,
  Failed = 6,
}

export interface ApiFailure {
  message: string;
  code?: number;
  data?: Uint8Array;
}

export interface TxFailurePayload {
  code: number;
  message: string;
  data: Uint8Array;
}

export type ViewResult<TValue = Uint8Array> =
  | { ok: true; value: TValue }
  | { ok: false; error: TxFailurePayload };

/** Per-item result emitted by the RPC `batch_view` endpoint. */
export type BatchViewResult<TValue = Uint8Array> =
  | { ok: true; value: TValue }
  | { ok: false; error: ApiFailure };

export interface InvokeRequestOptions {
  requestId?: U64Like;
}

export function decodeViewResults(bytes: BytesLike): ViewResult[] {
  const d = new PostcardDeserializer(bytes);
  const count = d.deserializeU32();
  const results: ViewResult[] = [];
  for (let i = 0; i < count; i += 1) {
    const variant = d.deserializeEnumVariant();
    if (variant === 0) {
      results.push({ ok: true, value: d.deserializeBytes() });
      continue;
    }
    if (variant === 1) {
      results.push({ ok: false, error: deserializeTxFailurePayload(d) });
      continue;
    }
    throw new Error(`invalid view result variant: ${variant}`);
  }
  d.assertEnd();
  return results;
}

/**
 * Decodes `batch_view` results. Unlike the historical multi-view response,
 * failures are RPC `ApiFailure`s: `message, Option<u16> code, Option<Vec<u8>> data`.
 */
export function decodeBatchViewResults(bytes: BytesLike): BatchViewResult[] {
  const d = new PostcardDeserializer(bytes);
  const count = d.deserializeU32();
  const results: BatchViewResult[] = [];
  for (let i = 0; i < count; i += 1) {
    const variant = d.deserializeEnumVariant();
    if (variant === 0) {
      results.push({ ok: true, value: d.deserializeBytes() });
      continue;
    }
    if (variant === 1) {
      results.push({ ok: false, error: deserializeApiFailure(d) });
      continue;
    }
    throw new Error(`invalid batch view result variant: ${variant}`);
  }
  d.assertEnd();
  return results;
}

export function unwrapViewResults(bytes: BytesLike): Uint8Array[] {
  return decodeViewResults(bytes).map((result, index) => {
    if (result.ok) return result.value;
    throw new Error(formatViewFailure(result.error, index));
  });
}

export function unwrapFirstViewResult(bytes: BytesLike): Uint8Array {
  let results: ViewResult[];
  try {
    results = decodeViewResults(bytes);
  } catch {
    // Some deployed nodes still return a single raw view payload.
    return assertBytes(bytes, undefined, "viewResultBody");
  }
  const first = results[0];
  if (!first) throw new Error("empty view results");
  if (first.ok) return first.value;
  throw new Error(formatViewFailure(first.error, 0));
}

function deserializeTxFailurePayload(d: PostcardDeserializer): TxFailurePayload {
  return {
    code: d.deserializeU16(),
    message: d.deserializeStr(),
    data: d.deserializeBytes(),
  };
}

function formatViewFailure(error: TxFailurePayload, index: number): string {
  return `view instruction ${index} failed: ${error.message} (code ${error.code})`;
}

export class ChainHead {
  readonly chainId: bigint;
  readonly blockHeight: bigint;
  readonly blockHash: Uint8Array;
  readonly timestampMsecs: bigint;
  /** State-root hash reported by current nodes; absent on legacy nodes. */
  readonly stateHash: Uint8Array | undefined;

  constructor({
    chainId,
    blockHeight,
    blockHash,
    timestampMsecs,
    stateHash,
  }: {
    chainId: U64Like;
    blockHeight: U64Like;
    blockHash: BytesLike;
    timestampMsecs: U64Like;
    stateHash?: BytesLike;
  }) {
    this.chainId = BigInt(chainId);
    this.blockHeight = BigInt(blockHeight);
    this.blockHash = assertBytes(blockHash, 32, "blockHash");
    this.timestampMsecs = BigInt(timestampMsecs);
    this.stateHash = stateHash === undefined
      ? undefined
      : assertBytes(stateHash, 32, "stateHash");
  }

  static fromPostcard(bytes: BytesLike): ChainHead {
    const d = new PostcardDeserializer(bytes);
    const head = ChainHead.deserialize(d);
    d.assertEnd();
    return head;
  }

  static deserialize(d: PostcardDeserializer): ChainHead {
    const chainId = d.deserializeU64();
    const blockHeight = d.deserializeU64();
    const blockHash = d.deserializeFixedBytes(32);
    const timestampMsecs = d.deserializeU64();

    // `state_hash` was appended to ChainHead after the original four fields.
    // Accept both wire versions while requiring the complete 32-byte hash when
    // the newer field is present.
    const stateHash = d.remaining === 0 ? undefined : d.deserializeFixedBytes(32);
    return new ChainHead({
      chainId,
      blockHeight,
      blockHash,
      timestampMsecs,
      ...(stateHash === undefined ? {} : { stateHash }),
    });
  }

  toJSON(): {
    chain_id: string;
    block_height: string;
    block_hash: string;
    timestamp_msecs: string;
    state_hash?: string;
  } {
    return {
      chain_id: this.chainId.toString(),
      block_height: this.blockHeight.toString(),
      block_hash: bytesToHex(this.blockHash),
      timestamp_msecs: this.timestampMsecs.toString(),
      ...(this.stateHash === undefined ? {} : { state_hash: bytesToHex(this.stateHash) }),
    };
  }
}

export class AccountView {
  readonly address: Address;
  readonly threshold: number;
  readonly pubkeysBs58: string[];

  constructor({
    address,
    threshold,
    pubkeysBs58,
  }: {
    address: Address | BytesLike;
    threshold: number;
    pubkeysBs58: string[];
  }) {
    this.address = Address.from(address);
    this.threshold = threshold;
    this.pubkeysBs58 = [...pubkeysBs58];
  }

  static fromPostcard(bytes: BytesLike): AccountView {
    const d = new PostcardDeserializer(bytes);
    const view = AccountView.deserialize(d);
    d.assertEnd();
    return view;
  }

  static deserialize(d: PostcardDeserializer): AccountView {
    const address = d.deserializeFixedBytes(Address.LENGTH);
    const threshold = d.deserializeU8();
    const pubkeyCount = d.deserializeU32();
    const pubkeysBs58 = [];
    for (let i = 0; i < pubkeyCount; i += 1) {
      pubkeysBs58.push(d.deserializeStr());
    }
    return new AccountView({
      address,
      threshold,
      pubkeysBs58,
    });
  }

  toJSON(): { address: string; threshold: number; pubkeys_bs58: string[] } {
    return {
      address: this.address.toJSON(),
      threshold: this.threshold,
      pubkeys_bs58: [...this.pubkeysBs58],
    };
  }
}

export class EventEntry {
  readonly blockHeight: bigint;
  readonly txHash: Uint8Array;
  readonly txIndex: number;
  readonly eventIndex: number;
  readonly typeTag: bigint;
  readonly data: Uint8Array;

  constructor({
    blockHeight,
    txHash,
    txIndex,
    eventIndex,
    typeTag,
    data,
  }: {
    blockHeight: U64Like;
    txHash: BytesLike;
    txIndex: number;
    eventIndex: number;
    typeTag?: U64Like;
    data: BytesLike;
  }) {
    this.blockHeight = BigInt(blockHeight);
    this.txHash = assertBytes(txHash, 32, "txHash");
    this.txIndex = txIndex;
    this.eventIndex = eventIndex;
    this.data = assertBytes(data, undefined, "eventData");
    this.typeTag = typeTag === undefined ? readTaggedTypeTag(this.data, "eventData") : BigInt(typeTag);
  }

  static deserialize(d: PostcardDeserializer): EventEntry {
    return new EventEntry({
      blockHeight: d.deserializeU64(),
      txHash: d.deserializeFixedBytes(32),
      txIndex: d.deserializeU32(),
      eventIndex: d.deserializeU32(),
      data: d.deserializeBytes(),
    });
  }
}

export class EventsByTxHashRequest {
  readonly txHash: Uint8Array;
  readonly typeTagFilter: bigint | undefined;

  constructor({
    txHash,
    typeTagFilter,
  }: {
    txHash: BytesLike;
    typeTagFilter?: U64Like;
  }) {
    this.txHash = assertBytes(txHash, 32, "txHash");
    this.typeTagFilter = typeTagFilter === undefined ? undefined : BigInt(typeTagFilter);
  }

  toPostcardBytes(): Uint8Array {
    const s = new PostcardSerializer();
    s.serializeFixedBytes(this.txHash);
    s.serializeBool(this.typeTagFilter !== undefined);
    if (this.typeTagFilter !== undefined) {
      s.serializeU64(this.typeTagFilter);
    }
    return s.toUint8Array();
  }
}

export class EventsByTxHashResponse {
  readonly events: EventEntry[];

  constructor(events: readonly EventEntry[]) {
    this.events = [...events];
  }

  static fromPostcard(bytes: BytesLike): EventsByTxHashResponse {
    const d = new PostcardDeserializer(bytes);
    const eventCount = d.deserializeU32();
    const events = [];
    for (let i = 0; i < eventCount; i += 1) {
      events.push(EventEntry.deserialize(d));
    }
    d.assertEnd();
    return new EventsByTxHashResponse(events);
  }
}

export class BlockView {
  readonly number: bigint;
  readonly epoch: bigint;
  readonly hash: Uint8Array;
  readonly prevHash: Uint8Array;
  readonly stateHash: Uint8Array;
  readonly txRoot: Uint8Array;
  readonly txCount: number;
  readonly timestamp: bigint;

  constructor({
    number,
    epoch,
    hash,
    prevHash,
    stateHash,
    txRoot,
    txCount,
    timestamp,
  }: {
    number: U64Like;
    epoch: U64Like;
    hash: BytesLike;
    prevHash: BytesLike;
    stateHash: BytesLike;
    txRoot: BytesLike;
    txCount: number;
    timestamp: U64Like;
  }) {
    this.number = BigInt(number);
    this.epoch = BigInt(epoch);
    this.hash = assertBytes(hash, 32, "blockHash");
    this.prevHash = assertBytes(prevHash, 32, "prevHash");
    this.stateHash = assertBytes(stateHash, 32, "stateHash");
    this.txRoot = assertBytes(txRoot, 32, "txRoot");
    this.txCount = txCount;
    this.timestamp = BigInt(timestamp);
  }

  static fromPostcard(bytes: BytesLike): BlockView {
    const d = new PostcardDeserializer(bytes);
    const block = BlockView.deserialize(d);
    d.assertEnd();
    return block;
  }

  static deserialize(d: PostcardDeserializer): BlockView {
    const number = d.deserializeU64();
    const epoch = d.deserializeU64();
    const hash = d.deserializeFixedBytes(32);
    const prevHash = d.deserializeFixedBytes(32);
    const stateHash = d.deserializeFixedBytes(32);
    const txRoot = d.deserializeFixedBytes(32);
    const txCount = d.deserializeU32();
    const timestamp = d.deserializeU64();

    return new BlockView({
      number,
      epoch,
      hash,
      prevHash,
      stateHash,
      txRoot,
      txCount,
      timestamp,
    });
  }

  toJSON(): {
    number: string;
    epoch: string;
    hash: string;
    prev_hash: string;
    state_hash: string;
    tx_root: string;
    tx_count: number;
    timestamp: string;
  } {
    return {
      number: this.number.toString(),
      epoch: this.epoch.toString(),
      hash: bytesToHex(this.hash),
      prev_hash: bytesToHex(this.prevHash),
      state_hash: bytesToHex(this.stateHash),
      tx_root: bytesToHex(this.txRoot),
      tx_count: this.txCount,
      timestamp: this.timestamp.toString(),
    };
  }
}

export class TxHistoryInclusionProof {
  readonly block: BlockView;
  readonly index: number;
  readonly siblings: Uint8Array[];
  readonly history: Uint8Array;

  constructor({ block, index, siblings, history }: {
    block: BlockView;
    index: number;
    siblings: BytesLike[];
    history: BytesLike;
  }) {
    this.block = block;
    this.index = index;
    this.siblings = siblings.map((value) =>
      assertBytes(value, 32, "proof sibling"),
    );
    this.history = assertBytes(history, undefined, "proof history");
  }

  static fromPostcard(bytes: BytesLike): TxHistoryInclusionProof {
    const d = new PostcardDeserializer(bytes);
    const block = BlockView.deserialize(d);
    const index = d.deserializeU32();
    const siblingCount = d.deserializeU32();
    const siblings: Uint8Array[] = [];
    for (let i = 0; i < siblingCount; i += 1) {
      siblings.push(d.deserializeFixedBytes(32));
    }
    const history = d.deserializeBytes();
    d.assertEnd();
    return new TxHistoryInclusionProof({ block, index, siblings, history });
  }
}

export interface AnySerializeDecodeOptions {
  decodeAnySerialize?: (typeTag: bigint, deserializer: PostcardDeserializer) => unknown;
  decodeEvent?: (typeTag: bigint, deserializer: PostcardDeserializer) => unknown;
  decodeFramedAnySerialize?: (typeTag: bigint, body: Uint8Array) => unknown;
  decodeFramedEvent?: (typeTag: bigint, body: Uint8Array) => unknown;
}

export interface AccessValueDecodeOptions<TDecoded = unknown> {
  decodeAccessValue?: (typeTag: bigint, bytes: Uint8Array) => TDecoded;
}

export interface AccessValueData<TDecoded = unknown> {
  typeTag: bigint;
  bytes: Uint8Array;
  decoded?: TDecoded;
  error?: string;
}

export interface AccessValueEntry<TDecoded = unknown> {
  hash: Uint8Array;
  value?: AccessValueData<TDecoded>;
}

export function decodeTaggedValueBytes(bytes: BytesLike): AccessValueData {
  const d = new PostcardDeserializer(bytes);
  const typeTag = d.deserializeU64();
  return {
    typeTag,
    bytes: d.deserializeRemainingBytes(),
  };
}

export function decodeAccessValues<TDecoded = unknown>(
  bytes: BytesLike,
  options: AccessValueDecodeOptions<TDecoded> = {},
): AccessValueEntry<TDecoded>[] {
  const d = new PostcardDeserializer(bytes);
  const count = d.deserializeU32();
  const entries: AccessValueEntry<TDecoded>[] = [];
  for (let index = 0; index < count; index += 1) {
    const hash = d.deserializeFixedBytes(32);
    if (!d.deserializeBool()) {
      entries.push({ hash });
      continue;
    }

    const rawValueBytes = d.deserializeBytes();
    const { typeTag, bytes: valueBytes } = decodeTaggedValueBytes(rawValueBytes);
    const value: AccessValueData<TDecoded> = {
      typeTag,
      bytes: valueBytes,
    };
    if (options.decodeAccessValue) {
      try {
        value.decoded = options.decodeAccessValue(typeTag, valueBytes);
      } catch (error) {
        value.error = error instanceof Error ? error.message : String(error);
      }
    }
    entries.push({ hash, value });
  }
  d.assertEnd();
  return entries;
}

function readTaggedTypeTag(bytes: BytesLike, name: string): bigint {
  try {
    const d = new PostcardDeserializer(bytes);
    return d.deserializeU64();
  } catch (error) {
    throw new Error(`cannot decode ${name} typeTag: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export type PersistedValue =
  | { kind: "external"; blobHash: Uint8Array }
  | { kind: "inline"; typeTag: bigint; value: unknown };

export class SimulateAccessRecord {
  readonly resourceId: Uint8Array;
  readonly firstSnapshot: PersistedValue | undefined;
  readonly lastWritten: PersistedValue;

  constructor({
    resourceId,
    firstSnapshot,
    lastWritten,
  }: {
    resourceId: BytesLike;
    firstSnapshot: PersistedValue | undefined;
    lastWritten: PersistedValue;
  }) {
    this.resourceId = assertBytes(resourceId, 18, "resourceId");
    this.firstSnapshot = firstSnapshot === undefined
      ? undefined
      : clonePersistedValue(firstSnapshot);
    this.lastWritten = clonePersistedValue(lastWritten);
  }

  static deserialize(
    d: PostcardDeserializer,
    options: AnySerializeDecodeOptions = {},
  ): SimulateAccessRecord {
    return new SimulateAccessRecord({
      resourceId: d.deserializeFixedBytes(18),
      firstSnapshot: d.deserializeBool()
        ? deserializePersistedValue(d, options)
        : undefined,
      lastWritten: deserializePersistedValue(d, options),
    });
  }
}

export class SimulateReceipt {
  readonly txId: Uint8Array;
  readonly txHash: Uint8Array;
  readonly state: number;
  readonly access: SimulateAccessRecord[];
  readonly events: unknown[];
  readonly error: TxFailurePayload | undefined;
  readonly gasCharged: bigint;
  /** Per-transaction signer requirements observed during simulation (MSDK v2). */
  readonly signers: SimulateSignerRequirement[];

  constructor({
    txId,
    txHash,
    state,
    access,
    events,
    error,
    gasCharged = 0n,
    signers = [],
  }: {
    txId: BytesLike;
    txHash: BytesLike;
    state: number;
    access: readonly SimulateAccessRecord[];
    events: readonly unknown[];
    error?: TxFailurePayload;
    gasCharged?: U64Like;
    signers?: readonly SimulateSignerRequirement[];
  }) {
    this.txId = assertBytes(txId, 12, "txId");
    this.txHash = assertBytes(txHash, 32, "txHash");
    this.state = state;
    this.access = [...access];
    this.events = [...events];
    this.gasCharged = BigInt(gasCharged);
    this.signers = signers.map(({ address, requiresPqSignature }) => ({
      address: Address.from(address),
      requiresPqSignature,
    }));
    this.error = error === undefined
      ? undefined
      : {
        code: error.code,
        message: error.message,
        data: assertBytes(error.data, undefined, "failureData"),
      };
  }

  static fromPostcard(
    bytes: BytesLike,
    options: AnySerializeDecodeOptions = {},
  ): SimulateReceipt {
    const raw = assertBytes(bytes, undefined, "SimulateReceipt");
    const d = new PostcardDeserializer(raw);
    const receipt = hasFramedDynamicWireMagic(raw)
      ? SimulateReceipt.deserializeFramed(d, options)
      : SimulateReceipt.deserialize(d, options);
    d.assertEnd();
    return receipt;
  }

  private static deserializeFramed(
    d: PostcardDeserializer,
    options: AnySerializeDecodeOptions,
  ): SimulateReceipt {
    const magic = d.deserializeFixedBytes(FRAMED_DYNAMIC_WIRE_MAGIC.length);
    if (!magic.every((byte, index) => byte === FRAMED_DYNAMIC_WIRE_MAGIC[index])) {
      throw new Error("invalid framed simulate receipt magic");
    }
    const version = d.deserializeU8();
    if (version !== 1 && version !== FRAMED_DYNAMIC_WIRE_VERSION) {
      throw new Error(`unsupported framed simulate receipt version: ${version}`);
    }

    const txId = d.deserializeFixedBytes(12);
    const txHash = d.deserializeFixedBytes(32);
    const state = d.deserializeU8();
    const accessCount = d.deserializeU32();
    const access: SimulateAccessRecord[] = [];
    for (let index = 0; index < accessCount; index += 1) {
      access.push(deserializeFramedAccessRecord(d, options));
    }
    const eventCount = d.deserializeU32();
    const events: unknown[] = [];
    for (let index = 0; index < eventCount; index += 1) {
      events.push(deserializeFramedEvent(d, options));
    }
    const error = d.deserializeBool() ? deserializeTxFailurePayload(d) : undefined;
    const gasCharged = d.deserializeU64();
    const signers = version === 2
      ? Array.from({ length: d.deserializeU32() }, () => ({
        address: new Address(d.deserializeFixedBytes(Address.LENGTH)),
        requiresPqSignature: d.deserializeBool(),
      }))
      : [];

    return new SimulateReceipt({
      txId,
      txHash,
      state,
      access,
      events,
      gasCharged,
      signers,
      ...(error !== undefined ? { error } : {}),
    });
  }

  static deserialize(
    d: PostcardDeserializer,
    options: AnySerializeDecodeOptions = {},
  ): SimulateReceipt {
    const txId = d.deserializeFixedBytes(12);
    const txHash = d.deserializeFixedBytes(32);
    const state = d.deserializeU8();
    const accessCount = d.deserializeU32();
    const access: SimulateAccessRecord[] = [];
    for (let i = 0; i < accessCount; i += 1) {
      access.push(SimulateAccessRecord.deserialize(d, options));
    }
    const eventCount = d.deserializeU32();
    const events: unknown[] = [];
    for (let i = 0; i < eventCount; i += 1) {
      events.push(deserializeEvent(d, options));
    }
    const error = d.deserializeBool() ? deserializeTxFailurePayload(d) : undefined;
    // gas_charged was appended to TxReceipt in Rust. Keep decoding receipts
    // produced by older nodes, where the trailing field is absent.
    const gasCharged = d.remaining > 0 ? d.deserializeU64() : 0n;

    return new SimulateReceipt({
      txId,
      txHash,
      state,
      access,
      events,
      gasCharged,
      ...(error !== undefined ? { error } : {}),
    });
  }
}

const FRAMED_DYNAMIC_WIRE_MAGIC = Uint8Array.from([0x4d, 0x53, 0x44, 0x4b]);
const FRAMED_DYNAMIC_WIRE_VERSION = 2;

export interface SimulateSignerRequirement {
  address: Address | BytesLike;
  requiresPqSignature: boolean;
}

function hasFramedDynamicWireMagic(bytes: Uint8Array): boolean {
  return bytes.length >= FRAMED_DYNAMIC_WIRE_MAGIC.length + 1
    && FRAMED_DYNAMIC_WIRE_MAGIC.every((byte, index) => bytes[index] === byte);
}

function deserializeFramedAccessRecord(
  d: PostcardDeserializer,
  options: AnySerializeDecodeOptions,
): SimulateAccessRecord {
  return new SimulateAccessRecord({
    resourceId: d.deserializeFixedBytes(18),
    firstSnapshot: d.deserializeBool()
      ? deserializeFramedPersistedValue(d, options)
      : undefined,
    lastWritten: deserializeFramedPersistedValue(d, options),
  });
}

function deserializeFramedPersistedValue(
  d: PostcardDeserializer,
  options: AnySerializeDecodeOptions,
): PersistedValue {
  const variant = d.deserializeEnumVariant();
  if (variant === 0) return deserializeFramedDynamicValue(d, options);
  if (variant === 1) {
    return { kind: "external", blobHash: d.deserializeFixedBytes(32) };
  }
  throw new Error(`invalid framed persisted value variant: ${variant}`);
}

function deserializeFramedDynamicValue(
  d: PostcardDeserializer,
  options: AnySerializeDecodeOptions,
): Extract<PersistedValue, { kind: "inline" }> {
  const typeTag = d.deserializeU64();
  const body = d.deserializeBytes();
  const decodeFramed = options.decodeFramedAnySerialize;
  const decodeLegacy = options.decodeAnySerialize;
  if (!decodeFramed && !decodeLegacy) {
    throw new Error(
      `cannot decode framed AnySerialize value with type tag ${typeTag} without an app IDL decoder`,
    );
  }
  const value = decodeFramed
    ? decodeFramed(typeTag, body)
    : decodeFramedWithLegacyCallback(typeTag, body, decodeLegacy!);
  return { kind: "inline", typeTag, value };
}

function deserializeFramedEvent(
  d: PostcardDeserializer,
  options: AnySerializeDecodeOptions,
): unknown {
  const typeTag = d.deserializeU64();
  const body = d.deserializeBytes();
  const decodeFramed = options.decodeFramedEvent
    ?? options.decodeFramedAnySerialize;
  const decodeLegacy = options.decodeEvent
    ?? options.decodeAnySerialize;
  if (!decodeFramed && !decodeLegacy) {
    throw new Error(
      `cannot decode framed event with type tag ${typeTag} without an app IDL decoder`,
    );
  }
  return decodeFramed
    ? decodeFramed(typeTag, body)
    : decodeFramedWithLegacyCallback(typeTag, body, decodeLegacy!);
}

function decodeFramedWithLegacyCallback(
  typeTag: bigint,
  body: Uint8Array,
  decode: (typeTag: bigint, deserializer: PostcardDeserializer) => unknown,
): unknown {
  const bodyDeserializer = new PostcardDeserializer(body);
  const value = decode(typeTag, bodyDeserializer);
  bodyDeserializer.assertEnd();
  return value;
}

function deserializePersistedValue(
  d: PostcardDeserializer,
  options: AnySerializeDecodeOptions,
): PersistedValue {
  const variant = d.deserializeEnumVariant();
  if (variant === 1) {
    return { kind: "external", blobHash: d.deserializeFixedBytes(32) };
  }
  if (variant === 0) {
    return deserializeAnySerializeOwned(d, options);
  }
  throw new Error(`invalid persisted value variant: ${variant}`);
}

function deserializeAnySerializeOwned(
  d: PostcardDeserializer,
  options: AnySerializeDecodeOptions,
): Extract<PersistedValue, { kind: "inline" }> {
  const typeTag = d.deserializeU64();
  if (!options.decodeAnySerialize) {
    throw new Error(
      `cannot decode AnySerialize value with type tag ${typeTag} without an app IDL decoder`,
    );
  }
  return {
    kind: "inline",
    typeTag,
    value: options.decodeAnySerialize(typeTag, d),
  };
}

function deserializeEvent(
  d: PostcardDeserializer,
  options: AnySerializeDecodeOptions,
): unknown {
  const typeTag = d.deserializeU64();
  if (options.decodeEvent) {
    return options.decodeEvent(typeTag, d);
  }
  if (options.decodeAnySerialize) {
    return {
      kind: "inline",
      typeTag,
      value: options.decodeAnySerialize(typeTag, d),
    };
  }
  throw new Error(
    `cannot decode event value with type tag ${typeTag} without an app IDL decoder`,
  );
}

function clonePersistedValue(value: PersistedValue): PersistedValue {
  if (value.kind === "external") {
    return { kind: "external", blobHash: assertBytes(value.blobHash, 32, "blobHash") };
  }
  return { kind: "inline", typeTag: value.typeTag, value: value.value };
}

export class InvokeResponse {
  readonly requestId: bigint;
  readonly status: ResponseStatus;
  readonly body: Uint8Array;
  readonly error: ApiFailure | undefined;

  constructor({
    requestId,
    status,
    body,
    error,
  }: {
    requestId: U64Like;
    status: ResponseStatus;
    body: BytesLike;
    error?: ApiFailure;
  }) {
    this.requestId = BigInt(requestId);
    this.status = status;
    this.body = assertBytes(body, undefined, "responseBody");
    this.error = error === undefined
      ? undefined
      : {
        message: error.message,
        ...(error.code !== undefined ? { code: error.code } : {}),
        ...(error.data !== undefined ? { data: assertBytes(error.data) } : {}),
      };
  }

  static fromPostcard(bytes: BytesLike): InvokeResponse {
    const d = new PostcardDeserializer(bytes);
    const requestId = d.deserializeU64();
    const status = deserializeStatus(d);
    const body = d.deserializeBytes();
    const error = deserializeApiFailureOption(d);
    const response = new InvokeResponse({
      requestId,
      status,
      body,
      ...(error !== undefined ? { error } : {}),
    });
    d.assertEnd();
    return response;
  }
}

export class InvokeTransportError extends Error {
  readonly status: ResponseStatus | undefined;
  readonly failure: ApiFailure | undefined;
  readonly httpStatus: number | undefined;

  constructor(
    message: string,
    options: {
      status?: ResponseStatus;
      failure?: ApiFailure;
      httpStatus?: number;
      cause?: unknown;
    } = {},
  ) {
    super(message);
    this.name = "InvokeTransportError";
    this.status = options.status;
    this.failure = options.failure;
    this.httpStatus = options.httpStatus;
    if (options.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }

  isUnavailable(): boolean {
    return this.status === ResponseStatus.Unavailable;
  }
}

export function encodeInvokeRequest(
  method: InvokeMethod,
  body: BytesLike = new Uint8Array(),
  options: InvokeRequestOptions = {},
): Uint8Array {
  const s = new PostcardSerializer();
  s.serializeU16(method);
  s.serializeU64(options.requestId ?? 1n);
  s.serializeBytes(body);
  return s.toUint8Array();
}

export function encodeTcpFrame(payload: BytesLike, format = TCP_POSTCARD_FORMAT): Uint8Array {
  const bytes = assertBytes(payload, undefined, "payload");
  const length = 1 + bytes.length;
  if (length > MAX_FRAME_BYTES) {
    throw new RangeError("frame too large");
  }
  const frame = new Uint8Array(4 + length);
  new DataView(frame.buffer).setUint32(0, length, false);
  frame[4] = format;
  frame.set(bytes, 5);
  return frame;
}

export function decodeTcpFrame(frame: BytesLike): { format: number; payload: Uint8Array } {
  const bytes = assertBytes(frame, undefined, "frame");
  if (bytes.length < 5) {
    throw new Error("invalid frame length");
  }
  const length = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(0, false);
  if (length < 1 || bytes.length < 4 + length) {
    throw new Error("invalid frame length");
  }
  return {
    format: bytes[4]!,
    payload: bytes.slice(5, 4 + length),
  };
}

export function decodeInvokeResponseFrame(frame: BytesLike): InvokeResponse {
  const { format, payload } = decodeTcpFrame(frame);
  if (format !== TCP_POSTCARD_FORMAT) {
    throw new Error(`unsupported wire format: ${format}`);
  }
  return InvokeResponse.fromPostcard(payload);
}

export function assertInvokeOk(response: InvokeResponse): InvokeResponse {
  if (response.status !== ResponseStatus.Ok) {
    throw new InvokeTransportError(
      response.error?.message ?? `invoke failed with status ${response.status}`,
      {
        status: response.status,
        ...(response.error !== undefined ? { failure: response.error } : {}),
      },
    );
  }
  return response;
}

function deserializeStatus(d: PostcardDeserializer): ResponseStatus {
  const value = d.deserializeU8();
  if (!(value in ResponseStatus)) {
    throw new Error(`unknown status ${value}`);
  }
  return value as ResponseStatus;
}

function deserializeApiFailureOption(d: PostcardDeserializer): ApiFailure | undefined {
  if (!d.deserializeBool()) return undefined;
  return deserializeApiFailure(d);
}

function deserializeApiFailure(d: PostcardDeserializer): ApiFailure {
  const message = d.deserializeStr();
  const hasCode = d.deserializeBool();
  const code = hasCode ? d.deserializeU16() : undefined;
  const hasData = d.deserializeBool();
  const data = hasData ? d.deserializeBytes() : undefined;
  return {
    message,
    ...(code !== undefined ? { code } : {}),
    ...(data !== undefined ? { data } : {}),
  };
}
