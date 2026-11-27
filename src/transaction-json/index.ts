import {
  Address,
  PublicKey,
  PublicKeyKind,
  Signature,
  SignatureKind,
  Signer,
  VirAddress,
  VirSigner,
  bs58ToBytes,
  bytesToHex,
  hexToBytes,
  type BytesLike,
} from "../crypto/index";
import {
  DEFAULT_IDLS,
  IdlRegistry,
  type IdlArgValue,
  type IdlInstruction,
  type IdlStructType,
  type MilonIdl,
  type RegisteredIdl,
} from "../idl/index";
import {
  AccountSignature,
  Transaction,
} from "../transaction/index";
import { ClientHandler } from "../executor/index";
import { PostcardSerializer } from "../postcard/index";
import { Network, NetworkToChainId } from "../utils/network";
import { RpcMethodEnum } from "../utils/method";

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface JsonInstruction {
  app?: string | number;
  method: string;
  args: Record<string, JsonValue>;
}

export interface JsonSignatureValue {
  kind: SignatureKind;
  hex: string;
}

export interface JsonPublicKeyValue {
  kind: PublicKeyKind;
  hex: string;
}

export interface JsonAccountSignature {
  owner: string;
  authBit: string;
  sigBit: string;
  signatures: JsonSignatureValue[];
  publicKey: JsonPublicKeyValue | null;
}

export interface JsonTransaction {
  stamp: string | number;
  payer: string | null;
  instructions: JsonInstruction[];
  chainId: string | number;
  signatures?: JsonAccountSignature[];
}

export interface JsonTransactionEnvelope {
  version?: 1;
  app?: string | number;
  tx: JsonTransaction;
}

export interface JsonViewEnvelope {
  version?: 1;
  app?: string | number;
  instructions: JsonInstruction[];
}

export interface TransactionJsonCodecOptions {
  idls?: readonly MilonIdl[];
  allowUnknownFields?: boolean;
}

export interface DecodeJsonPostcardOptions {
  chainId: bigint | number | string;
}

export type TransactionJsonErrorCode =
  | "INVALID_JSON"
  | "UNSUPPORTED_VERSION"
  | "INVALID_SCHEMA"
  | "IDL_NOT_REGISTERED"
  | "METHOD_NOT_FOUND"
  | "METHOD_NOT_ENTRY"
  | "METHOD_NOT_VIEW"
  | "MISSING_ARGUMENT"
  | "UNKNOWN_ARGUMENT"
  | "INVALID_ARGUMENT_TYPE"
  | "UNSAFE_INTEGER"
  | "INVALID_ADDRESS"
  | "INVALID_BYTES"
  | "INVALID_SIGNATURE"
  | "DUPLICATE_SIGNATURE_OWNER"
  | "UNKNOWN_INSTRUCTION"
  | "WIRE_VALIDATION_FAILED";

export class TransactionJsonError extends Error {
  readonly code: TransactionJsonErrorCode;
  readonly path: string;
  readonly cause: unknown;

  constructor(
    code: TransactionJsonErrorCode,
    path: string,
    message: string,
    cause?: unknown,
  ) {
    super(`${path}: ${message}`);
    this.name = "TransactionJsonError";
    this.code = code;
    this.path = path;
    this.cause = cause;
  }
}

export class TransactionJsonCodec {
  private readonly registry: IdlRegistry;
  private readonly allowUnknownFields: boolean;

  constructor({
    idls = DEFAULT_IDLS as unknown as readonly MilonIdl[],
    allowUnknownFields = false,
  }: TransactionJsonCodecOptions = {}) {
    this.registry = new IdlRegistry(idls);
    this.allowUnknownFields = allowUnknownFields;
  }

