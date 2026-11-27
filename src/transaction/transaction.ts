import { Address } from "../crypto/address";
import {
  assertBytes,
  bytesToHex,
  concatBytes,
  hexToBytes,
  u64ToBeBytes,
  type BytesLike,
  type U64Like,
} from "../crypto/bytes";
import { blake3Hash, HASH_CONTEXT } from "../crypto/hash";
import { PublicKey, PublicKeyKind } from "../crypto/public-key";
import { SecretKey } from "../crypto/secret-key";
import { Signature, SignatureKind } from "../crypto/signature";
import {
  AccountSignature,
  type AccountSignatureOptions,
} from "./account-signature";
import { TX_AUTH_DOMAIN, TX_HASH_DOMAIN } from "./hash-domain";
import { PackedInstruction } from "./packed-instruction";
import type { Deserializer as BcsDeserializer } from "../bcs/deserializer";
import { Serializer as BcsSerializer, serializeBcs } from "../bcs/serializer";
import {
  chainIdToBytes,
  resolveChainId,
  type ChainIdLike,
} from "../chain/index";
import {
  PostcardDeserializer,
  PostcardSerializer,
  serializePostcard,
} from "../postcard/index";

export type TxHash = Uint8Array;
export type TransactionSignatureInput = [
  Address | BytesLike,
  AccountSignature | AccountSignatureOptions,
];

export interface TransactionOptions {
  stamp?: U64Like;
  instructions?: Array<BytesLike | PackedInstruction>;
  signatures?: TransactionSignatureInput[];
  chainId?: ChainIdLike;
  payer?: Address | BytesLike | null;
}

export interface TransactionSignMode {
  /** Signing public key corresponding to `secretKey`; derived automatically when omitted. */
  publicKey?: PublicKey;
  /**
   * Index of the signer in the on-chain account's signer list.
   *
   * When set, the signature references the on-chain public key through `sigBit`,
   * so the key does not need to derive `owner` directly. Use this for added
   * signers, multisig accounts, and accounts whose keys have been rotated.
   */
  multisigKeyIndex?: number;
}

export type TransactionSignModeInput = PublicKey | TransactionSignMode;

type TransactionSignatureAlgorithm =
  | "ed25519"
  | "secp256k1"
  | "bls12381"
  | "fndsa512";

export class Transaction {
  readonly instructions: Uint8Array[];
  readonly stamp: bigint;
  readonly chainId: bigint;
  readonly signatures: Array<[Address, AccountSignature]>;
  payer: Address | null;

  static hash(
    stamp: U64Like,
    instructions: BytesLike[],
    chainId?: ChainIdLike,
    payer?: Address | BytesLike | null,
  ): TxHash {
    const packed = instructions.map((instruction) =>
      PackedInstruction.from(instruction),
    );
    const ixHashes = packed.map((instruction) => instruction.ixHash(chainId));
    return blake3Hash(
      concatBytes(
        HASH_CONTEXT,
        TX_HASH_DOMAIN,
        chainIdToBytes(chainId),
        u64ToBeBytes(stamp),
        ...(payer === undefined || payer === null
          ? []
          : [Address.from(payer).bytes]),
        ...ixHashes,
      ),
    );
  }

  constructor({
    stamp = BigInt(Date.now()),
    instructions = [],
    signatures = [],
    chainId,
    payer = null,
  }: TransactionOptions) {
    this.stamp = BigInt(stamp);
    this.instructions = instructions.map((instruction) =>
      PackedInstruction.from(instruction).toBytes(),
    );
    this.chainId = resolveChainId(chainId);
    this.payer = payer === null ? null : Address.from(payer);
    this.signatures = signatures.map(([address, signature]) => [
      Address.from(address),
      signature instanceof AccountSignature
        ? signature
        : new AccountSignature(signature),
    ]);
  }

  get hash(): TxHash {
    return this.txHash();
  }

  addSignature(
    address: Address | BytesLike,
    accountSignature: AccountSignature,
  ): this {
    if (!(accountSignature instanceof AccountSignature)) {
      throw new TypeError("accountSignature must be an AccountSignature");
    }
    const owner = Address.from(address);
    if (
      this.signatures.some(([existingOwner]) => existingOwner.equals(owner))
    ) {
      throw new Error("duplicate signature owner");
    }
    this.signatures.push([owner, accountSignature]);
    return this;
  }

