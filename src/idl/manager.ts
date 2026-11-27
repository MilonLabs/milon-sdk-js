import { bytesToBs58, bytesToHex, toBytes, type BytesLike } from "../crypto/bytes";
import { Address } from "../crypto/address";
import { PostcardDeserializer } from "../postcard/index";
import {
  type DecodedIdlInstruction,
  IdlProvider,
  type IdlArgValue,
  type IdlEvent,
  type IdlInstruction,
  type MilonIdl,
} from "./index";
import { DEFAULT_IDLS } from "./default-idls";
import { assertTypeTag, prefixTypeTag, typeTagForType, typeTagsEqual } from "./type-tag";

export interface RegisteredIdl {
  appId: number;
  name: string;
  idl: MilonIdl;
  provider: IdlProvider;
}

export interface DecodeViewRequest {
  bytes: BytesLike;
  method: string;
  appId?: number;
  appName?: string;
}

export interface DetectViewOptions {
  appId?: number;
  appName?: string;
  method?: string;
  typeTag?: bigint;
}

export interface DetectedViewCandidate {
  appId: number;
  appName: string;
  method: string;
  returnType: string;
  typeTag: bigint;
  value: IdlArgValue;
}

export interface DecodedHistoryInstruction {
  index: number;
  raw: Uint8Array;
  appId?: number;
  decoded?: DecodedIdlInstruction;
  error?: string;
}

export interface DecodedHistoryEvent {
  eventIndex: number;
  typeTag: bigint;
  data: Uint8Array;
  dataHex: string;
  decoded?: DecodedEventData;
  error?: string;
}

export interface DecodeEventDataOptions {
  appId?: number;
  appName?: string;
  typeTag?: bigint;
}

export interface DecodeAnySerializeOptions {
  appId?: number;
  appName?: string;
  typeTag?: bigint;
}

export interface DecodedEventData {
  appId: number;
  appName: string;
  eventName: string;
  typeTag: bigint;
  value: Record<string, IdlArgValue>;
}

export interface DecodedHistoryAccessChange {
  resourceId: Uint8Array;
  resourceIdParsed: DecodedResourceId;
  firstSnapshotValue: Uint8Array | undefined;
  lastWrittenValue: Uint8Array;
  firstSnapshot: DecodedPersistedValue | undefined;
  lastWritten: DecodedPersistedValue;
}

export interface DecodedTxId {
  bytes: Uint8Array;
  hex: string;
  bs58: string;
  blockHeight: bigint;
  indexInBlock: number;
}

export interface DecodedHashBytes {
  bytes: Uint8Array;
  hex: string;
  bs58: string;
}

export interface DecodedResourceId {
  bytes: Uint8Array;
  hex: string;
  bs58: string;
  appId: number;
  appName?: string;
  resourceId: number;
  digest: Uint8Array;
  digestHex: string;
}

export type DecodedPersistedValue =
  | {
    kind: "inline";
    raw: Uint8Array;
    rawHex: string;
    typeTag: bigint;
    decoded?: DecodedAnySerializeValue;
    error?: string;
  }
  | {
    kind: "external";
    raw: Uint8Array;
    rawHex: string;
    blobHash: Uint8Array;
    blobHashHex: string;
    blobHashBs58: string;
  }
  | {
    kind: "unknown";
    raw: Uint8Array;
    rawHex: string;
    error: string;
  };

export type DecodedAccessValue = DecodedPersistedValue;

export interface DecodedAnySerializeValue {
  appId: number;
  appName: string;
  type: string;
  typeTag: bigint;
  value: IdlArgValue;
}

export interface DecodedTransactionHistory {
  stamp: bigint;
  instructions: DecodedHistoryInstruction[];
  receipt: {
    txId: Uint8Array;
    txIdParsed: DecodedTxId;
    txHash: Uint8Array;
    txHashParsed: DecodedHashBytes;
    state: number;
    accessResourceChanges: DecodedHistoryAccessChange[];
    events: DecodedHistoryEvent[];
    error?: number;
    gasCharged: bigint;
  };
}