  /**
   * Converts a DApp JSON transaction into a Transaction using registered IDLs.
   * Large integers must be decimal strings when they exceed JS safe integer range.
   */
  fromJson(input: string | JsonTransactionEnvelope): Transaction {
    const envelope = this.parseEnvelope(input);
    this.assertKnownFields(envelope, ["version", "app", "tx"], "$");
    const txValue = requireRecord(envelope.tx, "$.tx");
    this.assertKnownFields(
      txValue,
      ["stamp", "payer", "instructions", "chainId", "signatures"],
      "$.tx",
    );
    const stamp = parseU64(txValue.stamp, "$.tx.stamp");
    const chainId = parseU64(txValue.chainId, "$.tx.chainId");
    const payer = txValue.payer === null
      ? null
      : parseAddress(txValue.payer, "$.tx.payer");
    const instructionValues = requireArray(
      txValue.instructions,
      "$.tx.instructions",
    );
    if (instructionValues.length === 0) {
      fail("INVALID_SCHEMA", "$.tx.instructions", "must not be empty");
    }

    const instructions = this.encodeInstructions(
      instructionValues,
      envelope.app,
      "$.tx.instructions",
      "transaction",
    );

    const tx = new Transaction({
      stamp,
      payer,
      instructions,
      chainId,
    });
    const signatures = txValue.signatures === undefined
      ? []
      : requireArray(txValue.signatures, "$.tx.signatures");
    signatures.forEach((value, index) => {
      const path = `$.tx.signatures[${index}]`;
      const [owner, signature] = this.inputAccountSignature(value, path);
      try {
        tx.addSignature(owner, signature);
      } catch (error) {
        const code = error instanceof Error &&
            error.message === "duplicate signature owner"
          ? "DUPLICATE_SIGNATURE_OWNER"
          : "INVALID_SIGNATURE";
        rethrow(error, code, `${path}.owner`, "failed to add signature");
      }
    });
    return tx;
  }

  /**
   * Converts View JSON into IDL-encoded instruction bytes. Pass this result as
   * the body of ClientHandler.request({ method: RpcMethodEnum.view, ... }).
   */
  viewFromJson(input: string | JsonViewEnvelope): Uint8Array[] {
    const envelope = this.parseJsonObject(input);
    this.assertVersion(envelope);
    this.assertKnownFields(envelope, ["version", "app", "instructions"], "$");
    if (!("instructions" in envelope)) {
      fail("INVALID_SCHEMA", "$.instructions", "instructions is required");
    }
    const instructionValues = requireArray(
      envelope.instructions,
      "$.instructions",
    );
    if (instructionValues.length === 0) {
      fail("INVALID_SCHEMA", "$.instructions", "must not be empty");
    }
    return this.encodeInstructions(
      instructionValues,
      envelope.app,
      "$.instructions",
      "view",
    );
  }

  /**
   * Converts View JSON into the postcard-encoded Vec<instruction bytes> used
   * as the invoke view request body.
   */
  viewJsonToPostcard(input: string | JsonViewEnvelope): Uint8Array {
    const instructions = this.viewFromJson(input);
    const serializer = new PostcardSerializer();
    serializer.serializeU32(instructions.length);
    for (const instruction of instructions) {
      serializer.serializeBytes(instruction);
    }
    return serializer.toUint8Array();
  }

  /**
   * Converts a Transaction into canonical JSON, decoding every instruction
   * through its registered app IDL.
   */
  toJson(transaction: Transaction): JsonTransactionEnvelope {
    if (!(transaction instanceof Transaction)) {
      fail("INVALID_SCHEMA", "$", "transaction must be a Transaction");
    }

    const decodedInstructions = transaction.instructions.map(
      (bytes, index): JsonInstruction => {
        const appId = bytes[0];
        if (appId === undefined) {
          fail(
            "UNKNOWN_INSTRUCTION",
            `$.tx.instructions[${index}]`,
            "instruction is empty",
          );
        }
        const registered = this.resolveApp(
          appId,
          `$.tx.instructions[${index}].app`,
        );
        try {
          const decoded = registered.provider.decodeAny(bytes);
          return {
            app: registered.name,
            method: decoded.method,
            args: this.outputArgs(
              registered,
              decoded.instruction,
              decoded.args,
              `$.tx.instructions[${index}].args`,
            ),
          };
        } catch (error) {
          rethrow(
            error,
            "UNKNOWN_INSTRUCTION",
            `$.tx.instructions[${index}]`,
            `failed to decode instruction for app ${registered.name}`,
          );
        }
      },
    );

    const appNames = new Set(decodedInstructions.map((item) => item.app));
    return {
      version: 1,
      ...(appNames.size === 1
        ? { app: decodedInstructions[0]!.app }
        : {}),
      tx: {
        stamp: transaction.stamp.toString(),
        payer: transaction.payer?.toBase58() ?? null,
        instructions: decodedInstructions,
        chainId: transaction.chainId.toString(),
        signatures: transaction.signatures.map(([owner, signature]) => ({
          owner: owner.toBase58(),
          authBit: signature.authBit.toString(),
          sigBit: signature.sigBit.toString(),
          signatures: signature.signatures.map((entry) => ({
            kind: entry.kind,
            hex: entry.toHex(),
          })),
          publicKey: signature.publicKey
            ? {
                kind: signature.publicKey.kind,
                hex: signature.publicKey.toHex(),
              }
            : null,
        })),
      },
    };
  }