  async signEd25519(
    address: Address | BytesLike,
    secretKey: SecretKey,
    mode: TransactionSignModeInput = {},
  ): Promise<this> {
    const owner = Address.from(address);
    const resolvedMode = normalizeTransactionSignMode(mode);
    const publicKey =
      resolvedMode.publicKey ?? (await secretKey.ed25519Public());
    const accountSignature = await this.signIxAndPayer(
      owner,
      secretKey,
      this.allIxIndexes(),
      owner,
      publicKey,
      "ed25519",
      resolvedMode.multisigKeyIndex,
    );
    return this.addSignature(owner, accountSignature);
  }

  async signSecp256k1(
    address: Address | BytesLike,
    secretKey: SecretKey,
    mode: TransactionSignModeInput = {},
  ): Promise<this> {
    const owner = Address.from(address);
    const resolvedMode = normalizeTransactionSignMode(mode);
    const publicKey =
      resolvedMode.publicKey ?? (await secretKey.secp256k1Public());
    const accountSignature = await this.signIxAndPayer(
      owner,
      secretKey,
      this.allIxIndexes(),
      owner,
      publicKey,
      "secp256k1",
      resolvedMode.multisigKeyIndex,
    );
    return this.addSignature(owner, accountSignature);
  }

  async signBls12381(
    address: Address | BytesLike,
    secretKey: SecretKey,
    mode: TransactionSignModeInput = {},
  ): Promise<this> {
    const owner = Address.from(address);
    const resolvedMode = normalizeTransactionSignMode(mode);
    const publicKey =
      resolvedMode.publicKey ?? (await secretKey.bls12381Public());
    const accountSignature = await this.signIxAndPayer(
      owner,
      secretKey,
      this.allIxIndexes(),
      owner,
      publicKey,
      "bls12381",
      resolvedMode.multisigKeyIndex,
    );
    return this.addSignature(owner, accountSignature);
  }

  async signFnDsa512(
    address: Address | BytesLike,
    secretKey: SecretKey,
    mode: TransactionSignModeInput = {},
  ): Promise<this> {
    const owner = Address.from(address);
    const resolvedMode = normalizeTransactionSignMode(mode);
    const publicKey =
      resolvedMode.publicKey ?? (await secretKey.fnDsa512Public());
    const accountSignature = await this.signIxAndPayer(
      owner,
      secretKey,
      this.allIxIndexes(),
      owner,
      publicKey,
      "fndsa512",
      resolvedMode.multisigKeyIndex,
    );
    return this.addSignature(owner, accountSignature);
  }

