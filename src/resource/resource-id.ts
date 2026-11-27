import { concatBytes } from "../crypto/bytes";
import { domainHash } from "../crypto/hash";

const textEncoder = new TextEncoder();
const RESOURCE_ID_DOMAIN = textEncoder.encode("milon.resource-id.v1");

export type ResourcePathValue = unknown;
export type ResourcePathHasher = (item: ResourcePathValue) => Uint8Array;

export interface ResourceIdOptions {
  app: string;
  name: string;
  path?: ResourcePathValue[];
  pathHasher?: ResourcePathHasher;
}

export class ResourceId {
  readonly app: string;
  readonly name: string;
  readonly path: ResourcePathValue[];
  readonly hash: Uint8Array;

  constructor({ app, name, path = [], pathHasher = defaultPathHasher }: ResourceIdOptions) {
    if (!app || !name) throw new TypeError("ResourceId requires app and name");
    this.app = app;
    this.name = name;
    this.path = path;
    this.hash = domainHash(
      RESOURCE_ID_DOMAIN,
      textEncoder.encode(app),
      textEncoder.encode(name),
      ...path.map((item) => pathHasher(item))
    );
  }

  toJSON(): { app: string; name: string; path: ResourcePathValue[]; hash: number[] } {
    return {
      app: this.app,
      name: this.name,
      path: this.path,
      hash: Array.from(this.hash)
    };
  }
}

export function defaultPathHasher(item: ResourcePathValue): Uint8Array {
  if (hasBytes(item)) return item.bytes;
  if (item instanceof Uint8Array) return item;
  if (typeof item === "string") return textEncoder.encode(item);
  if (typeof item === "number" || typeof item === "bigint") {
    return textEncoder.encode(item.toString());
  }
  return textEncoder.encode(JSON.stringify(item));
}

export function resourcePathKey(...parts: ResourcePathValue[]): Uint8Array {
  return concatBytes(...parts.map(defaultPathHasher));
}

function hasBytes(item: ResourcePathValue): item is { bytes: Uint8Array } {
  return typeof item === "object" && item !== null && "bytes" in item
    && (item as { bytes?: unknown }).bytes instanceof Uint8Array;
}