  /** Serializes canonical transaction JSON with optional indentation. */
  stringify(transaction: Transaction, space?: number): string {
    return JSON.stringify(this.toJson(transaction), null, space);
  }

  /**
   * Decodes postcard transaction bytes directly to canonical JSON.
   * chainId is required because it is not included in postcard transaction bytes.
   */
  fromPostcard(
    bytes: BytesLike,
    { chainId }: DecodeJsonPostcardOptions,
  ): JsonTransactionEnvelope {
    try {
      return this.toJson(Transaction.fromPostcard(bytes, chainId));
    } catch (error) {
      rethrow(
        error,
        "INVALID_SCHEMA",
        "$",
        "failed to decode transaction postcard bytes",
      );
    }
  }

  private parseEnvelope(
    input: string | JsonTransactionEnvelope,
  ): Record<string, unknown> {
    const envelope = this.parseJsonObject(input);
    this.assertVersion(envelope);
    if (!("tx" in envelope)) {
      fail("INVALID_SCHEMA", "$.tx", "tx is required");
    }
    return envelope;
  }

  private parseJsonObject(
    input: string | JsonTransactionEnvelope | JsonViewEnvelope,
  ): Record<string, unknown> {
    let value: unknown = input;
    if (typeof input === "string") {
      try {
        value = JSON.parse(input);
      } catch (error) {
        rethrow(error, "INVALID_JSON", "$", "invalid JSON");
      }
    }
    return requireRecord(value, "$");
  }

  private assertVersion(envelope: Record<string, unknown>): void {
    if (envelope.version !== undefined && envelope.version !== 1) {
      fail(
        "UNSUPPORTED_VERSION",
        "$.version",
        `unsupported version: ${String(envelope.version)}`,
      );
    }
  }

  private encodeInstructions(
    values: unknown[],
    defaultApp: unknown,
    basePath: string,
    expectedKind: "transaction" | "view",
  ): Uint8Array[] {
    return values.map((value, index) => {
      const path = `${basePath}[${index}]`;
      const item = requireRecord(value, path);
      this.assertKnownFields(item, ["app", "method", "args"], path);
      const app = item.app ?? defaultApp;
      if (app === undefined) {
        fail("INVALID_SCHEMA", `${path}.app`, "app is required");
      }
      const registered = this.resolveApp(app, `${path}.app`);
      const method = requireString(item.method, `${path}.method`);
      const instruction = this.resolveInstruction(
        registered,
        method,
        `${path}.method`,
      );
      const isExpectedKind = expectedKind === "view"
        ? instruction.kind === "view"
        : instruction.kind === "entry" || instruction.kind === "write";
      if (!isExpectedKind) {
        const code = expectedKind === "view"
          ? "METHOD_NOT_VIEW"
          : "METHOD_NOT_ENTRY";
        fail(
          code,
          `${path}.method`,
          `${registered.name}.${method} is not a ${expectedKind} instruction`,
        );
      }
      const args = requireRecord(item.args, `${path}.args`);
      const normalized = this.inputArgs(
        registered,
        instruction,
        args,
        `${path}.args`,
      );
      try {
        return registered.provider.method(method).encode(normalized);
      } catch (error) {
        rethrow(
          error,
          "INVALID_ARGUMENT_TYPE",
          `${path}.args`,
          `failed to encode ${registered.name}.${method}`,
        );
      }
    });
  }

  private assertKnownFields(
    value: Record<string, unknown>,
    knownFields: readonly string[],
    path: string,
  ): void {
    if (this.allowUnknownFields) return;
    const known = new Set(knownFields);
    const unknown = Object.keys(value).find((name) => !known.has(name));
    if (unknown) {
      fail("UNKNOWN_ARGUMENT", `${path}.${unknown}`, "unknown field");
    }
  }

  private resolveApp(value: unknown, path: string): RegisteredIdl {
    const candidates = this.registry.list();
    const registered = typeof value === "number"
      ? candidates.find((item) => item.appId === value)
      : typeof value === "string"
        ? candidates.find((item) => {
            const normalized = value.toLowerCase();
            return item.name.toLowerCase() === normalized ||
              `${item.name}-${item.appId}`.toLowerCase() === normalized ||
              String(item.appId) === normalized;
          })
        : undefined;
    if (!registered) {
      fail("IDL_NOT_REGISTERED", path, `IDL app not registered: ${String(value)}`);
    }
    return registered;
  }

  private resolveInstruction(
    registered: RegisteredIdl,
    method: string,
    path: string,
  ): IdlInstruction {
    try {
      return registered.provider.getInstruction(method);
    } catch (error) {
      rethrow(
        error,
        "METHOD_NOT_FOUND",
        path,
        `IDL method not found: ${registered.name}.${method}`,
      );
    }
  }

