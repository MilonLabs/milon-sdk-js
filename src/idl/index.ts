import {
  Address,
  assertBytes,
  PublicKey,
  PublicKeyKind,
  Signature,
  SignatureKind,
  Signer,
  VirAddress,
  VirSigner,
} from "../crypto/index";
import { PostcardDeserializer, PostcardSerializer } from "../postcard/index";
import {
  Transaction,
  type TransactionSignatureInput,
} from "../transaction/index";
import type { Transport } from "../executor/index";
import type { BytesLike, U64Like } from "../crypto/bytes";
import { typeTagForType, typeTagsEqual, type TypeTagLike } from "./type-tag";
import { DEFAULT_IDLS } from "./default-idls";

export { DEFAULT_IDLS } from "./default-idls";
export * from "./struct";

export type IdlArgValue = unknown;
export type IdlArgs = Record<string, IdlArgValue>;

export interface IdlArg {
  name: string;
  role: "input" | "signer" | string;
  type: string;
}

export interface IdlInstruction {
  name: string;
  handler: string;
  kind: "entry" | "view" | "write" | string;
  discriminator: number;
  args: IdlArg[];
  sponsor?: boolean;
  required_signers?: string[];
  signer_lookups?: Record<string, unknown>;
  returns?: { type: string };
}

export interface IdlStructType {
  name: string;
  kind: "struct" | string;
  typeTag?: TypeTagLike;
  legacyTypeTags?: TypeTagLike[];
  fields?: Array<{ name: string; type: string }>;
  variants?: IdlEnumVariant[];
}

export interface IdlEnumVariant {
  name: string;
  kind: "unit" | "struct" | "tuple" | string;
  fields: Array<{ name: string; type: string }>;
}

export interface IdlEventField {
  name: string;
  type: string;
  indexed?: boolean;
}

export interface IdlEvent {
  name: string;
  typeTag: TypeTagLike;
  fields: IdlEventField[];
}

export interface IdlConstant {
  name: string;
  type: string;
  value: unknown;
}

export interface IdlResource {
  name: string;
  type: string;
  typeTag: TypeTagLike;
}

export interface IdlError {
  code: number;
  name: string;
  message?: string;
  transparent?: boolean;
}

export interface MilonIdl {
  name?: string;
  app_id?: number;
  schema_version?: string;
  metadata?: {
    app_id?: number;
    name?: string;
    [key: string]: unknown;
  };
  instructions: IdlInstruction[];
  types?: IdlStructType[];
  events?: IdlEvent[];
  resources?: IdlResource[];
  constants?: IdlConstant[];
  errors?: IdlError[];
}

export interface InvokeEntryOptions {
  stamp?: U64Like;
  chainId?: U64Like;
  payer?: Address | BytesLike | null;
  signatures?: TransactionSignatureInput[];
}

/** @deprecated Use InvokeEntryOptions. */
export type InvokeWriteOptions = InvokeEntryOptions;

export interface DecodedIdlInstruction {
  appId: number;
  method: string;
  instruction: IdlInstruction;
  args: IdlArgs;
}

export interface DecodedTaggedValue {
  typeTag: bigint;
  value: IdlArgValue;
}

export type IdlProviderMethod = (
  args: IdlArgs,
  options?: InvokeEntryOptions,
) => Promise<unknown>;

export enum KindEnum {
  INLINE = "inline",
  EXTERNAL = "external",
}

export enum IdlName {
  System = "system-0",
  Account = "account-1",
  Token = "token-2",
  Staking = "staking-3",
  Identity = "identity-4",
  Sftoken = "sftoken-5",
  Dex = "dex-6",
  Validator = "validator-7",
  Keyless = "keyless-8",
  Social = "social-10",
  Funds = "funds-11",
  Commission = "commission-12",
  Demo = "demo-254",
}

type BuiltinIdl = (typeof DEFAULT_IDLS)[number];
type BuiltinIdlFor<TName extends IdlName, TIdl = BuiltinIdl> = TIdl extends {
  readonly metadata: {
    readonly name: infer TIdlName extends string;
    readonly app_id: infer TAppId extends number;
  };
}
  ? TName extends `${TIdlName}-${TAppId}`
    ? TIdl
    : never
  : never;
type BuiltinInstruction<TName extends IdlName> =
  BuiltinIdlFor<TName>["instructions"][number];
type BuiltinType<TName extends IdlName, TType extends string> = Extract<
  BuiltinIdlFor<TName>["types"][number],
  { readonly name: TType }
>;

type IdlPrimitiveValue<TType extends string> = TType extends "bool"
  ? boolean
  : TType extends "u8" | "u16" | "u32" | "i8" | "i16" | "i32"
    ? number
    : TType extends "u64" | "u128" | "i64"
      ? U64Like
      : TType extends "string" | "String" | "str"
        ? string
        : TType extends "bytes" | "Vec<u8>" | "vec<u8>"
          ? BytesLike
          : TType extends `Option<${infer TInner}>` | `option<${infer TInner}>`
            ? IdlPrimitiveValue<TInner> | null | undefined
            : TType extends `Vec<${infer TInner}>` | `vec<${infer TInner}>`
              ? IdlPrimitiveValue<TInner>[]
              : TType extends "Address"
                ? Address | BytesLike
                : TType extends "Signer"
                  ? Signer | Address | BytesLike
                  : TType extends "AnySigner"
                    ? Signer | Address | BytesLike
                  : TType extends "VirAddress"
                    ? VirAddress | BytesLike
                    : TType extends "VirSigner"
                      ? VirSigner | VirAddress | BytesLike
                      : TType extends "PublicKey"
                        ? PublicKey
                        : TType extends "B96" | "B144" | "B256"
                          ? BytesLike
                          : TType extends "Bitmap64"
                            ? U64Like
                        : IdlArgValue;