/** Registry of application IDLs used to route and decode wire values. */
export class IdlRegistry {
  private readonly byAppId = new Map<number, RegisteredIdl>();
  private readonly byName = new Map<string, RegisteredIdl>();

  constructor(idls: readonly MilonIdl[] = DEFAULT_IDLS as unknown as readonly MilonIdl[]) {
    for (const idl of idls) this.register(idl);
  }

  register(idl: MilonIdl): RegisteredIdl {
    const appId = idl.app_id ?? idl.metadata?.app_id;
    if (appId === undefined) throw new Error("IDL app_id is required");
    const name = idl.name || idl.metadata?.name;
    if (!name) throw new Error(`IDL name is required for app_id ${appId}`);
    if (this.byAppId.has(appId)) throw new Error(`IDL app_id already registered: ${appId}`);
    if (this.byName.has(name)) throw new Error(`IDL name already registered: ${name}`);

    const registered = {
      appId,
      name,
      idl,
      provider: new IdlProvider(idl),
    };
    this.byAppId.set(appId, registered);
    this.byName.set(name, registered);
    return registered;
  }

  get(app: number | string): RegisteredIdl {
    const registered = typeof app === "number"
      ? this.byAppId.get(app)
      : this.byName.get(app);
    if (!registered) throw new Error(`IDL app not registered: ${app}`);
    return registered;
  }

  list(): RegisteredIdl[] {
    return Array.from(this.byAppId.values());
  }

  decodeView(request: DecodeViewRequest): DetectedViewCandidate {
    const registered = this.resolveApp(request);
    const instruction = this.viewInstruction(registered, request.method);
    const returnType = instruction.returns!.type;
    return {
      appId: registered.appId,
      appName: registered.name,
      method: instruction.name,
      returnType,
      typeTag: typeTagForType(returnType),
      value: registered.provider.decodeViewValue(instruction.name, request.bytes),
    };
  }

  decodeType(app: number | string, type: string, bytes: BytesLike): IdlArgValue {
    return this.get(app).provider.decodeValue(type, bytes);
  }