  private inputArgs(
    registered: RegisteredIdl,
    instruction: IdlInstruction,
    args: Record<string, unknown>,
    path: string,
  ): Record<string, IdlArgValue> {
    const known = new Set(instruction.args.map((arg) => arg.name));
    if (!this.allowUnknownFields) {
      this.assertKnownFields(args, [...known], path);
    }
    const output: Record<string, IdlArgValue> = {};
    for (const arg of instruction.args) {
      if (!(arg.name in args)) {
        fail(
          "MISSING_ARGUMENT",
          `${path}.${arg.name}`,
          "missing required argument",
        );
      }
      output[arg.name] = this.inputValue(
        registered,
        arg.type,
        args[arg.name],
        `${path}.${arg.name}`,
      );
    }
    return output;
  }

  private outputArgs(
    registered: RegisteredIdl,
    instruction: IdlInstruction,
    args: Record<string, IdlArgValue>,
    path: string,
  ): Record<string, JsonValue> {
    const output: Record<string, JsonValue> = {};
    for (const arg of instruction.args) {
      output[arg.name] = this.outputValue(
        registered,
        arg.type,
        args[arg.name],
        `${path}.${arg.name}`,
      );
    }
    return output;
  }

  private inputValue(
    registered: RegisteredIdl,
    type: string,
    value: unknown,
    path: string,
  ): IdlArgValue {
    try {
      return this.inputValueUnsafe(registered, type.trim(), value, path);
    } catch (error) {
      if (error instanceof TransactionJsonError) throw error;
      rethrow(
        error,
        "INVALID_ARGUMENT_TYPE",
        path,
        `invalid ${type} value`,
      );
    }
  }

  private inputValueUnsafe(
    registered: RegisteredIdl,
    type: string,
    value: unknown,
    path: string,
  ): IdlArgValue {
    const normalizedType = TYPE_ALIASES[type] ?? type;
    const array = parseArray(normalizedType);
    if (array) {
      if (array.inner === "u8") {
        return parseBytes(value, path, array.length);
      }
      const values = requireArray(value, path);
      if (values.length !== array.length) {
        fail(
          "INVALID_ARGUMENT_TYPE",
          path,
          `expected ${array.length} items`,
        );
      }
      return values.map((item, index) =>
        this.inputValue(
          registered,
          array.inner,
          item,
          `${path}[${index}]`,
        )
      );
    }

    const vec = parseGeneric(normalizedType, "vec");
    if (vec) {
      if (vec === "u8") return parseBytes(value, path);
      return requireArray(value, path).map((item, index) =>
        this.inputValue(registered, vec, item, `${path}[${index}]`)
      );
    }
    const option = parseGeneric(normalizedType, "option");
    if (option) {
      return value === null || value === undefined
        ? undefined
        : this.inputValue(registered, option, value, path);
    }
    const tuple = parseTypeList(normalizedType, "tuple");
    if (tuple) {
      const values = requireArray(value, path);
      if (values.length !== tuple.length) {
        fail(
          "INVALID_ARGUMENT_TYPE",
          path,
          `expected ${tuple.length} tuple items`,
        );
      }
      return tuple.map((itemType, index) =>
        this.inputValue(
          registered,
          itemType,
          values[index],
          `${path}[${index}]`,
        )
      );
    }
    const map = parseTypeList(normalizedType, "map");
    if (map) {
      if (map.length !== 2) {
        fail("INVALID_ARGUMENT_TYPE", path, `invalid map type: ${type}`);
      }
      return requireArray(value, path).map((entry, index) => {
        const pair = requireArray(entry, `${path}[${index}]`);
        if (pair.length !== 2) {
          fail(
            "INVALID_ARGUMENT_TYPE",
            `${path}[${index}]`,
            "map entry must contain key and value",
          );
        }
        return [
          this.inputValue(
            registered,
            map[0]!,
            pair[0],
            `${path}[${index}][0]`,
          ),
          this.inputValue(
            registered,
            map[1]!,
            pair[1],
            `${path}[${index}][1]`,
          ),
        ];
      });
    }

    const definition = registered.idl.types?.find(
      (item) => item.name === normalizedType,
    );
    if (definition?.kind === "struct") {
      const record = requireRecord(value, path);
      return this.inputFields(
        registered,
        definition.fields ?? [],
        record,
        path,
      );
    }
    if (definition?.kind === "enum") {
      return this.inputEnum(registered, definition, value, path);
    }

    switch (normalizedType) {
      case "Address":
        return parseAddress(value, path);
      case "Signer":
      case "AnySigner":
        return new Signer(parseAddress(value, path));
      case "VirAddress":
        return parseVirAddress(value, path);
      case "VirSigner":
        return new VirSigner(parseVirAddress(value, path));
      case "PublicKey":
        return parsePublicKey(value, path);
      case "B96":
        return parseBytes(value, path, 12);
      case "B144":
        return parseBytes(value, path, 18);
      case "B256":
        return parseBytes(value, path, 32);
      case "u8":
        return parseInteger(value, path, 0n, 0xffn, false);
      case "u16":
        return parseInteger(value, path, 0n, 0xffffn, false);
      case "u32":
        return parseInteger(value, path, 0n, 0xffff_ffffn, false);
      case "i8":
        return parseInteger(value, path, -128n, 127n, false);
      case "i16":
        return parseInteger(value, path, -32768n, 32767n, false);
      case "i32":
        return parseInteger(
          value,
          path,
          -2147483648n,
          2147483647n,
          false,
        );
      case "u64":
      case "Bitmap64":
        return parseInteger(value, path, 0n, 0xffff_ffff_ffff_ffffn, true);
      case "u128":
        return parseInteger(value, path, 0n, (1n << 128n) - 1n, true);
      case "i64":
        return parseInteger(
          value,
          path,
          -(1n << 63n),
          (1n << 63n) - 1n,
          true,
        );
      case "String":
      case "string":
        return requireString(value, path);
      case "bool":
      case "boolean":
        if (typeof value !== "boolean") {
          fail("INVALID_ARGUMENT_TYPE", path, "expected boolean");
        }
        return value;
      default:
        fail(
          "INVALID_ARGUMENT_TYPE",
          path,
          `unsupported IDL type: ${normalizedType}`,
        );
    }
  }