type IdlWireValue<TName extends IdlName, TType extends string> =
  BuiltinType<TName, TType> extends infer TDefinition
    ? [TDefinition] extends [never]
      ? IdlPrimitiveValue<TType>
      : TDefinition extends { readonly fields: readonly (infer TField)[] }
        ? {
            [TItem in TField as TItem extends {
              readonly name: infer TFieldName extends string;
            }
              ? TFieldName
              : never]: TItem extends {
              readonly type: infer TFieldType extends string;
            }
              ? IdlPrimitiveValue<TFieldType>
              : IdlArgValue;
          }
        : IdlPrimitiveValue<TType>
    : IdlPrimitiveValue<TType>;

type InstructionArgs<
  TName extends IdlName,
  TInstruction,
> = TInstruction extends { readonly args: readonly (infer TArg)[] }
  ? {
      [TItem in TArg as TItem extends {
        readonly name: infer TArgName extends string;
      }
        ? TArgName
        : never]: TItem extends { readonly type: infer TType extends string }
        ? IdlWireValue<TName, TType>
        : IdlArgValue;
    }
  : IdlArgs;

export type IdlInstructionApi<TName extends IdlName, TInstruction> = {
  (
    args: InstructionArgs<TName, TInstruction>,
    options?: InvokeEntryOptions,
  ): Promise<unknown>;
  arg: {
    (args: InstructionArgs<TName, TInstruction>): {
      readonly encode: Uint8Array;
    };
    (bytes: BytesLike): {
      readonly decode: DecodedIdlInstruction;
    };
  };
};

export type IdlProviderMethods<TName extends IdlName = IdlName> = {
  [TInstruction in BuiltinInstruction<TName> as TInstruction["name"]]: IdlInstructionApi<
    TName,
    TInstruction
  >;
};

function builtinIdl(name: IdlName): MilonIdl {
  const idl = DEFAULT_IDLS.find(
    (candidate) =>
      `${candidate.metadata.name}-${candidate.metadata.app_id}` === name,
  );
  if (!idl) throw new Error(`built-in IDL not found: ${name}`);
  return idl as unknown as MilonIdl;
}

class IdlProviderBase<TName extends IdlName = IdlName> {
  [methodName: string]: unknown;

  readonly idl: MilonIdl;
  readonly transport: Transport | undefined;
  readonly methodNames: string[];
  private readonly instructions: Map<string, IdlInstruction>;
  private readonly types: Map<string, IdlStructType>;

  constructor(idl: TName | MilonIdl, transport?: Transport) {
    this.idl = typeof idl === "string" ? builtinIdl(idl) : idl;
    this.transport = transport;
    this.methodNames = this.idl.instructions.map(
      (instruction) => instruction.name,
    );
    this.instructions = new Map(
      this.idl.instructions.map((instruction) => [
        instruction.name,
        instruction,
      ]),
    );
    this.types = new Map(
      (this.idl.types ?? []).map((type) => [type.name, type]),
    );
    this.installIdlMethods();
  }

  method(name: string): IdlMethod<TName> {
    const instruction = this.instructions.get(name);
    if (!instruction) {
      throw new Error(`IDL method not found: ${name}`);
    }
    return new IdlMethod(this, instruction);
  }

  getInstruction(name: string): IdlInstruction {
    return this.method(name).instruction;
  }

  transaction(
    method: string,
    args: IdlArgs,
    options: InvokeEntryOptions = {},
  ): Transaction {
    const instruction = this.method(method).instruction;
    if (!isEntryInstruction(instruction)) {
      throw new Error(`${method} is not an entry instruction`);
    }
    return new Transaction({
      stamp: options.stamp ?? 0n,
      payer: options.payer ?? null,
      instructions: [this.method(method).encode(args)],
      signatures: options.signatures ?? [],
      ...(options.chainId !== undefined ? { chainId: options.chainId } : {}),
    });
  }

  async entry(
    method: string,
    args: IdlArgs,
    options: InvokeEntryOptions = {},
  ): Promise<unknown> {
    if (!this.transport) throw new Error("transport is required");
    const tx = this.transaction(method, args, options);
    return this.transport.request("submitTransaction", tx);
  }

  async write(
    method: string,
    args: IdlArgs,
    options: InvokeEntryOptions = {},
  ): Promise<unknown> {
    return this.entry(method, args, options);
  }

  async view(
    method: string,
    args: IdlArgs,
    options: Omit<InvokeEntryOptions, "signatures" | "payer"> = {},
  ): Promise<unknown> {
    if (!this.transport) throw new Error("transport is required");
    const instruction = this.method(method).instruction;
    if (instruction.kind !== "view") {
      throw new Error(`${method} is not a view instruction`);
    }
    void options;
    return this.transport.request("executeView", this.method(method).encode(args));
  }

