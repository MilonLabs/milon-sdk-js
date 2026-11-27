export type AnyNumber = number | bigint | string;

export interface Serializable<TSerializer = unknown> {
  serialize(serializer: TSerializer): void;
}

export interface Deserializable<T, TDeserializer = unknown> {
  deserialize(deserializer: TDeserializer): T;
}

export function isSerializable<TSerializer>(
  value: unknown
): value is Serializable<TSerializer> {
  return typeof value === "object"
    && value !== null
    && "serialize" in value
    && typeof (value as { serialize?: unknown }).serialize === "function";
}