  ixHash(index: number): TxHash {
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= this.instructions.length
    ) {
      throw new RangeError("instruction index out of range");
    }
    return new PackedInstruction(this.instructions[index]!).ixHash(
      this.chainId,
    );
  }

  ixHashes(): TxHash[] {
    return this.instructions.map((_, index) => this.ixHash(index));
  }

  txHash(): TxHash {
    return Transaction.hash(
      this.stamp,
      this.instructions,
      this.chainId,
      this.payer,
    );
  }

  resolvePayer(): Address {
    if (this.payer) return this.payer;
    throw new Error("transaction has no unified payer");
  }

  validateWire(sponsorIx: Iterable<number> = []): void {
    if (this.instructions.length === 0)
      throw new Error("transaction instructions cannot be empty");
    if (this.instructions.length > AccountSignature.AUTH_VOTE_BIT)
      throw new Error("transaction cannot contain more than 62 instructions");

    const ixHashes = new Set<string>();
    for (const instruction of this.instructions) {
      const hash = new PackedInstruction(instruction)
        .validateLength()
        .ixHash(this.chainId);
      const key = Array.from(hash, (byte) =>
        byte.toString(16).padStart(2, "0"),
      ).join("");
      if (ixHashes.has(key)) throw new Error("duplicate instruction hash");
      ixHashes.add(key);
    }

    const owners = new Set<string>();
    for (const [owner, signature] of this.signatures) {
      const ownerKey = Array.from(owner.bytes).join(",");
      if (owners.has(ownerKey)) throw new Error("duplicate signature owner");
      owners.add(ownerKey);
      if (signature.authBit === 0n)
        throw new Error("signature auth bit cannot be empty");
      for (let index = 0; index < AccountSignature.AUTH_VOTE_BIT; index += 1) {
        if (
          (signature.authBit & (1n << BigInt(index))) !== 0n &&
          index >= this.instructions.length
        ) {
          throw new Error(
            `authorized instruction index out of range: ${index}`,
          );
        }
      }
    }

    if (this.payer) {
      const hasPayerSignature = this.signatures.some(
        ([owner, signature]) =>
          owner.equals(this.payer!) && signature.authorizesPayer(),
      );
      if (!hasPayerSignature) throw new Error("payer signature required");
      return;
    }

    const sponsored = new Set(sponsorIx);
    for (let index = 0; index < this.instructions.length; index += 1) {
      if (sponsored.has(index)) continue;
      const hasGasSigner = this.signatures.some(
        ([, signature]) =>
          signature.authorizesPayer() && signature.authorizesIx(index),
      );
      if (!hasGasSigner)
        throw new Error(`gas signer required for instruction ${index}`);
    }
    if (
      this.signatures.some(
        ([, signature]) =>
          signature.authorizesPayer() &&
          (signature.authBit & (AccountSignature.authPayer() - 1n)) === 0n,
      )
    ) {
      throw new Error("payer-only signature conflicts with split gas mode");
    }
  }

  async signIxesEd25519(
    owner: Address | BytesLike,
    secretKey: SecretKey,
    ixIndices: number[],
    includePayer = false,
    mode: TransactionSignMode = {},
  ): Promise<AccountSignature> {
    const publicKey = mode.publicKey ?? (await secretKey.ed25519Public());
    return this.signIxes(
      Address.from(owner),
      secretKey,
      ixIndices,
      includePayer,
      publicKey,
      "ed25519",
      mode.multisigKeyIndex,
    );
  }

  async signIxesSecp256k1(
    owner: Address | BytesLike,
    secretKey: SecretKey,
    ixIndices: number[],
    includePayer = false,
    mode: TransactionSignMode = {},
  ): Promise<AccountSignature> {
    const publicKey = mode.publicKey ?? (await secretKey.secp256k1Public());
    return this.signIxes(
      Address.from(owner),
      secretKey,
      ixIndices,
      includePayer,
      publicKey,
      "secp256k1",
      mode.multisigKeyIndex,
    );
  }

  async signIxesBls12381(
    owner: Address | BytesLike,
    secretKey: SecretKey,
    ixIndices: number[],
    includePayer = false,
    mode: TransactionSignMode = {},
  ): Promise<AccountSignature> {
    const publicKey = mode.publicKey ?? (await secretKey.bls12381Public());
    return this.signIxes(
      Address.from(owner),
      secretKey,
      ixIndices,
      includePayer,
      publicKey,
      "bls12381",
      mode.multisigKeyIndex,
    );
  }

  async signIxesFnDsa512(
    owner: Address | BytesLike,
    secretKey: SecretKey,
    ixIndices: number[],
    includePayer = false,
    mode: TransactionSignMode = {},
  ): Promise<AccountSignature> {
    const publicKey = mode.publicKey ?? (await secretKey.fnDsa512Public());
    return this.signIxes(
      Address.from(owner),
      secretKey,
      ixIndices,
      includePayer,
      publicKey,
      "fndsa512",
      mode.multisigKeyIndex,
    );
  }

  async signPayerEd25519(
    payer: Address | BytesLike,
    secretKey: SecretKey,
    mode: TransactionSignModeInput = {},
  ): Promise<AccountSignature> {
    const resolvedMode = normalizeTransactionSignMode(mode);
    const publicKey =
      resolvedMode.publicKey ?? (await secretKey.ed25519Public());
    return this.signPayer(
      Address.from(payer),
      secretKey,
      publicKey,
      "ed25519",
      resolvedMode.multisigKeyIndex,
    );
  }

  async signPayerSecp256k1(
    payer: Address | BytesLike,
    secretKey: SecretKey,
    mode: TransactionSignModeInput = {},
  ): Promise<AccountSignature> {
    const resolvedMode = normalizeTransactionSignMode(mode);
    const publicKey =
      resolvedMode.publicKey ?? (await secretKey.secp256k1Public());
    return this.signPayer(
      Address.from(payer),
      secretKey,
      publicKey,
      "secp256k1",
      resolvedMode.multisigKeyIndex,
    );
  }

  async signPayerBls12381(
    payer: Address | BytesLike,
    secretKey: SecretKey,
    mode: TransactionSignModeInput = {},
  ): Promise<AccountSignature> {
    const resolvedMode = normalizeTransactionSignMode(mode);
    const publicKey =
      resolvedMode.publicKey ?? (await secretKey.bls12381Public());
    return this.signPayer(
      Address.from(payer),
      secretKey,
      publicKey,
      "bls12381",
      resolvedMode.multisigKeyIndex,
    );
  }

  async signPayerFnDsa512(
    payer: Address | BytesLike,
    secretKey: SecretKey,
    mode: TransactionSignModeInput = {},
  ): Promise<AccountSignature> {
    const resolvedMode = normalizeTransactionSignMode(mode);
    const publicKey =
      resolvedMode.publicKey ?? (await secretKey.fnDsa512Public());
    return this.signPayer(
      Address.from(payer),
      secretKey,
      publicKey,
      "fndsa512",
      resolvedMode.multisigKeyIndex,
    );
  }

  async signIxEd25519(
    owner: Address | BytesLike,
    secretKey: SecretKey,
    ixIndexes: readonly number[],
    mode: TransactionSignModeInput = {},
  ): Promise<AccountSignature> {
    const resolvedMode = normalizeTransactionSignMode(mode);
    const publicKey =
      resolvedMode.publicKey ?? (await secretKey.ed25519Public());
    return this.signIxes(
      Address.from(owner),
      secretKey,
      ixIndexes,
      false,
      publicKey,
      "ed25519",
      resolvedMode.multisigKeyIndex,
    );
  }

  async signIxSecp256k1(
    owner: Address | BytesLike,
    secretKey: SecretKey,
    ixIndexes: readonly number[],
    mode: TransactionSignModeInput = {},
  ): Promise<AccountSignature> {
    const resolvedMode = normalizeTransactionSignMode(mode);
    const publicKey =
      resolvedMode.publicKey ?? (await secretKey.secp256k1Public());
    return this.signIxes(
      Address.from(owner),
      secretKey,
      ixIndexes,
      false,
      publicKey,
      "secp256k1",
      resolvedMode.multisigKeyIndex,
    );
  }

  async signIxBls12381(
    owner: Address | BytesLike,
    secretKey: SecretKey,
    ixIndexes: readonly number[],
    mode: TransactionSignModeInput = {},
  ): Promise<AccountSignature> {
    const resolvedMode = normalizeTransactionSignMode(mode);
    const publicKey =
      resolvedMode.publicKey ?? (await secretKey.bls12381Public());
    return this.signIxes(
      Address.from(owner),
      secretKey,
      ixIndexes,
      false,
      publicKey,
      "bls12381",
      resolvedMode.multisigKeyIndex,
    );
  }

  async signIxFnDsa512(
    owner: Address | BytesLike,
    secretKey: SecretKey,
    ixIndexes: readonly number[],
    mode: TransactionSignModeInput = {},
  ): Promise<AccountSignature> {
    const resolvedMode = normalizeTransactionSignMode(mode);
    const publicKey =
      resolvedMode.publicKey ?? (await secretKey.fnDsa512Public());
    return this.signIxes(
      Address.from(owner),
      secretKey,
      ixIndexes,
      false,
      publicKey,
      "fndsa512",
      resolvedMode.multisigKeyIndex,
    );
  }

  async signIxGasEd25519(
    owner: Address | BytesLike,
    secretKey: SecretKey,
    ixIndexes: readonly number[],
    mode: TransactionSignMode = {},
  ): Promise<AccountSignature> {
    return this.signIxesEd25519(owner, secretKey, [...ixIndexes], true, mode);
  }

  async signIxGasSecp256k1(
    owner: Address | BytesLike,
    secretKey: SecretKey,
    ixIndexes: readonly number[],
    mode: TransactionSignMode = {},
  ): Promise<AccountSignature> {
    return this.signIxesSecp256k1(owner, secretKey, [...ixIndexes], true, mode);
  }

  async signIxGasBls12381(
    owner: Address | BytesLike,
    secretKey: SecretKey,
    ixIndexes: readonly number[],
    mode: TransactionSignMode = {},
  ): Promise<AccountSignature> {
    return this.signIxesBls12381(owner, secretKey, [...ixIndexes], true, mode);
  }

  async signIxGasFnDsa512(
    owner: Address | BytesLike,
    secretKey: SecretKey,
    ixIndexes: readonly number[],
    mode: TransactionSignMode = {},
  ): Promise<AccountSignature> {
    return this.signIxesFnDsa512(owner, secretKey, [...ixIndexes], true, mode);
  }

  async signIxAndPayerEd25519(
    owner: Address | BytesLike,
    secretKey: SecretKey,
    ixIndexes: readonly number[],
    payer: Address | BytesLike,
    mode: TransactionSignModeInput = {},
  ): Promise<AccountSignature> {
    const resolvedMode = normalizeTransactionSignMode(mode);
    const publicKey =
      resolvedMode.publicKey ?? (await secretKey.ed25519Public());
    return this.signIxAndPayer(
      Address.from(owner),
      secretKey,
      ixIndexes,
      Address.from(payer),
      publicKey,
      "ed25519",
      resolvedMode.multisigKeyIndex,
    );
  }

  async signIxAndPayerSecp256k1(
    owner: Address | BytesLike,
    secretKey: SecretKey,
    ixIndexes: readonly number[],
    payer: Address | BytesLike,
    mode: TransactionSignModeInput = {},
  ): Promise<AccountSignature> {
    const resolvedMode = normalizeTransactionSignMode(mode);
    const publicKey =
      resolvedMode.publicKey ?? (await secretKey.secp256k1Public());
    return this.signIxAndPayer(
      Address.from(owner),
      secretKey,
      ixIndexes,
      Address.from(payer),
      publicKey,
      "secp256k1",
      resolvedMode.multisigKeyIndex,
    );
  }

  async signIxAndPayerBls12381(
    owner: Address | BytesLike,
    secretKey: SecretKey,
    ixIndexes: readonly number[],
    payer: Address | BytesLike,
    mode: TransactionSignModeInput = {},
  ): Promise<AccountSignature> {
    const resolvedMode = normalizeTransactionSignMode(mode);
    const publicKey =
      resolvedMode.publicKey ?? (await secretKey.bls12381Public());
    return this.signIxAndPayer(
      Address.from(owner),
      secretKey,
      ixIndexes,
      Address.from(payer),
      publicKey,
      "bls12381",
      resolvedMode.multisigKeyIndex,
    );
  }

  async signIxAndPayerFnDsa512(
    owner: Address | BytesLike,
    secretKey: SecretKey,
    ixIndexes: readonly number[],
    payer: Address | BytesLike,
    mode: TransactionSignModeInput = {},
  ): Promise<AccountSignature> {
    const resolvedMode = normalizeTransactionSignMode(mode);
    const publicKey =
      resolvedMode.publicKey ?? (await secretKey.fnDsa512Public());
    return this.signIxAndPayer(
      Address.from(owner),
      secretKey,
      ixIndexes,
      Address.from(payer),
      publicKey,
      "fndsa512",
      resolvedMode.multisigKeyIndex,
    );
  }

  serialize(serializer: BcsSerializer): void {
    serializer.serializeU64(this.stamp);
    serializer.serializeOption(this.payer);
    serializer.serializeU32AsUleb128(this.instructions.length);
    for (const instruction of this.instructions) {
      serializer.serializeBytes(instruction);
    }
    serializer.serializeU32AsUleb128(this.signatures.length);
    for (const [address, signature] of this.signatures) {
      address.serialize(serializer);
      signature.serialize(serializer);
    }
  }

  bcsToBytes(): Uint8Array {
    return serializeBcs(this);
  }

  postcardToBytes(): Uint8Array {
    // MIP-33 wraps every transaction in a one-byte wire-format discriminator.
    // The Base format is currently the only supported format.
    return concatBytes(Uint8Array.of(0), serializePostcard({
      serialize: (serializer: PostcardSerializer) => {
        serializer.serializeU64(this.stamp);
        serializer.serializeBool(this.payer !== null);
        if (this.payer) serializer.serializeFixedBytes(this.payer.bytes);
        serializer.serializeU32(this.instructions.length);
        for (const instruction of this.instructions) {
          serializer.serializeBytes(instruction);
        }
        serializer.serializeU32(this.signatures.length);
        for (const [address, signature] of this.signatures) {
          serializer.serializeFixedBytes(address.bytes);
          serializer.serializeU64(signature.authBit);
          serializer.serializeU64(signature.sigBit);
          serializer.serializeU32(signature.signatures.length);
          for (const entry of signature.signatures) {
            serializePostcardSignature(serializer, entry);
          }
          serializer.serializeBool(signature.publicKey !== null);
          if (signature.publicKey) {
            serializePostcardPublicKey(serializer, signature.publicKey);
          }
        }
      },
    }));
  }

  toHex(prefix = false): string {
    return `${prefix ? "0x" : ""}${bytesToHex(this.postcardToBytes())}`;
  }

  static deserialize(deserializer: BcsDeserializer): Transaction {
    const stamp = deserializer.deserializeU64();
    const payer = deserializer.deserializeOption(Address) ?? null;
    const instructionCount = deserializer.deserializeUleb128AsU32();
    const instructions: Uint8Array[] = [];
    for (let i = 0; i < instructionCount; i += 1) {
      instructions.push(deserializer.deserializeBytes());
    }
    const signatureCount = deserializer.deserializeUleb128AsU32();
    const signatures: TransactionSignatureInput[] = [];
    for (let i = 0; i < signatureCount; i += 1) {
      signatures.push([
        Address.deserialize(deserializer),
        AccountSignature.deserialize(deserializer),
      ]);
    }
    return new Transaction({ stamp, payer, instructions, signatures });
  }

  static fromPostcard(bytes: BytesLike, chainId?: ChainIdLike): Transaction {
    const raw = assertBytes(bytes, undefined, "Transaction");
    if (raw[0] !== 0) {
      throw new Error(`unsupported transaction wire format: ${raw[0] ?? "empty"}`);
    }
    const deserializer = new PostcardDeserializer(raw.slice(1));
    const stamp = deserializer.deserializeU64();
    const payer = deserializer.deserializeBool()
      ? new Address(deserializer.deserializeFixedBytes(Address.LENGTH))
      : null;
    const instructionCount = deserializer.deserializeU32();
    const instructions: Uint8Array[] = [];
    for (let i = 0; i < instructionCount; i += 1) {
      instructions.push(deserializer.deserializeBytes());
    }
    const signatureCount = deserializer.deserializeU32();
    const signatures: TransactionSignatureInput[] = [];
    for (let i = 0; i < signatureCount; i += 1) {
      const address = new Address(
        deserializer.deserializeFixedBytes(Address.LENGTH),
      );
      const authBit = deserializer.deserializeU64();
      const sigBit = deserializer.deserializeU64();
      const entryCount = deserializer.deserializeU32();
      const entries: Signature[] = [];
      for (let j = 0; j < entryCount; j += 1) {
        entries.push(deserializePostcardSignature(deserializer));
      }
      const hasPublicKey = deserializer.deserializeBool();
      const publicKey = hasPublicKey
        ? deserializePostcardPublicKey(deserializer)
        : null;
      signatures.push([
        address,
        new AccountSignature({
          authBit,
          sigBit,
          signatures: entries,
          publicKey,
        }),
      ]);
    }
    deserializer.assertEnd();
    return new Transaction({
      stamp,
      payer,
      instructions,
      signatures,
      ...(chainId !== undefined ? { chainId } : {}),
    });
  }

  static fromHex(hex: string, chainId?: ChainIdLike): Transaction {
    return Transaction.fromPostcard(hexToBytes(hex), chainId);
  }

  toJSON(): {
    hash: number[];
    stamp: string;
    payer: Address | null;
    instructions: number[][];
    signatures: Array<[Address, AccountSignature]>;
  } {
    return {
      hash: Array.from(this.hash),
      stamp: this.stamp.toString(),
      payer: this.payer,
      instructions: this.instructions.map((instruction) =>
        Array.from(instruction),
      ),
      signatures: this.signatures,
    };
  }

  private async signPayer(
    payer: Address,
    secretKey: SecretKey,
    publicKey: PublicKey,
    kind: TransactionSignatureAlgorithm,
    multisigKeyIndex?: number,
  ): Promise<AccountSignature> {
    if (this.payer === null) this.payer = payer;
    if (!this.payer.equals(payer))
      throw new Error("payer does not match transaction payer");
    const authBit = AccountSignature.authPayer();
    const message = this.authMessage(payer, authBit, []);
    const signature = await signWith(secretKey, kind, message);
    return this.buildAccountSignature(
      payer,
      authBit,
      signature,
      publicKey,
      multisigKeyIndex,
    );
  }

  private async signIxAndPayer(
    owner: Address,
    secretKey: SecretKey,
    ixIndexes: readonly number[],
    payer: Address,
    publicKey: PublicKey,
    kind: TransactionSignatureAlgorithm,
    multisigKeyIndex?: number,
  ): Promise<AccountSignature> {
    if (this.payer === null) this.payer = payer;
    if (!this.payer.equals(payer))
      throw new Error("payer does not match transaction payer");
    const uniqueIndexes = this.normalizeIxIndexes(ixIndexes);
    const authBit =
      AccountSignature.authIxes(uniqueIndexes) | AccountSignature.authPayer();
    const message = this.authMessage(owner, authBit, uniqueIndexes);
    const signature = await signWith(secretKey, kind, message);
    return this.buildAccountSignature(
      owner,
      authBit,
      signature,
      publicKey,
      multisigKeyIndex,
    );
  }

  private async signIxes(
    owner: Address,
    secretKey: SecretKey,
    ixIndices: readonly number[],
    includePayer: boolean,
    publicKey: PublicKey,
    kind: TransactionSignatureAlgorithm,
    multisigKeyIndex?: number,
  ): Promise<AccountSignature> {
    const uniqueIndices = this.normalizeIxIndexes(ixIndices);
    let authBit = AccountSignature.authIxes(uniqueIndices);
    if (includePayer) authBit |= AccountSignature.authPayer();
    const message = this.authMessage(owner, authBit, uniqueIndices);
    const signature = await signWith(secretKey, kind, message);
    return this.buildAccountSignature(
      owner,
      authBit,
      signature,
      publicKey,
      multisigKeyIndex,
    );
  }

  private buildAccountSignature(
    owner: Address,
    authBit: bigint,
    signature: Signature,
    publicKey: PublicKey,
    multisigKeyIndex?: number,
  ): AccountSignature {
    if (multisigKeyIndex !== undefined) {
      if (
        !Number.isInteger(multisigKeyIndex) ||
        multisigKeyIndex < 0 ||
        multisigKeyIndex >= 64
      ) {
        throw new RangeError("multisig key index must be in 0..63");
      }
      return new AccountSignature({
        authBit,
        sigBit: 1n << BigInt(multisigKeyIndex),
        signatures: [signature],
        publicKey: null,
      });
    }
    this.assertPublicKeyOwner(owner, publicKey);
    return new AccountSignature({
      authBit,
      sigBit: 0n,
      signatures: [signature],
      publicKey,
    });
  }

  private authMessage(
    owner: Address,
    authBit: bigint,
    ixIndexes: number[],
  ): Uint8Array {
    const chunks: Uint8Array[] = [
      HASH_CONTEXT,
      TX_AUTH_DOMAIN,
      chainIdToBytes(this.chainId),
      owner.bytes,
      u64ToLeBytes(authBit),
      this.txHash(),
    ];
    const hashes = this.ixHashes();
    for (const ixIndex of ixIndexes) {
      if (
        !Number.isInteger(ixIndex) ||
        ixIndex < 0 ||
        ixIndex >= hashes.length
      ) {
        throw new RangeError("instruction index out of range");
      }
      chunks.push(hashes[ixIndex]!);
    }
    return blake3Hash(concatBytes(...chunks));
  }

  private normalizeIxIndexes(ixIndexes: readonly number[]): number[] {
    if (ixIndexes.length === 0) {
      throw new RangeError("instruction indexes cannot be empty");
    }
    return Array.from(new Set(ixIndexes)).sort((left, right) => left - right);
  }

  private allIxIndexes(): number[] {
    return this.instructions.map((_, index) => index);
  }

  private assertPublicKeyOwner(owner: Address, publicKey?: PublicKey): void {
    if (publicKey && !Address.fromPublicKey(publicKey).equals(owner)) {
      throw new Error("public key does not match signature owner");
    }
  }
}