  private installIdlMethods(): void {
    for (const instruction of this.instructions.values()) {
      if (instruction.name in this) {
        throw new Error(
          `IDL method name conflicts with provider property: ${instruction.name}`,
        );
      }
      const method = (args: IdlArgs, options: InvokeEntryOptions = {}) =>
        this.invoke(instruction, args, options);
      Object.defineProperty(method, "arg", {
        enumerable: true,
        configurable: false,
        value: (value: IdlArgs | BytesLike) => {
          const result = {};
          Object.defineProperties(result, {
            encode: {
              enumerable: true,
              configurable: false,
              get: () => this.method(instruction.name).encode(value as IdlArgs),
            },
            decode: {
              enumerable: true,
              configurable: false,
              get: () => {
                const decoded = this.decodeAny(value as BytesLike);
                if (decoded.instruction.name !== instruction.name) {
                  throw new Error(
                    `decoded instruction is ${decoded.instruction.name}, expected ${instruction.name}`,
                  );
                }
                return decoded;
              },
            },
          });
          return result;
        },
      });
      Object.defineProperty(this, instruction.name, {
        enumerable: true,
        configurable: false,
        value: method,
      });
    }
  }

  decodeAny(bytes: BytesLike): DecodedIdlInstruction {
    const deserializer = new PostcardDeserializer(bytes);
    const appId = deserializer.deserializeU8();
    if (appId !== this.appId()) {
      throw new Error(`unexpected app_id ${appId}, expected ${this.appId()}`);
    }

    const discriminator = deserializeInstructionDiscriminator(deserializer);
    const instruction = Array.from(this.instructions.values()).find(
      (candidate) => candidate.discriminator === discriminator,
    );
    if (!instruction) {
      throw new Error(`IDL discriminator not found: ${discriminator}`);
    }

    const args: IdlArgs = {};
    for (const arg of instruction.args) {
      args[arg.name] = this.deserializeValue(deserializer, arg.type);
    }
    deserializer.assertEnd();

    return {
      appId,
      method: instruction.name,
      instruction,
      args,
    };
  }

  private invoke(
    instruction: IdlInstruction,
    args: IdlArgs,
    options: InvokeEntryOptions,
  ): Promise<unknown> {
    if (isEntryInstruction(instruction)) {
      return this.entry(instruction.name, args, options);
    }
    if (instruction.kind === "view") {
      return this.view(instruction.name, args, options);
    }
    throw new Error(`unsupported IDL instruction kind: ${instruction.kind}`);
  }

  encodeArgs(instruction: IdlInstruction, args: IdlArgs): Uint8Array {
    const serializer = new PostcardSerializer();
    serializer.serializeU8(this.outerDiscriminator());
    serializeInstructionDiscriminator(serializer, instruction.discriminator);
    for (const arg of instruction.args) {
      if (!(arg.name in args) || args[arg.name] === undefined) {
        throw new Error(`missing IDL argument: ${arg.name}`);
      }
      this.serializeValue(serializer, arg.type, args[arg.name]);
    }
    return serializer.toUint8Array();
  }

  decodeArgs(instruction: IdlInstruction, bytes: BytesLike): IdlArgs {
    const decoded = this.decodeAny(bytes);
    if (decoded.instruction.name !== instruction.name) {
      throw new Error(
        `decoded instruction is ${decoded.instruction.name}, expected ${instruction.name}`,
      );
    }
    return decoded.args;
  }

  decodeViewValues(method: string, bytes: BytesLike): DecodedTaggedValue[] {
    const instruction = this.method(method).instruction;
    if (instruction.kind !== "view") {
      throw new Error(`${method} is not a view instruction`);
    }
    if (!instruction.returns?.type) {
      throw new Error(`IDL view method ${method} is missing returns.type`);
    }
    const expectedTypeTag = IdlProviderBase.typeTagForType(instruction.returns.type);
    const returnType = this.types.get(instruction.returns.type);
    const acceptedTypeTags: TypeTagLike[] = [
      expectedTypeTag,
      ...(returnType?.typeTag !== undefined ? [returnType.typeTag] : []),
      ...(returnType?.legacyTypeTags ?? []),
      ...legacyTypeTagsFor(this.idlName(), instruction.returns.type),
    ];
    const acceptsTypeTag = (typeTag: bigint) =>
      acceptedTypeTags.some((expected) => typeTagsEqual(typeTag, expected));

    try {
      const deserializer = new PostcardDeserializer(bytes);
      const count = deserializer.deserializeU32();
      const values: DecodedTaggedValue[] = [];
      for (let i = 0; i < count; i += 1) {
        const typeTag = deserializer.deserializeU64();
        if (!acceptsTypeTag(typeTag)) {
          throw new Error(
            `view ${method} typeTag mismatch: expected=${expectedTypeTag}, payload=${typeTag}`,
          );
        }
        values.push({
          typeTag,
          value: this.deserializeValue(deserializer, instruction.returns.type),
        });
      }
      deserializer.assertEnd();
      // A raw empty Vec is encoded as a single zero byte, which is also a
      // valid encoding of an empty tagged-value Vec. A view instruction has a
      // declared return type, so prefer the valid raw value in this ambiguous
      // case instead of reporting that the view returned no values.
      if (values.length === 0) {
        const rawDeserializer = new PostcardDeserializer(bytes);
        const value = this.deserializeValue(
          rawDeserializer,
          instruction.returns.type,
        );
        rawDeserializer.assertEnd();
        return [{
          typeTag: IdlProviderBase.typeTagForType(instruction.returns.type),
          value,
        }];
      }
      return values;
    } catch (taggedVecError) {
      try {
        // Current nodes concatenate postcard-encoded (type_tag, value) tuples without a Vec prefix.
        const deserializer = new PostcardDeserializer(bytes);
        const values: DecodedTaggedValue[] = [];
        while (deserializer.remaining > 0) {
          const typeTag = deserializer.deserializeU64();
          if (!acceptsTypeTag(typeTag)) {
            throw new Error(
              `view ${method} typeTag mismatch: expected=${expectedTypeTag}, payload=${typeTag}`,
            );
          }
          values.push({
            typeTag,
            value: this.deserializeValue(
              deserializer,
              instruction.returns.type,
            ),
          });
        }
        return values;
      } catch (taggedConcatError) {
        try {
          // Older nodes may return bare values without runtime type tags.
          const deserializer = new PostcardDeserializer(bytes);
          const typeTag = IdlProviderBase.typeTagForType(
            instruction.returns.type,
          );
          const values: DecodedTaggedValue[] = [];
          while (deserializer.remaining > 0) {
            values.push({
              typeTag,
              value: this.deserializeValue(
                deserializer,
                instruction.returns.type,
              ),
            });
          }
          return values;
        } catch (rawError) {
          const taggedVecMessage =
            taggedVecError instanceof Error
              ? taggedVecError.message
              : String(taggedVecError);
          const taggedConcatMessage =
            taggedConcatError instanceof Error
              ? taggedConcatError.message
              : String(taggedConcatError);
          const rawMessage =
            rawError instanceof Error ? rawError.message : String(rawError);
          throw new Error(
            `failed to decode view ${method}: tagged vec decode failed: ${taggedVecMessage}; tagged concat decode failed: ${taggedConcatMessage}; raw decode failed: ${rawMessage}`,
          );
        }
      }
    }
  }