  private outputValue(
    registered: RegisteredIdl,
    type: string,
    value: IdlArgValue,
    path: string,
  ): JsonValue {
    const normalizedType = TYPE_ALIASES[type.trim()] ?? type.trim();
    const array = parseArray(normalizedType);
    if (array) {
      if (array.inner === "u8") return formatBytes(value, path);
      return requireArray(value, path).map((item, index) =>
        this.outputValue(
          registered,
          array.inner,
          item,
          `${path}[${index}]`,
        )
      );
    }
    const vec = parseGeneric(normalizedType, "vec");
    if (vec) {
      if (vec === "u8") return formatBytes(value, path);
      return requireArray(value, path).map((item, index) =>
        this.outputValue(registered, vec, item, `${path}[${index}]`)
      );
    }
    const option = parseGeneric(normalizedType, "option");
    if (option) {
      return value === undefined || value === null
        ? null
        : this.outputValue(registered, option, value, path);
    }
    const tuple = parseTypeList(normalizedType, "tuple");
    if (tuple) {
      const values = requireArray(value, path);
      return tuple.map((itemType, index) =>
        this.outputValue(
          registered,
          itemType,
          values[index],
          `${path}[${index}]`,
        )
      );
    }
    const map = parseTypeList(normalizedType, "map");
    if (map) {
      return requireArray(value, path).map((entry, index) => {
        const pair = requireArray(entry, `${path}[${index}]`);
        return [
          this.outputValue(
            registered,
            map[0]!,
            pair[0],
            `${path}[${index}][0]`,
          ),
          this.outputValue(
            registered,
            map[1]!,
            pair[1],
            `${path}[${index}][1]`,
          ),
        ];
      });
    }

    const definition = registered.idl.types?.find(
      (item) => item.name === normalizedType,
    );
    if (definition?.kind === "struct") {
      return this.outputFields(
        registered,
        definition.fields ?? [],
        requireRecord(value, path),
        path,
      );
    }
    if (definition?.kind === "enum") {
      return this.outputEnum(registered, definition, value, path);
    }

    switch (normalizedType) {
      case "Address":
        return Address.from(value as Address).toBase58();
      case "Signer":
      case "AnySigner":
        return (value instanceof Signer
          ? value.address
          : Address.from(value as Address)).toBase58();
      case "VirAddress":
      case "VirSigner": {
        const address = value instanceof VirSigner
          ? value.address
          : VirAddress.from(value as VirAddress);
        return {
          primary: address.primary.toBase58(),
          no: address.no,
        };
      }
      case "PublicKey": {
        const publicKey = PublicKey.from(value as PublicKey);
        return { kind: publicKey.kind, hex: publicKey.toHex() };
      }
      case "B96":
      case "B144":
      case "B256":
        return formatBytes(value, path);
      case "u64":
      case "u128":
      case "i64":
      case "Bitmap64":
        return BigInt(value as bigint | number | string).toString();
      case "u8":
      case "u16":
      case "u32":
      case "i8":
      case "i16":
      case "i32":
        return Number(value);
      case "String":
      case "string":
        return String(value);
      case "bool":
      case "boolean":
        return Boolean(value);
      default:
        fail(
          "INVALID_ARGUMENT_TYPE",
          path,
          `unsupported IDL type: ${normalizedType}`,
        );
    }
  }