export class TransactionCodec {
  readonly encodeInstruction: ((instruction: unknown) => unknown) | undefined;
  readonly encodeTransaction:
    | ((transaction: Transaction) => unknown)
    | undefined;
  readonly decodeTransaction: ((payload: unknown) => Transaction) | undefined;

  constructor({
    encodeInstruction,
    encodeTransaction,
    decodeTransaction,
  }: {
    encodeInstruction?: (instruction: unknown) => unknown;
    encodeTransaction?: (transaction: Transaction) => unknown;
    decodeTransaction?: (payload: unknown) => Transaction;
  }) {
    this.encodeInstruction = encodeInstruction;
    this.encodeTransaction = encodeTransaction;
    this.decodeTransaction = decodeTransaction;
  }
}

function normalizeTransactionSignMode(
  mode: TransactionSignModeInput,
): TransactionSignMode {
  return mode instanceof PublicKey ? { publicKey: mode } : mode;
}

function u64ToLeBytes(value: U64Like): Uint8Array {
  let remaining = BigInt(value);
  if (remaining < 0n || remaining > 0xffff_ffff_ffff_ffffn) {
    throw new RangeError("u64 out of range");
  }
  const bytes = new Uint8Array(8);
  for (let i = 0; i < 8; i += 1) {
    bytes[i] = Number(remaining & 0xffn);
    remaining >>= 8n;
  }
  return bytes;
}