  decodeViewValue(method: string, bytes: BytesLike): IdlArgValue {
    const values = this.decodeViewValues(method, bytes);
    if (values.length === 0) {
      throw new Error(`view ${method} returned no values`);
    }
    return values[0]!.value;
  }

  decodeValue(type: string, bytes: BytesLike): IdlArgValue {
    const deserializer = new PostcardDeserializer(bytes);
    const value = this.deserializeValue(deserializer, type);
    deserializer.assertEnd();
    return value;
  }

  deserializeAnySerializeValue(
    typeTag: bigint,
    deserializer: PostcardDeserializer,
  ): { type: string; value: IdlArgValue } {
    const type = this.findTypeByTag(typeTag);
    if (!type) {
      throw new Error(`IDL typeTag not found: ${typeTag}`);
    }
    return {
      type: type.name,
      value: this.deserializeValue(deserializer, type.name),
    };
  }

  decodeFields(
    fields: Array<{ name: string; type: string }>,
    bytes: BytesLike,
  ): Record<string, IdlArgValue> {
    const deserializer = new PostcardDeserializer(bytes);
    const value = this.deserializeFields(deserializer, fields);
    deserializer.assertEnd();
    return value;
  }

  static typeTagForType(type: string): bigint {
    return typeTagForType(type);
  }

  private outerDiscriminator(): number {
    return this.appId();
  }

  private appId(): number {
    const appId = this.idl.app_id ?? this.idl.metadata?.app_id;
    if (appId === undefined) {
      throw new Error("IDL app_id is required");
    }
    return appId;
  }

  private findTypeByTag(typeTag: bigint): IdlStructType | undefined {
    for (const type of this.types.values()) {
      if (type.typeTag !== undefined && typeTagsEqual(typeTag, type.typeTag)) {
        return type;
      }
      if (
        (type.legacyTypeTags ?? []).some((legacyTypeTag) =>
          typeTagsEqual(typeTag, legacyTypeTag),
        )
      ) {
        return type;
      }
      if (
        legacyTypeTagsFor(this.idlName(), type.name).some((legacyTypeTag) =>
          typeTagsEqual(typeTag, legacyTypeTag),
        )
      ) {
        return type;
      }
    }

    // Resources are also AnySerialize values. Their public IDL name (for
    // example `_VoteSweepShard`) may differ from the wire type
    // (`vec<VoteSweepOwner>`), so decode with the resource's declared type.
    for (const resource of this.idl.resources ?? []) {
      if (typeTagsEqual(typeTag, resource.typeTag)) {
        return { kind: "builtin", name: resource.type, typeTag };
      }
    }

    // Container resource types (for example Vec<AcceptedVcIssuer>) can be
    // referenced by an instruction without appearing as a standalone IDL
    // type. Rust tags these values from the fully-qualified Rust type name,
    // which cannot be reconstructed from the wire type alone. Resolve those
    // known runtime tags from the app compatibility table and return a
    // synthetic type so deserializeValue can decode the referenced wire type.
    for (const instruction of this.instructions.values()) {
      const typeName = instruction.returns?.type;
      if (
        typeName &&
        legacyTypeTagsFor(this.idlName(), typeName).some((legacyTypeTag) =>
          typeTagsEqual(typeTag, legacyTypeTag),
        )
      ) {
        return { kind: "builtin", name: typeName, typeTag };
      }
    }
    return undefined;
  }

  private idlName(): string | undefined {
    return this.idl.name || this.idl.metadata?.name;
  }