  private inputFields(
    registered: RegisteredIdl,
    fields: Array<{ name: string; type: string }>,
    value: Record<string, unknown>,
    path: string,
  ): Record<string, IdlArgValue> {
    const known = new Set(fields.map((field) => field.name));
    if (!this.allowUnknownFields) {
      this.assertKnownFields(value, [...known], path);
    }
    const result: Record<string, IdlArgValue> = {};
    for (const field of fields) {
      if (!(field.name in value)) {
        fail(
          "MISSING_ARGUMENT",
          `${path}.${field.name}`,
          "missing struct field",
        );
      }
      result[field.name] = this.inputValue(
        registered,
        field.type,
        value[field.name],
        `${path}.${field.name}`,
      );
    }
    return result;
  }

  private outputFields(
    registered: RegisteredIdl,
    fields: Array<{ name: string; type: string }>,
    value: Record<string, unknown>,
    path: string,
  ): Record<string, JsonValue> {
    const result: Record<string, JsonValue> = {};
    for (const field of fields) {
      result[field.name] = this.outputValue(
        registered,
        field.type,
        value[field.name],
        `${path}.${field.name}`,
      );
    }
    return result;
  }

  private inputEnum(
    registered: RegisteredIdl,
    definition: IdlStructType,
    value: unknown,
    path: string,
  ): IdlArgValue {
    const name = typeof value === "string"
      ? value
      : requireString(requireRecord(value, path).variant, `${path}.variant`);
    const variant = definition.variants?.find(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    );
    if (!variant) {
      fail(
        "INVALID_ARGUMENT_TYPE",
        path,
        `unknown enum variant ${definition.name}.${name}`,
      );
    }
    if (variant.kind === "unit") return variant.name;
    const rawValue = requireRecord(value, path).value;
    if (variant.kind === "tuple") {
      const values = requireArray(rawValue, `${path}.value`);
      return {
        variant: variant.name,
        value: variant.fields.map((field, index) =>
          this.inputValue(
            registered,
            field.type,
            values[index],
            `${path}.value[${index}]`,
          )
        ),
      };
    }
    return {
      variant: variant.name,
      value: this.inputFields(
        registered,
        variant.fields,
        requireRecord(rawValue, `${path}.value`),
        `${path}.value`,
      ),
    };
  }

  private outputEnum(
    registered: RegisteredIdl,
    definition: IdlStructType,
    value: unknown,
    path: string,
  ): JsonValue {
    if (typeof value === "string") return value;
    const record = requireRecord(value, path);
    const name = requireString(record.variant, `${path}.variant`);
    const variant = definition.variants?.find((item) => item.name === name);
    if (!variant) {
      fail(
        "INVALID_ARGUMENT_TYPE",
        path,
        `unknown enum variant ${definition.name}.${name}`,
      );
    }
    if (variant.kind === "unit") return variant.name;
    if (variant.kind === "tuple") {
      const values = requireArray(record.value, `${path}.value`);
      return {
        variant: name,
        value: variant.fields.map((field, index) =>
          this.outputValue(
            registered,
            field.type,
            values[index],
            `${path}.value[${index}]`,
          )
        ),
      };
    }
    return {
      variant: name,
      value: this.outputFields(
        registered,
        variant.fields,
        requireRecord(record.value, `${path}.value`),
        `${path}.value`,
      ),
    };
  }

  private inputAccountSignature(
    value: unknown,
    path: string,
  ): [Address, AccountSignature] {
    try {
      const record = requireRecord(value, path);
      this.assertKnownFields(
        record,
        ["owner", "authBit", "sigBit", "signatures", "publicKey"],
        path,
      );
      const owner = parseAddress(record.owner, `${path}.owner`);
      const authBit = parseU64(record.authBit, `${path}.authBit`);
      const sigBit = parseU64(record.sigBit, `${path}.sigBit`);
      const signatures = requireArray(
        record.signatures,
        `${path}.signatures`,
      ).map((entry, index) =>
        parseSignature(entry, `${path}.signatures[${index}]`)
      );
      const publicKey = record.publicKey === null
        ? null
        : parsePublicKey(record.publicKey, `${path}.publicKey`);
      return [
        owner,
        new AccountSignature({
          authBit,
          sigBit,
          signatures,
          publicKey,
        }),
      ];
    } catch (error) {
      if (error instanceof TransactionJsonError) throw error;
      rethrow(error, "INVALID_SIGNATURE", path, "invalid account signature");
    }
  }
}