  decodeAnySerialize(bytes: BytesLike, options: DecodeAnySerializeOptions = {}): DecodedAnySerializeValue {
    const candidates = options.appId !== undefined || options.appName !== undefined
      ? [this.resolveApp(options)]
      : this.list();
    const errors: string[] = [];

    for (const registered of candidates) {
      try {
        const deserializer = new PostcardDeserializer(bytes);
        const typeTag = deserializer.deserializeU64();
        assertTypeTag(typeTag, options.typeTag);
        const decoded = registered.provider.deserializeAnySerializeValue(typeTag, deserializer);
        deserializer.assertEnd();
        return {
          appId: registered.appId,
          appName: registered.name,
          type: decoded.type,
          typeTag,
          value: decoded.value,
        };
      } catch (error) {
        errors.push(`${registered.name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    throw new Error(`IDL AnySerialize value not decoded: ${errors.join("; ")}`);
  }

  decodeAnySerializeFromDeserializer(
    typeTag: bigint,
    deserializer: PostcardDeserializer,
    options: Omit<DecodeAnySerializeOptions, "typeTag"> = {},
  ): DecodedAnySerializeValue {
    const candidates = options.appId !== undefined || options.appName !== undefined
      ? [this.resolveApp(options)]
      : this.list();
    const errors: string[] = [];

    for (const registered of candidates) {
      try {
        const decoded = registered.provider.deserializeAnySerializeValue(typeTag, deserializer);
        return {
          appId: registered.appId,
          appName: registered.name,
          type: decoded.type,
          typeTag,
          value: decoded.value,
        };
      } catch (error) {
        errors.push(`${registered.name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    throw new Error(`IDL AnySerialize value not decoded: ${errors.join("; ")}`);
  }

  decodeResourceFromDeserializer(
    typeTag: bigint,
    deserializer: PostcardDeserializer,
    options: Omit<DecodeAnySerializeOptions, "typeTag"> = {},
  ): DecodedAnySerializeValue {
    return this.decodeAnySerializeFromDeserializer(typeTag, deserializer, options);
  }

  decodeAccessValue(
    typeTag: bigint,
    bytes: BytesLike,
    options: Omit<DecodeAnySerializeOptions, "typeTag"> = {},
  ): DecodedAnySerializeValue {
    try {
      return this.decodeAnySerialize(bytes, { ...options, typeTag });
    } catch {
      return this.decodeAnySerialize(prefixTypeTag(typeTag, toBytes(bytes)), { ...options, typeTag });
    }
  }

  decodeEventData(bytes: BytesLike, options: DecodeEventDataOptions = {}): DecodedEventData {
    const deserializer = new PostcardDeserializer(bytes);
    const typeTag = deserializer.deserializeU64();
    assertTypeTag(typeTag, options.typeTag, "event typeTag");

    const candidates = options.appId !== undefined || options.appName !== undefined
      ? [this.resolveApp(options)]
      : this.list();
    for (const registered of candidates) {
      const event = findEventByTypeTag(registered.idl.events ?? [], typeTag);
      if (!event) continue;
      const value = registered.provider.deserializeFields(deserializer, event.fields);
      deserializer.assertEnd();
      return {
        appId: registered.appId,
        appName: registered.name,
        eventName: event.name,
        typeTag,
        value,
      };
    }

    throw new Error(`IDL event typeTag not registered: ${typeTag}`);
  }

  decodeEventFromDeserializer(
    typeTag: bigint,
    deserializer: PostcardDeserializer,
    options: Omit<DecodeEventDataOptions, "typeTag"> = {},
  ): DecodedEventData {
    const candidates = options.appId !== undefined || options.appName !== undefined
      ? [this.resolveApp(options)]
      : this.list();

    for (const registered of candidates) {
      const event = findEventByTypeTag(registered.idl.events ?? [], typeTag);
      if (!event) continue;
      return {
        appId: registered.appId,
        appName: registered.name,
        eventName: event.name,
        typeTag,
        value: registered.provider.deserializeFields(deserializer, event.fields),
      };
    }

    throw new Error(`IDL event typeTag not registered: ${typeTag}`);
  }

  decodeTransactionHistory(bytes: BytesLike): DecodedTransactionHistory {
    const raw = toBytes(bytes);
    if (raw[0] !== 0) {
      throw new Error(`unsupported transaction history wire format: ${raw[0] ?? "empty"}`);
    }
    const body = raw.slice(1);
    try {
      return this.decodeFullTransactionHistory(body);
    } catch (historyError) {
      try {
        return this.decodeTransactionHistoryView(body);
      } catch (viewError) {
        throw new Error(
          `transaction history did not match the current or legacy TxHistory wire; `
          + `history: ${errorMessage(historyError)}; view: ${errorMessage(viewError)}`,
        );
      }
    }
  }

  private decodeTransactionHistoryView(bytes: Uint8Array): DecodedTransactionHistory {
    const deserializer = new PostcardDeserializer(bytes);
    const stamp = deserializer.deserializeU64();
    const instructionCount = deserializer.deserializeU32();
    const instructions: DecodedHistoryInstruction[] = [];
    for (let index = 0; index < instructionCount; index += 1) {
      instructions.push(this.decodeHistoryInstruction(index, deserializer.deserializeBytes()));
    }

    const txId = deserializer.deserializeFixedBytes(12);
    const txHash = deserializer.deserializeFixedBytes(32);
    const state = deserializer.deserializeU8();
    const accessResourceChanges = Array.from({ length: deserializer.deserializeU32() }, () => {
      const resourceId = deserializer.deserializeFixedBytes(18);
      const accessChange = this.decodeAccessChange(deserializer);
      return {
        resourceId,
        resourceIdParsed: this.decodeResourceId(resourceId),
        firstSnapshotValue: accessChange.before,
        lastWrittenValue: accessChange.after,
        firstSnapshot: accessChange.beforeDecoded,
        lastWritten: accessChange.afterDecoded,
      };
    });
    const events = Array.from(
      { length: deserializer.deserializeU32() },
      (): DecodedHistoryEvent => {
        const eventIndex = deserializer.deserializeU32();
        const data = deserializer.deserializeBytes();
        const typeTagDeserializer = new PostcardDeserializer(data);
        const typeTag = typeTagDeserializer.deserializeU64();
        return this.decodeHistoryEvent(eventIndex, typeTag, data);
      },
    );
    const error = deserializer.deserializeBool() ? deserializer.deserializeU16() : undefined;
    deserializer.assertEnd();

    return {
      stamp,
      instructions,
      receipt: {
        txId,
        txIdParsed: decodeTxId(txId),
        txHash,
        txHashParsed: decodeHashBytes(txHash),
        state,
        accessResourceChanges,
        events,
        ...(error !== undefined ? { error } : {}),
        gasCharged: 0n,
      },
    };
  }

  private decodeFullTransactionHistory(bytes: Uint8Array): DecodedTransactionHistory {
    const deserializer = new PostcardDeserializer(bytes);
    const stamp = deserializer.deserializeU64();

    if (deserializer.deserializeBool()) deserializer.deserializeU8();
    const signatureCount = deserializer.deserializeU32();
    for (let index = 0; index < signatureCount; index += 1) {
      deserializer.deserializeFixedBytes(Address.LENGTH);
      deserializer.deserializeU64();
      deserializer.deserializeU64();
    }

    const instructionCount = deserializer.deserializeU32();
    const instructions: DecodedHistoryInstruction[] = [];
    for (let index = 0; index < instructionCount; index += 1) {
      instructions.push(this.decodeHistoryInstruction(index, deserializer.deserializeBytes()));
    }

    const txId = deserializer.deserializeFixedBytes(12);
    const txHash = deserializer.deserializeFixedBytes(32);
    const state = deserializer.deserializeU8();
    const accessResourceChanges = Array.from({ length: deserializer.deserializeU32() }, () => {
      const resourceId = deserializer.deserializeFixedBytes(18);
      const firstSnapshot = deserializer.deserializeBool()
        ? this.decodeLegacyPersistedValue(deserializer)
        : undefined;
      const lastWritten = this.decodeLegacyPersistedValue(deserializer);
      return {
        resourceId,
        resourceIdParsed: this.decodeResourceId(resourceId),
        firstSnapshotValue: firstSnapshot?.raw,
        lastWrittenValue: lastWritten.raw,
        firstSnapshot,
        lastWritten,
      };
    });

    const events = Array.from(
      { length: deserializer.deserializeU32() },
      (_, eventIndex): DecodedHistoryEvent => this.decodeLegacyHistoryEvent(eventIndex, deserializer),
    );
    const error = deserializer.deserializeBool() ? deserializer.deserializeU16() : undefined;
    const gasCharged = deserializer.deserializeU64();
    deserializer.assertEnd();

    return {
      stamp,
      instructions,
      receipt: {
        txId,
        txIdParsed: decodeTxId(txId),
        txHash,
        txHashParsed: decodeHashBytes(txHash),
        state,
        accessResourceChanges,
        events,
        ...(error !== undefined ? { error } : {}),
        gasCharged,
      },
    };
  }

  private decodeLegacyPersistedValue(deserializer: PostcardDeserializer): DecodedPersistedValue {
    const variant = deserializer.deserializeEnumVariant();
    if (variant === 0) {
      const start = deserializer.position;
      const typeTag = deserializer.deserializeU64();
      const raw = deserializer.slice(start);
      try {
        const decoded = this.decodeResourceFromDeserializer(typeTag, deserializer);
        return {
          kind: "inline",
          raw,
          rawHex: bytesToHex(raw),
          typeTag,
          decoded,
        };
      } catch (error) {
        return {
          kind: "inline",
          raw,
          rawHex: bytesToHex(raw),
          typeTag,
          error: errorMessage(error),
        };
      }
    }
    if (variant === 1) {
      return decodeExternalAccessValue(deserializer.deserializeFixedBytes(32));
    }
    throw new Error(`invalid PersistedValue variant: ${variant}`);
  }

  private decodeLegacyHistoryEvent(
    eventIndex: number,
    deserializer: PostcardDeserializer,
  ): DecodedHistoryEvent {
    const start = deserializer.position;
    const typeTag = deserializer.deserializeU64();
    try {
      const decoded = this.decodeEventFromDeserializer(typeTag, deserializer);
      const data = deserializer.slice(start);
      return {
        eventIndex,
        typeTag,
        data,
        dataHex: bytesToHex(data),
        decoded,
      };
    } catch (error) {
      throw new Error(`legacy event ${eventIndex} could not be decoded: ${errorMessage(error)}`);
    }
  }

  detectView(bytes: BytesLike, options: DetectViewOptions = {}): DetectedViewCandidate[] {
    const registeredIdls = options.appId !== undefined || options.appName !== undefined
      ? [this.resolveApp(options)]
      : this.list();
    const candidates: DetectedViewCandidate[] = [];

    for (const registered of registeredIdls) {
      for (const instruction of registered.idl.instructions) {
        if (instruction.kind !== "view" || !instruction.returns?.type) continue;
        if (options.method !== undefined && instruction.name !== options.method) continue;
        const returnType = instruction.returns.type;
        const typeTag = typeTagForType(returnType);
        if (options.typeTag !== undefined && !typeTagsEqual(typeTag, options.typeTag)) continue;
        try {
          candidates.push({
            appId: registered.appId,
            appName: registered.name,
            method: instruction.name,
            returnType,
            typeTag,
            value: registered.provider.decodeViewValue(instruction.name, bytes),
          });
        } catch {
          // A candidate is valid only when its IDL type consumes the complete payload.
        }
      }
    }
    return candidates;
  }

  detectUniqueView(bytes: BytesLike, options: DetectViewOptions = {}): DetectedViewCandidate {
    const candidates = this.detectView(bytes, options);
    if (candidates.length === 0) throw new Error("no IDL view return type matched the postcard payload");
    if (candidates.length > 1) {
      const labels = candidates.map(
        (candidate) => `${candidate.appName}.${candidate.method}:${candidate.returnType}`,
      );
      throw new Error(`postcard payload is ambiguous: ${labels.join(", ")}`);
    }
    return candidates[0]!;
  }

  private resolveApp(input: { appId?: number; appName?: string }): RegisteredIdl {
    if (input.appId === undefined && input.appName === undefined) {
      throw new Error("appId or appName is required");
    }
    const byId = input.appId === undefined ? undefined : this.byAppId.get(input.appId);
    const byName = input.appName === undefined ? undefined : this.byName.get(input.appName);
    if (input.appId !== undefined && !byId) throw new Error(`IDL app not registered: ${input.appId}`);
    if (input.appName !== undefined && !byName) throw new Error(`IDL app not registered: ${input.appName}`);
    if (byId && byName && byId !== byName) {
      throw new Error(`appId ${input.appId} does not match appName ${input.appName}`);
    }
    return (byId ?? byName)!;
  }

  private viewInstruction(registered: RegisteredIdl, method: string): IdlInstruction {
    const instruction = registered.provider.getInstruction(method);
    if (instruction.kind !== "view") throw new Error(`${registered.name}.${method} is not a view instruction`);
    if (!instruction.returns?.type) {
      throw new Error(`IDL view method ${registered.name}.${method} is missing returns.type`);
    }
    return instruction;
  }

  private decodeHistoryInstruction(index: number, raw: Uint8Array): DecodedHistoryInstruction {
    const appId = raw[0];
    if (appId === undefined) return { index, raw, error: "packed instruction is empty" };
    const registered = this.byAppId.get(appId);
    if (!registered) return { index, raw, appId, error: `IDL app not registered: ${appId}` };
    try {
      return {
        index,
        raw,
        appId,
        decoded: registered.provider.decodeAny(raw),
      };
    } catch (error) {
      return {
        index,
        raw,
        appId,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private decodeHistoryEvent(eventIndex: number, typeTag: bigint, data: Uint8Array): DecodedHistoryEvent {
    try {
      return {
        eventIndex,
        typeTag,
        data,
        dataHex: bytesToHex(data),
        decoded: this.decodeEventData(data, { typeTag }),
      };
    } catch (error) {
      return {
        eventIndex,
        typeTag,
        data,
        dataHex: bytesToHex(data),
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private decodeResourceId(resourceId: Uint8Array): DecodedResourceId {
    const appId = resourceId[0]!;
    const resourceTypeId = resourceId[1]!;
    const digest = resourceId.slice(2);
    return {
      bytes: resourceId,
      hex: bytesToHex(resourceId),
      bs58: bytesToBs58(resourceId),
      appId,
      ...(this.byAppId.get(appId)?.name ? { appName: this.byAppId.get(appId)!.name } : {}),
      resourceId: resourceTypeId,
      digest,
      digestHex: bytesToHex(digest),
    };
  }

  private decodeAccessChange(deserializer: PostcardDeserializer): {
    before: Uint8Array | undefined;
    after: Uint8Array;
    beforeDecoded: DecodedAccessValue | undefined;
    afterDecoded: DecodedAccessValue;
  } {
    const variant = deserializer.deserializeEnumVariant();
    if (variant === 0) {
      const typeTag = deserializer.deserializeU64();
      const before = deserializer.deserializeBool()
        ? deserializer.deserializeBytes()
        : undefined;
      const after = deserializer.deserializeBytes();
      return {
        before,
        after,
        beforeDecoded: before === undefined
          ? undefined
          : this.decodeInlineAccessValue(before, typeTag),
        afterDecoded: this.decodeInlineAccessValue(after, typeTag),
      };
    }
    if (variant === 1) {
      const before = deserializer.deserializeBool()
        ? deserializer.deserializeFixedBytes(32)
        : undefined;
      const after = deserializer.deserializeFixedBytes(32);
      return {
        before,
        after,
        beforeDecoded: before === undefined ? undefined : decodeExternalAccessValue(before),
        afterDecoded: decodeExternalAccessValue(after),
      };
    }
    throw new Error(`invalid AccessChange variant: ${variant}`);
  }

  private decodeInlineAccessValue(raw: Uint8Array, expectedTypeTag: bigint): DecodedAccessValue {
    const rawHex = bytesToHex(raw);
    try {
      const decoded = this.decodeAnySerializeBytes(raw, expectedTypeTag);
      return {
        kind: "inline",
        raw,
        rawHex,
        typeTag: expectedTypeTag,
        ...(decoded.ok ? { decoded: decoded.value } : { error: decoded.error }),
      };
    } catch (error) {
      return {
        kind: "unknown",
        raw,
        rawHex,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private decodeAnySerializeBytes(
    raw: Uint8Array,
    expectedTypeTag: bigint,
  ): { ok: true; value: DecodedAnySerializeValue } | { ok: false; error: string } {
    try {
      return {
        ok: true,
        value: this.decodeAnySerialize(raw, { typeTag: expectedTypeTag }),
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

function decodeExternalAccessValue(blobHash: Uint8Array): DecodedAccessValue {
  return {
    kind: "external",
    raw: blobHash,
    rawHex: bytesToHex(blobHash),
    blobHash,
    blobHashHex: bytesToHex(blobHash),
    blobHashBs58: bytesToBs58(blobHash),
  };
}

function decodeTxId(txId: Uint8Array): DecodedTxId {
  const view = new DataView(txId.buffer, txId.byteOffset, txId.byteLength);
  return {
    bytes: txId,
    hex: bytesToHex(txId),
    bs58: bytesToBs58(txId),
    blockHeight: view.getBigUint64(0, false),
    indexInBlock: view.getUint32(8, false),
  };
}

function decodeHashBytes(bytes: Uint8Array): DecodedHashBytes {
  return {
    bytes,
    hex: bytesToHex(bytes),
    bs58: bytesToBs58(bytes),
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function findEventByTypeTag(events: readonly IdlEvent[], typeTag: bigint): IdlEvent | undefined {
  return events.find((event) => typeTagsEqual(typeTag, event.typeTag));
}