  private serializeValue(
    serializer: PostcardSerializer,
    type: string,
    value: IdlArgValue,
  ): void {
    const normalizedType = type.trim();
    const aliasType = IDL_WIRE_TYPE_ALIASES[normalizedType];
    if (aliasType) {
      this.serializeValue(serializer, aliasType, value);
      return;
    }

    const fixedArray = parseArrayInner(normalizedType);
    if (fixedArray) {
      if (fixedArray.type === "u8") {
        serializer.serializeFixedBytes(
          toFixedArrayBytes(value, fixedArray.length, type),
        );
        return;
      }
      const items = tupleValues(value, fixedArray.length);
      for (const item of items)
        this.serializeValue(serializer, fixedArray.type, item);
      return;
    }

    const vecInner = parseVecInner(normalizedType);
    if (vecInner) {
      if (vecInner === "u8" && value instanceof Uint8Array) {
        serializer.serializeBytes(value);
        return;
      }
      if (!Array.isArray(value))
        throw new TypeError(`${type} expects an array`);
      serializer.serializeU32(value.length);
      for (const item of value) {
        this.serializeValue(serializer, vecInner, item);
      }
      return;
    }

    const optionInner = parseOptionInner(normalizedType);
    if (optionInner) {
      serializer.serializeBool(value !== undefined && value !== null);
      if (value !== undefined && value !== null) {
        this.serializeValue(serializer, optionInner, value);
      }
      return;
    }

    const mapTypes = parseMapInner(normalizedType);
    if (mapTypes) {
      const entries = mapEntries(value);
      serializer.serializeU32(entries.length);
      for (const [key, item] of entries) {
        this.serializeValue(serializer, mapTypes.key, key);
        this.serializeValue(serializer, mapTypes.value, item);
      }
      return;
    }

    const tupleTypes = parseTupleInner(normalizedType);
    if (tupleTypes) {
      const tuple = tupleValues(value, tupleTypes.length);
      tupleTypes.forEach((itemType, index) =>
        this.serializeValue(serializer, itemType, tuple[index]),
      );
      return;
    }

    const struct = this.types.get(normalizedType);
    if (struct?.kind === "struct") {
      if (!isRecord(value))
        throw new TypeError(`${normalizedType} expects an object`);
      for (const field of struct.fields ?? []) {
        if (!(field.name in value))
          throw new Error(`missing struct field: ${field.name}`);
        this.serializeValue(serializer, field.type, value[field.name]);
      }
      return;
    }

    if (struct?.kind === "enum") {
      this.serializeEnum(serializer, struct, value);
      return;
    }

    switch (normalizedType) {
      case "Address":
      case "Signer":
      case "AnySigner":
        serializer.serializeFixedBytes(addressBytes(value));
        return;
      case "VirAddress":
      case "VirSigner":
        serializer.serializeFixedBytes(virAddressBytes(value));
        return;
      case "PublicKey":
        serializePublicKey(serializer, value);
        return;
      case "Signature":
        serializeSignature(serializer, value);
        return;
      case "B96":
        serializer.serializeFixedBytes(
          assertBytes(value as BytesLike, 12, "B96"),
        );
        return;
      case "B144":
        serializer.serializeFixedBytes(
          assertBytes(value as BytesLike, 18, "B144"),
        );
        return;
      case "B256":
        serializer.serializeFixedBytes(
          assertBytes(value as BytesLike, 32, "B256"),
        );
        return;
      case "Bitmap64":
        serializer.serializeU64(BigInt(value as U64Like));
        return;
      case "String":
      case "string":
        serializer.serializeStr(String(value));
        return;
      case "bool":
      case "boolean":
        serializer.serializeBool(Boolean(value));
        return;
      case "u8":
        serializer.serializeU8(Number(value));
        return;
      case "u16":
        serializer.serializeU16(Number(value));
        return;
      case "u32":
        serializer.serializeU32(value as U64Like);
        return;
      case "u64":
        serializer.serializeU64(value as U64Like);
        return;
      case "u128":
        serializer.serializeU128(value as U64Like);
        return;
      case "i8":
        serializer.serializeI8(Number(value));
        return;
      case "i16":
        serializer.serializeI16(Number(value));
        return;
      case "i32":
        serializer.serializeI32(Number(value));
        return;
      case "i64":
        serializer.serializeI64(value as U64Like);
        return;
      default:
        throw new Error(`unsupported IDL type: ${type}`);
    }
  }