/** Converts DApp JSON into a Transaction with a one-off codec. */
export function transactionFromJson(
  input: string | JsonTransactionEnvelope,
  options?: TransactionJsonCodecOptions,
): Transaction {
  return new TransactionJsonCodec(options).fromJson(input);
}

/** Converts a Transaction into canonical, IDL-decoded JSON. */
export function transactionToJson(
  transaction: Transaction,
  options?: TransactionJsonCodecOptions,
): JsonTransactionEnvelope {
  return new TransactionJsonCodec(options).toJson(transaction);
}

/** Converts a Transaction into a canonical JSON string. */
export function stringifyTransaction(
  transaction: Transaction,
  options?: TransactionJsonCodecOptions & { space?: number },
): string {
  const { space, ...codecOptions } = options ?? {};
  return new TransactionJsonCodec(codecOptions).stringify(transaction, space);
}

/** Converts View JSON into IDL-encoded instruction bytes. */
export function viewInstructionsFromJson(
  input: string | JsonViewEnvelope,
  options?: TransactionJsonCodecOptions,
): Uint8Array[] {
  return new TransactionJsonCodec(options).viewFromJson(input);
}

/** Converts View JSON into a postcard-encoded view request body. */
export function viewJsonToPostcard(
  input: string | JsonViewEnvelope,
  options?: TransactionJsonCodecOptions,
): Uint8Array {
  return new TransactionJsonCodec(options).viewJsonToPostcard(input);
}

/** Validates View JSON and executes it on the selected network. */
export async function executeViewJson(
  network: Network,
  input: string | JsonViewEnvelope,
  { codec = new TransactionJsonCodec() }: { codec?: TransactionJsonCodec } = {},
) {
  const instructions = codec.viewFromJson(input);
  if (instructions.length === 0) throw new Error("view request must contain an instruction");
  return new ClientHandler(network).request({
    method: instructions.length === 1 ? RpcMethodEnum.view : RpcMethodEnum.batch_view,
    body: instructions.length === 1 ? instructions[0] : instructions,
  });
}

/**
 * Validates and submits transaction JSON to the selected network.
 * This helper never signs transactions and never accepts private keys.
 */
export async function submitTransactionJson(
  network: Network,
  input: string | JsonTransactionEnvelope,
  {
    codec = new TransactionJsonCodec(),
    sponsorIx = [],
  }: {
    codec?: TransactionJsonCodec;
    sponsorIx?: number[];
  } = {},
) {
  const tx = codec.fromJson(input);
  if (tx.chainId !== BigInt(NetworkToChainId[network])) {
    fail(
      "WIRE_VALIDATION_FAILED",
      "$.tx.chainId",
      `chainId ${tx.chainId} does not match ${network}`,
    );
  }
  try {
    tx.validateWire(sponsorIx);
  } catch (error) {
    rethrow(
      error,
      "WIRE_VALIDATION_FAILED",
      "$.tx",
      "transaction wire validation failed",
    );
  }
  return new ClientHandler(network).request({
    method: RpcMethodEnum.submit_tx,
    body: tx.postcardToBytes(),
  });
}

const TYPE_ALIASES: Readonly<Record<string, string>> = {
  Amount: "u64",
  Bitmap64: "u64",
  bytes: "vec<u8>",
  Epoch: "u64",
  HashValue: "array<u8;32>",
  ValidatorIndex: "u16",
};

function parseAddress(value: unknown, path: string): Address {
  const encoded = requireString(value, path);
  try {
    return new Address(bs58ToBytes(encoded));
  } catch (error) {
    rethrow(error, "INVALID_ADDRESS", path, "expected a 20-byte Base58 address");
  }
}

function parseVirAddress(value: unknown, path: string): VirAddress {
  const record = requireRecord(value, path);
  const no = parseInteger(record.no, `${path}.no`, 0n, 0xffff_ffffn, false);
  return new VirAddress(
    parseAddress(record.primary, `${path}.primary`),
    Number(no),
  );
}