async function signWith(
  secretKey: SecretKey,
  kind: TransactionSignatureAlgorithm,
  message: BytesLike,
) {
  switch (kind) {
    case "ed25519":
      return secretKey.signEd25519(message);
    case "secp256k1":
      return secretKey.signSecp256k1(message);
    case "bls12381":
      return secretKey.signBls12381(message);
    case "fndsa512":
      return secretKey.signFnDsa512(message);
  }
}

function serializePostcardPublicKey(
  serializer: PostcardSerializer,
  publicKey: PublicKey,
): void {
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
  }
}

function deserializePostcardPublicKey(
  deserializer: PostcardDeserializer,
): PublicKey {
  switch (deserializer.deserializeEnumVariant()) {
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
    default:
      throw new Error("invalid postcard public key variant");
  }
}

function serializePostcardSignature(
  serializer: PostcardSerializer,
  signature: Signature,
): void {
  switch (signature.kind) {
    case SignatureKind.SECP256K1:
      serializer.serializeEnumVariant(0);
      serializer.serializeFixedBytes(signature.bytes);
      return;
    case SignatureKind.ED25519:
      serializer.serializeEnumVariant(1);
      serializer.serializeFixedBytes(signature.bytes);
      return;
    case SignatureKind.BLS12381:
      serializer.serializeEnumVariant(2);
      serializer.serializeFixedBytes(signature.bytes);
      return;
    case SignatureKind.FN_DSA512:
      serializer.serializeEnumVariant(3);
      serializer.serializeFixedBytes(signature.bytes);
      return;
  }
}

function deserializePostcardSignature(
  deserializer: PostcardDeserializer,
): Signature {
  switch (deserializer.deserializeEnumVariant()) {
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
      throw new Error("invalid postcard signature variant");
  }
}