  private deserializeValue(
    deserializer: PostcardDeserializer,
    type: string,
  ): IdlArgValue {
    const normalizedType = type.trim();
    const aliasType = IDL_WIRE_TYPE_ALIASES[normalizedType];
    if (aliasType) return this.deserializeValue(deserializer, aliasType);

    const fixedArray = parseArrayInner(normalizedType);
    if (fixedArray) {
      if (fixedArray.type === "u8")
        return deserializer.deserializeFixedBytes(fixedArray.length);
      return Array.from({ length: fixedArray.length }, () =>
        this.deserializeValue(deserializer, fixedArray.type),
      );
    }

    const vecInner = parseVecInner(normalizedType);
    if (vecInner) {
      if (vecInner === "u8") return deserializer.deserializeBytes();
      const length = deserializer.deserializeU32();
      return Array.from({ length }, () =>
        this.deserializeValue(deserializer, vecInner),
      );
    }

    const optionInner = parseOptionInner(normalizedType);
    if (optionInner) {
      return deserializer.deserializeBool()
        ? this.deserializeValue(deserializer, optionInner)
        : undefined;
    }

    const mapTypes = parseMapInner(normalizedType);
    if (mapTypes) {
      const length = deserializer.deserializeU32();
      const entries = [];
      for (let i = 0; i < length; i += 1) {
        entries.push([
          this.deserializeValue(deserializer, mapTypes.key),
          this.deserializeValue(deserializer, mapTypes.value),
        ]);
      }
      return entries;
    }

    const tupleTypes = parseTupleInner(normalizedType);
    if (tupleTypes) {
      return tupleTypes.map((itemType) =>
        this.deserializeValue(deserializer, itemType),
      );
    }

    const struct = this.types.get(normalizedType);
    if (struct?.kind === "struct") {
      const value: Record<string, unknown> = {};
      for (const field of struct.fields ?? []) {
        value[field.name] = this.deserializeValue(deserializer, field.type);
      }
      return value;
    }

    if (struct?.kind === "enum") {
      return this.deserializeEnum(deserializer, struct);
    }

    switch (normalizedType) {
      case "Address":
        return new Address(deserializer.deserializeFixedBytes(Address.LENGTH));
      case "Signer":
        return new Signer(deserializer.deserializeFixedBytes(Address.LENGTH));
      case "AnySigner":
        return new Signer(deserializer.deserializeFixedBytes(Address.LENGTH));
      case "VirAddress":
        return VirAddress.from(
          deserializer.deserializeFixedBytes(VirAddress.LENGTH),
        );
      case "VirSigner":
        return new VirSigner(
          deserializer.deserializeFixedBytes(VirAddress.LENGTH),
        );
      case "PublicKey":
        return deserializePublicKey(deserializer);
      case "Signature":
        return deserializeSignature(deserializer);
      case "B96":
        return deserializer.deserializeFixedBytes(12);
      case "B144":
        return deserializer.deserializeFixedBytes(18);
      case "B256":
        return deserializer.deserializeFixedBytes(32);
      case "Bitmap64":
        return deserializer.deserializeU64();
      case "String":
      case "string":
        return deserializer.deserializeStr();
      case "bool":
      case "boolean":
        return deserializer.deserializeBool();
      case "u8":
        return deserializer.deserializeU8();
      case "u16":
        return deserializer.deserializeU16();
      case "u32":
        return deserializer.deserializeU32();
      case "u64":
        return deserializer.deserializeU64();
      case "u128":
        return deserializer.deserializeU128();
      case "i8":
        return deserializer.deserializeI8();
      case "i16":
        return deserializer.deserializeI16();
      case "i32":
        return deserializer.deserializeI32();
      case "i64":
        return deserializer.deserializeI64();
      default:
        throw new Error(`unsupported IDL type: ${type}`);
    }
  }

  private serializeEnum(
    serializer: PostcardSerializer,
    type: IdlStructType,
    value: IdlArgValue,
  ): void {
    const variantInput = enumVariantInput(value);
    const variants = type.variants ?? [];
    const variantIndex = variants.findIndex(
      (variant) =>
        variant.name.toLowerCase() === variantInput.name.toLowerCase(),
    );
    if (variantIndex < 0) {
      throw new Error(`unknown enum variant ${type.name}.${variantInput.name}`);
    }

    const variant = variants[variantIndex]!;
    serializer.serializeEnumVariant(variantIndex);
    if (variant.kind === "unit") return;

    if (variant.kind === "tuple") {
      const tuple = tupleValues(variantInput.value, variant.fields.length);
      variant.fields.forEach((field, index) =>
        this.serializeValue(serializer, field.type, tuple[index]),
      );
      return;
    }

    if (!isRecord(variantInput.value)) {
      throw new TypeError(`${type.name}.${variant.name} expects an object`);
    }
    for (const field of variant.fields) {
      if (!(field.name in variantInput.value))
        throw new Error(`missing enum field: ${field.name}`);
      this.serializeValue(
        serializer,
        field.type,
        variantInput.value[field.name],
      );
    }
  }

  private deserializeEnum(
    deserializer: PostcardDeserializer,
    type: IdlStructType,
  ): IdlArgValue {
    const variants = type.variants ?? [];
    const variantIndex = deserializer.deserializeEnumVariant();
    const variant = variants[variantIndex];
    if (!variant) {
      throw new Error(
        `unknown enum variant index ${variantIndex} for ${type.name}`,
      );
    }

    if (variant.kind === "unit") return variant.name;
    if (variant.kind === "tuple") {
      return {
        variant: variant.name,
        value: variant.fields.map((field) =>
          this.deserializeValue(deserializer, field.type),
        ),
      };
    }

    const value: Record<string, unknown> = {};
    for (const field of variant.fields) {
      value[field.name] = this.deserializeValue(deserializer, field.type);
    }
    return { variant: variant.name, value };
  }

  deserializeFields(
    deserializer: PostcardDeserializer,
    fields: Array<{ name: string; type: string }>,
  ): Record<string, IdlArgValue> {
    const value: Record<string, IdlArgValue> = {};
    for (const field of fields) {
      value[field.name] = this.deserializeValue(deserializer, field.type);
    }
    return value;
  }
}

export type IdlProvider<TName extends IdlName = IdlName> =
  IdlProviderBase<TName> & IdlProviderMethods<TName>;

export const IdlProvider = IdlProviderBase as unknown as {
  new <TName extends IdlName>(
    idl: TName,
    transport?: Transport,
  ): IdlProvider<TName>;
  new (idl: MilonIdl, transport?: Transport): IdlProvider;
};

export class IdlMethod<TName extends IdlName = IdlName> {
  readonly idlProvider: IdlProviderBase<TName>;
  readonly instruction: IdlInstruction;

  constructor(provider: IdlProviderBase<TName>, instruction: IdlInstruction) {
    this.idlProvider = provider;
    this.instruction = instruction;
  }