function parsePublicKey(value: unknown, path: string): PublicKey {
  const record = requireRecord(value, path);
  const kind = requireString(record.kind, `${path}.kind`) as PublicKeyKind;
  const hex = requireString(record.hex, `${path}.hex`);
  if (!Object.values(PublicKeyKind).includes(kind)) {
    fail("INVALID_SIGNATURE", `${path}.kind`, `invalid public key kind: ${kind}`);
  }
  try {
    return new PublicKey(kind, hexToBytes(hex));
  } catch (error) {
    rethrow(error, "INVALID_SIGNATURE", path, "invalid public key");
  }
}

function parseSignature(value: unknown, path: string): Signature {
  const record = requireRecord(value, path);
  const kind = requireString(record.kind, `${path}.kind`) as SignatureKind;
  const hex = requireString(record.hex, `${path}.hex`);
  if (!Object.values(SignatureKind).includes(kind)) {
    fail("INVALID_SIGNATURE", `${path}.kind`, `invalid signature kind: ${kind}`);
  }
  try {
    return new Signature(kind, hexToBytes(hex));
  } catch (error) {
    rethrow(error, "INVALID_SIGNATURE", path, "invalid signature");
  }
}

function parseBytes(
  value: unknown,
  path: string,
  length?: number,
): Uint8Array {
  if (typeof value !== "string" || !/^0x[0-9a-f]*$/i.test(value)) {
    fail("INVALID_BYTES", path, "expected a 0x-prefixed hex string");
  }
  try {
    const bytes = hexToBytes(value);
    if (length !== undefined && bytes.length !== length) {
      fail("INVALID_BYTES", path, `expected ${length} bytes`);
    }
    return bytes;
  } catch (error) {
    if (error instanceof TransactionJsonError) throw error;
    rethrow(error, "INVALID_BYTES", path, "invalid hex bytes");
  }
}

function formatBytes(value: unknown, path: string): string {
  if (!(value instanceof Uint8Array)) {
    fail("INVALID_BYTES", path, "decoded value is not Uint8Array");
  }
  return `0x${bytesToHex(value)}`;
}

function parseU64(value: unknown, path: string): bigint {
  return BigInt(
    parseInteger(value, path, 0n, 0xffff_ffff_ffff_ffffn, true),
  );
}

function parseInteger(
  value: unknown,
  path: string,
  min: bigint,
  max: bigint,
  asBigInt: boolean,
): bigint | number {
  if (typeof value === "number" && !Number.isSafeInteger(value)) {
    fail("UNSAFE_INTEGER", path, "number must be a safe integer");
  }
  if (
    typeof value !== "number" &&
    (typeof value !== "string" || !/^-?\d+$/.test(value))
  ) {
    fail("INVALID_ARGUMENT_TYPE", path, "expected an integer");
  }
  const integer = BigInt(value);
  if (integer < min || integer > max) {
    fail(
      "INVALID_ARGUMENT_TYPE",
      path,
      `integer must be in ${min}..${max}`,
    );
  }
  return asBigInt ? integer : Number(integer);
}

function requireRecord(
  value: unknown,
  path: string,
): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail("INVALID_SCHEMA", path, "expected an object");
  }
  return value as Record<string, unknown>;
}

function requireArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    fail("INVALID_SCHEMA", path, "expected an array");
  }
  return value;
}

function requireString(value: unknown, path: string): string {
  if (typeof value !== "string") {
    fail("INVALID_SCHEMA", path, "expected a string");
  }
  return value;
}

function parseGeneric(type: string, name: string): string | undefined {
  const match = new RegExp(`^${name}<(.+)>$`, "i").exec(type);
  return match?.[1]?.trim();
}

function parseTypeList(type: string, name: string): string[] | undefined {
  const inner = parseGeneric(type, name);
  return inner === undefined ? undefined : splitTopLevel(inner);
}

function parseArray(
  type: string,
): { inner: string; length: number } | undefined {
  const match = /^array<(.+);(\d+)>$/i.exec(type);
  return match?.[1] && match[2]
    ? { inner: match[1].trim(), length: Number(match[2]) }
    : undefined;
}

function splitTopLevel(value: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === "<") depth += 1;
    if (char === ">") depth -= 1;
    if (char === "," && depth === 0) {
      result.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }
  result.push(value.slice(start).trim());
  return result;
}

function fail(
  code: TransactionJsonErrorCode,
  path: string,
  message: string,
): never {
  throw new TransactionJsonError(code, path, message);
}

function rethrow(
  error: unknown,
  code: TransactionJsonErrorCode,
  path: string,
  message: string,
): never {
  if (error instanceof TransactionJsonError) throw error;
  const detail = error instanceof Error ? `: ${error.message}` : "";
  throw new TransactionJsonError(code, path, `${message}${detail}`, error);
}
