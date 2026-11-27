import { SimulateReceipt } from "../executor/wire";
import type { BytesLike } from "../crypto/bytes";
import { PostcardDeserializer } from "../postcard/index";
import { IdlRegistry, type DecodedAnySerializeValue, type DecodedEventData } from "./manager";

export interface DecodedTokenField {
  name: string;
  value: unknown;
}

export type DecodedToken =
  | null
  | boolean
  | number
  | bigint
  | string
  | Uint8Array
  | { readonly bytes: Uint8Array }
  | DecodedToken[]
  | { method: string; fields: DecodedTokenField[] }
  | { enum: string; variant: string; discriminator?: number; fields: unknown };

export interface DecodedResource {
  name: string;
  token: DecodedToken;
}

export interface DecodedEvent {
  appName: string;
  eventName: string;
  typeTag: bigint;
  token: DecodedToken;
}

export function decodeTransactionResponse(
  bytes: BytesLike,
  registry: IdlRegistry = new IdlRegistry(),
): SimulateReceipt {
  return SimulateReceipt.fromPostcard(bytes, {
    decodeAnySerialize: (typeTag, deserializer) =>
      toDecodedResource(registry.decodeResourceFromDeserializer(typeTag, deserializer)),
    decodeEvent: (typeTag, deserializer) =>
      toDecodedEvent(registry.decodeEventFromDeserializer(typeTag, deserializer)),
    decodeFramedAnySerialize: (typeTag, body) =>
      toDecodedResource(decodeFramedBody(body, (deserializer) =>
        registry.decodeResourceFromDeserializer(typeTag, deserializer))),
    decodeFramedEvent: (typeTag, body) =>
      toDecodedEvent(decodeFramedBody(body, (deserializer) =>
        registry.decodeEventFromDeserializer(typeTag, deserializer))),
  });
}

function decodeFramedBody<T>(
  body: Uint8Array,
  decode: (deserializer: PostcardDeserializer) => T,
): T {
  const deserializer = new PostcardDeserializer(body);
  const value = decode(deserializer);
  deserializer.assertEnd();
  return value;
}

function toDecodedResource(decoded: DecodedAnySerializeValue): DecodedResource {
  return {
    name: decoded.type,
    token: toStructToken(decoded.type, decoded.value),
  };
}

function toDecodedEvent(decoded: DecodedEventData): DecodedEvent {
  return {
    appName: decoded.appName,
    eventName: decoded.eventName,
    typeTag: decoded.typeTag,
    token: toStructToken(decoded.eventName, decoded.value),
  };
}

function toStructToken(name: string, value: unknown): DecodedToken {
  if (!isRecord(value)) return toToken(value);
  return {
    method: name,
    fields: Object.entries(value).map(([fieldName, fieldValue]) => ({
      name: fieldName,
      value: toToken(fieldValue),
    })),
  };
}

function toToken(value: unknown): DecodedToken {
  if (
    value === null ||
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "bigint" ||
    typeof value === "string" ||
    value instanceof Uint8Array
  ) {
    return value;
  }
  if (hasBytes(value)) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => toToken(item));
  }
  if (isRecord(value) && typeof value.variant === "string") {
    return {
      enum: "",
      variant: value.variant,
      fields: toToken(value.value),
    };
  }
  if (isRecord(value)) {
    return {
      method: "",
      fields: Object.entries(value).map(([fieldName, fieldValue]) => ({
        name: fieldName,
        value: toToken(fieldValue),
      })),
    };
  }
  return String(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Uint8Array);
}

function hasBytes(value: unknown): value is { readonly bytes: Uint8Array } {
  return isRecord(value) && value.bytes instanceof Uint8Array;
}