  arg(args: IdlArgs): { readonly encode: Uint8Array };
  arg(bytes: BytesLike): { readonly decode: IdlArgs };
  arg(value: IdlArgs | BytesLike): {
    readonly encode?: Uint8Array;
    readonly decode?: IdlArgs;
  } {
    const method = this;
    const result = {};
    Object.defineProperties(result, {
      encode: {
        enumerable: true,
        configurable: false,
        get: () => method.encode(value as IdlArgs),
      },
      decode: {
        enumerable: true,
        configurable: false,
        get: () => method.decode(value as BytesLike),
      },
    });
    return result;
  }

  encode(args: IdlArgs): Uint8Array {
    return this.idlProvider.encodeArgs(this.instruction, args);
  }

  decode(bytes: BytesLike): IdlArgs {
    return this.idlProvider.decodeArgs(this.instruction, bytes);
  }
}

function parseVecInner(type: string): string | undefined {
  const match = /^vec<(.+)>$/i.exec(type);
  return match?.[1]?.trim();
}

function isEntryInstruction(instruction: IdlInstruction): boolean {
  return instruction.kind === "entry" || instruction.kind === "write";
}

function parseArrayInner(
  type: string,
): { type: string; length: number } | undefined {
  const match = /^array<(.+);(\d+)>$/i.exec(type);
  if (!match?.[1] || !match[2]) return undefined;
  return { type: match[1].trim(), length: Number(match[2]) };
}

function parseOptionInner(type: string): string | undefined {
  const match = /^option<(.+)>$/i.exec(type);
  return match?.[1]?.trim();
}

function parseMapInner(
  type: string,
): { key: string; value: string } | undefined {
  const match = /^map<(.+)>$/i.exec(type);
  if (!match?.[1]) return undefined;
  const parts = splitTopLevel(match[1], ",");
  if (parts.length !== 2) throw new Error(`invalid map type: ${type}`);
  return { key: parts[0]!.trim(), value: parts[1]!.trim() };
}

function parseTupleInner(type: string): string[] | undefined {
  const match = /^tuple<(.+)>$/i.exec(type);
  if (!match?.[1]) return undefined;
  return splitTopLevel(match[1], ",").map((item) => item.trim());
}

function addressBytes(value: IdlArgValue): Uint8Array {
  if (value instanceof Signer) return value.address.bytes;
  if (isRecord(value) && value.address instanceof Address)
    return value.address.bytes;
  return Address.from(value as BytesLike | Address).bytes;
}

function virAddressBytes(value: IdlArgValue): Uint8Array {
  if (value instanceof VirSigner) return value.address.bytes;
  return VirAddress.from(value as BytesLike | VirAddress | Address).bytes;
}

function serializePublicKey(
  serializer: PostcardSerializer,
  value: IdlArgValue,
): void {
  const publicKey = PublicKey.from(value as BytesLike | PublicKey);
  switch (publicKey.kind) {
    case PublicKeyKind.SECP256K1:
      serializer.serializeEnumVariant(0);
      serializer.serializeFixedBytes(publicKey.bytes);
      return;
    case PublicKeyKind.ED25519:
      serializer.serializeEnumVariant(1);
      serializer.serializeFixedBytes(publicKey.bytes);
      return;
    case PublicKeyKind.BLS12381:
      serializer.serializeEnumVariant(2);
      serializer.serializeFixedBytes(publicKey.bytes);
      return;
    case PublicKeyKind.FN_DSA512:
      serializer.serializeEnumVariant(3);
      serializer.serializeFixedBytes(publicKey.bytes);
      return;
    case PublicKeyKind.KEYLESS_DERIVED:
      serializer.serializeEnumVariant(4);
      serializer.serializeFixedBytes(publicKey.bytes);
      return;
  }
}

function deserializePublicKey(deserializer: PostcardDeserializer): PublicKey {
  const variant = deserializer.deserializeEnumVariant();
  switch (variant) {
    case 0:
      return new PublicKey(
        PublicKeyKind.SECP256K1,
        deserializer.deserializeFixedBytes(33),
      );
    case 1:
      return new PublicKey(
        PublicKeyKind.ED25519,
        deserializer.deserializeFixedBytes(32),
      );
    case 2:
      return new PublicKey(
        PublicKeyKind.BLS12381,
        deserializer.deserializeFixedBytes(48),
      );
    case 3:
      return new PublicKey(
        PublicKeyKind.FN_DSA512,
        deserializer.deserializeFixedBytes(897),
      );
    case 4:
      return new PublicKey(
        PublicKeyKind.KEYLESS_DERIVED,
        deserializer.deserializeFixedBytes(32),
      );
    default:
      throw new Error(`invalid PublicKey variant: ${variant}`);
  }
}

function serializeSignature(
  serializer: PostcardSerializer,
  value: IdlArgValue,
): void {
  const signature = Signature.from(value as BytesLike | Signature);
  switch (signature.kind) {
    case SignatureKind.SECP256K1:
      serializer.serializeEnumVariant(0);
      break;
    case SignatureKind.ED25519:
      serializer.serializeEnumVariant(1);
      break;
    case SignatureKind.BLS12381:
      serializer.serializeEnumVariant(2);
      break;
    case SignatureKind.FN_DSA512:
      serializer.serializeEnumVariant(3);
      break;
  }
  serializer.serializeFixedBytes(signature.bytes);
}

function deserializeSignature(deserializer: PostcardDeserializer): Signature {
  const variant = deserializer.deserializeEnumVariant();
  switch (variant) {
    case 0:
      return new Signature(
        SignatureKind.SECP256K1,
        deserializer.deserializeFixedBytes(65),
      );
    case 1:
      return new Signature(
        SignatureKind.ED25519,
        deserializer.deserializeFixedBytes(64),
      );
    case 2:
      return new Signature(
        SignatureKind.BLS12381,
        deserializer.deserializeFixedBytes(96),
      );
    case 3:
      return new Signature(
        SignatureKind.FN_DSA512,
        deserializer.deserializeFixedBytes(666),
      );
    default:
      throw new Error(`invalid Signature variant: ${variant}`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function splitTopLevel(value: string, separator: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if (char === "<") depth += 1;
    if (char === ">") depth -= 1;
    if (char === separator && depth === 0) {
      parts.push(value.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(value.slice(start));
  return parts;
}

function mapEntries(value: IdlArgValue): Array<[unknown, unknown]> {
  if (value instanceof Map) return Array.from(value.entries());
  if (Array.isArray(value)) return value as Array<[unknown, unknown]>;
  if (isRecord(value)) return Object.entries(value);
  throw new TypeError("map expects a Map, entry array, or object");
}

function tupleValues(value: IdlArgValue, length: number): unknown[] {
  if (Array.isArray(value)) {
    if (value.length !== length)
      throw new Error(`tuple expects ${length} values`);
    return value;
  }
  if (isRecord(value)) {
    return Array.from({ length }, (_, index) => {
      const key = String(index);
      if (!(key in value)) throw new Error(`missing tuple field: ${key}`);
      return value[key];
    });
  }
  throw new TypeError("tuple expects an array or object");
}

function toFixedArrayBytes(
  value: IdlArgValue,
  length: number,
  type: string,
): Uint8Array {
  const bytes =
    value instanceof Uint8Array
      ? value
      : Array.isArray(value)
        ? Uint8Array.from(value as number[])
        : undefined;
  if (!bytes || bytes.length !== length)
    throw new TypeError(`${type} expects ${length} bytes`);
  return bytes;
}

function serializeInstructionDiscriminator(
  serializer: PostcardSerializer,
  discriminator: number,
): void {
  if (
    !Number.isInteger(discriminator) ||
    discriminator < 0 ||
    discriminator > 0xffff
  ) {
    throw new RangeError("IDL discriminator out of u16 range");
  }
  serializer.serializeFixedBytes(
    Uint8Array.of(discriminator & 0xff, discriminator >> 8),
  );
}

function deserializeInstructionDiscriminator(
  deserializer: PostcardDeserializer,
): number {
  const bytes = deserializer.deserializeFixedBytes(2);
  return bytes[0]! | (bytes[1]! << 8);
}

function enumVariantInput(value: IdlArgValue): {
  name: string;
  value: unknown;
} {
  if (typeof value === "string") return { name: value, value: undefined };
  if (!isRecord(value))
    throw new TypeError("enum expects a variant string or object");
  if (typeof value.variant === "string") {
    return { name: value.variant, value: value.value ?? value.fields ?? {} };
  }
  const entries = Object.entries(value);
  if (entries.length !== 1)
    throw new Error("enum object must contain exactly one variant");
  return { name: entries[0]![0], value: entries[0]![1] };
}

export { IdlRegistry } from "./manager";
/** @deprecated Use IdlRegistry. */
export { IdlRegistry as IdlManager } from "./manager";
export { decodeTransactionResponse } from "./transaction-response";
export type {
  DecodedEvent,
  DecodedResource,
  DecodedToken,
  DecodedTokenField,
} from "./transaction-response";
export {
  assertTypeTag,
  prefixTypeTag,
  typeTagForType,
  typeTagsEqual,
  type TypeTagLike,
} from "./type-tag";
export type {
  DecodeAnySerializeOptions,
  DecodeViewRequest,
  DecodedAnySerializeValue,
  DecodedHistoryEvent,
  DecodedHistoryInstruction,
  DecodedTransactionHistory,
  DetectedViewCandidate,
  DetectViewOptions,
  RegisteredIdl,
} from "./manager";

const IDL_WIRE_TYPE_ALIASES: Readonly<Record<string, string>> = {
  Amount: "u64",
  Bitmap64: "u64",
  bytes: "vec<u8>",
  Epoch: "u64",
  HashValue: "array<u8;32>",
  ValidatorIndex: "u16",
};

const LEGACY_TYPE_TAGS: Readonly<
  Record<string, Readonly<Record<string, readonly TypeTagLike[]>>>
> = {
  identity: {
    "vec<AcceptedVcIssuer>": ["13839084772846465265"],
    // Rust stores _DisclosedVcSchemas as Vec<String>. AnySerialize derives
    // its tag from the fully-qualified Rust type name
    // `alloc::vec::Vec<alloc::string::String>`, not the IDL spelling.
    "vec<String>": ["2316261776970198819"],
  },
  token: {
    ComplianceConfig: ["17733527987326700707", "17733527987326702000"],
    ComplianceMode: ["1284676987096531200"],
    CredentialRequirement: ["10111931420570153000"],
    Metadata: ["4097244850999168859"],
  },
};

function legacyTypeTagsFor(
  appName: string | undefined,
  typeName: string,
): readonly TypeTagLike[] {
  if (!appName) return [];
  return LEGACY_TYPE_TAGS[appName]?.[typeName] ?? [];
}
