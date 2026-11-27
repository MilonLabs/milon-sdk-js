import { Address, Signer, type AddressLike } from "../../crypto/address";
import { concatBytes, type BytesLike, type U64Like } from "../../crypto/bytes";
import { PublicKey, type PublicKeyLike } from "../../crypto/public-key";
import { blake3Hash, HASH_CONTEXT } from "../../crypto/hash";
import { IdlName, IdlProvider } from "../../idl/index";
import type { Transport } from "../../executor/index";
import { AccountSignature, PackedInstruction, Transaction } from "../../transaction/index";
import { buildEntry, buildView, type EntryOptions, type ViewOptions } from "../common";

const provider = new IdlProvider(IdlName.Account);

export interface VoteProposal {
  instructions: BytesLike[];
  authBit: U64Like;
}

export interface PreparedVoteProposal {
  intentHash: Uint8Array;
  proposal: VoteProposal;
}

const VOTE_BATCH_HASH_DOMAIN = new TextEncoder().encode(
  "milon.ix-auth.batch.v1",
);

export interface ResolvePolicy {
  minSigners?: number | null;
}

export type AccountEntryOptions = EntryOptions;
export type AccountViewOptions = ViewOptions;

export function createAccount(params: EntryOptions & { ownerPk: PublicKeyLike }) {
  const ownerPk = PublicKey.from(params.ownerPk);
  const owner = Address.fromPublicKey(ownerPk);
  return entry("Create", params, { owner_pk: ownerPk }, owner);
}

export function ensureAccount(params: EntryOptions & { ownerPk: PublicKeyLike }) {
  const ownerPk = PublicKey.from(params.ownerPk);
  const owner = Address.fromPublicKey(ownerPk);
  return entry("EnsureAccount", params, { owner_pk: ownerPk }, owner);
}

export function createMultisig(params: EntryOptions & {
  owner: AddressLike;
  signers: PublicKeyLike[];
  weights: BytesLike;
  threshold: number;
}) {
  return ownerEntry("CreateMultisig", params, {
    signers: params.signers.map(PublicKey.from),
    weights: params.weights,
    threshold: params.threshold,
  });
}

export function addSigner(params: EntryOptions & {
  owner: AddressLike;
  signerPk: PublicKeyLike;
  weight: number;
}) {
  return ownerEntry("AddSigner", params, {
    signer_pk: PublicKey.from(params.signerPk),
    weight: params.weight,
  });
}

/** Adds an FN-DSA-512 signer identified by the address derived from its key. */
export function addSignerByAddress(params: EntryOptions & {
  owner: AddressLike;
  signer: AddressLike;
  weight: number;
}) {
  return ownerEntry("AddSignerByAddress", params, {
    signer: Address.from(params.signer),
    weight: params.weight,
  });
}

export function addSigners(params: EntryOptions & {
  owner: AddressLike;
  signers: PublicKeyLike[];
  weights: BytesLike;
  threshold: number;
}) {
  return ownerEntry("AddSigners", params, {
    signers: params.signers.map(PublicKey.from),
    weights: params.weights,
    threshold: params.threshold,
  });
}

/** Adds multiple FN-DSA-512 signers identified by their derived addresses. */
export function addSignersByAddress(params: EntryOptions & {
  owner: AddressLike;
  signers: AddressLike[];
  weights: BytesLike;
  threshold: number;
}) {
  return ownerEntry("AddSignersByAddress", params, {
    signers: params.signers.map(Address.from),
    weights: params.weights,
    threshold: params.threshold,
  });
}

export function removeSigner(params: EntryOptions & {
  owner: AddressLike;
  index: number;
  threshold: number;
}) {
  return ownerEntry("RemoveSigner", params, {
    index: params.index,
    threshold: params.threshold,
  });
}

export function setThreshold(params: EntryOptions & {
  owner: AddressLike;
  threshold: number;
}) {
  return ownerEntry("SetThreshold", params, { threshold: params.threshold });
}

export function setSignerWeight(params: EntryOptions & {
  owner: AddressLike;
  index: number;
  weight: number;
}) {
  return ownerEntry("SetSignerWeight", params, {
    index: params.index,
    weight: params.weight,
  });
}

export function voteInit(params: EntryOptions & {
  owner: AddressLike;
  intentHash: BytesLike;
  proposal: VoteProposal;
}) {
  return ownerEntry("VoteInit", params, {
    intent_hash: params.intentHash,
    proposal: {
      instructions: params.proposal.instructions,
      auth_bit: BigInt(params.proposal.authBit),
    },
  });
}

export function vote(params: EntryOptions & {
  owner: AddressLike;
  intentHash: BytesLike;
}) {
  return ownerEntry("Vote", params, { intent_hash: params.intentHash });
}

export function sweepExpiredVotes(params: EntryOptions) {
  return entry("SweepExpiredVotes", params, {});
}

export function getAccount(params: ViewOptions & { owner: AddressLike }) {
  return view("GetAccount", { owner: Address.from(params.owner) });
}

export function listSigners(params: ViewOptions & { owner: AddressLike }) {
  return view("ListSigners", { owner: Address.from(params.owner) });
}

export function resolveSigners(params: ViewOptions & {
  owner: AddressLike;
  sigBit: U64Like;
  policy: ResolvePolicy;
}) {
  return view("ResolveSigners", {
    owner: Address.from(params.owner),
    sig_bit: BigInt(params.sigBit),
    policy: { min_signers: params.policy.minSigners ?? null },
  });
}

export function getVote(params: ViewOptions & {
  owner: AddressLike;
  intentHash: BytesLike;
}) {
  return view("GetVote", {
    owner: Address.from(params.owner),
    intent_hash: params.intentHash,
  });
}

export function listActiveVotes(params: ViewOptions & { owner: AddressLike }) {
  return view("ListActiveVotes", { owner: Address.from(params.owner) });
}

/** Builds the MIP-25 intent hash from the immutable proposal wire. */
export function voteIntentHash(
  proposal: VoteProposal,
  chainId?: U64Like,
): Uint8Array {
  const instructions = proposal.instructions.map((instruction) =>
    PackedInstruction.from(instruction).validateLength(),
  );
  if (instructions.length === 0 || instructions.length > AccountSignature.AUTH_VOTE_BIT) {
    throw new RangeError("vote proposal must contain 1..62 instructions");
  }
  const authBit = BigInt(proposal.authBit);
  if (authBit === 0n) throw new RangeError("vote proposal authBit cannot be empty");
  if (authBit < 0n || authBit >= (1n << BigInt(AccountSignature.AUTH_VOTE_BIT))) {
    throw new RangeError("vote proposal authBit may only contain instruction bits 0..61");
  }
  const totalBytes = instructions.reduce(
    (total, instruction) => total + instruction.bytes.length,
    0,
  );
  if (totalBytes > 1024) {
    throw new RangeError("vote proposal instructions cannot exceed 1024 bytes");
  }
  const ixHashes = instructions.map((instruction) => instruction.ixHash(chainId));
  const selected: Uint8Array[] = [];
  for (let index = 0; index < AccountSignature.AUTH_VOTE_BIT; index += 1) {
    if ((authBit & (1n << BigInt(index))) === 0n) continue;
    const hash = ixHashes[index];
    if (!hash) throw new RangeError(`vote auth instruction index out of range: ${index}`);
    selected.push(hash);
  }
  return blake3Hash(concatBytes(
    HASH_CONTEXT,
    VOTE_BATCH_HASH_DOMAIN,
    ...ixHashes,
    ...selected,
  ));
}

export function prepareVoteProposal(params: {
  instructions: BytesLike[];
  authBit?: U64Like;
  chainId?: U64Like;
}): PreparedVoteProposal {
  const proposal: VoteProposal = {
    instructions: params.instructions.map((instruction) =>
      PackedInstruction.from(instruction).toBytes(),
    ),
    authBit: params.authBit ?? AccountSignature.authIxes(
      params.instructions.map((_, index) => index),
    ),
  };
  return { proposal, intentHash: voteIntentHash(proposal, params.chainId) };
}

/** Adds the unsigned bit-62 vote gate used to execute an approved proposal. */
export function markVotedTransaction(
  transaction: Transaction,
  owner: AddressLike,
  instructionIndexes: Iterable<number> = transaction.instructions.map((_, index) => index),
): Transaction {
  const indexes = validateVoteInstructionIndexes(
    instructionIndexes,
    transaction.instructions.length,
  );
  const voteSignature = AccountSignature.unsigned(
    AccountSignature.authVoteIxes(indexes),
  );
  transaction.addSignature(
    Address.from(owner),
    voteSignature,
  );
  return transaction;
}

/** Marks and submits an already payer-signed proposal transaction. */
export async function sendVotedTransaction(params: {
  transport: Transport;
  transaction: Transaction;
  owner: AddressLike;
  instructionIndexes?: Iterable<number>;
}): Promise<unknown> {
  markVotedTransaction(
    params.transaction,
    params.owner,
    params.instructionIndexes,
  );
  params.transaction.validateWire();
  return params.transport.request("submitTransaction", params.transaction);
}

function validateVoteInstructionIndexes(
  indexes: Iterable<number>,
  instructionCount: number,
): number[] {
  if (instructionCount === 0 || instructionCount > AccountSignature.AUTH_VOTE_BIT) {
    throw new RangeError("vote transaction must contain 1..62 instructions");
  }

  const validated: number[] = [];
  const seen = new Set<number>();
  for (const index of indexes) {
    if (!Number.isInteger(index) || index < 0 || index >= instructionCount || index >= AccountSignature.AUTH_VOTE_BIT) {
      throw new RangeError(`vote instruction index must be in 0..${instructionCount - 1}`);
    }
    if (seen.has(index)) {
      throw new RangeError(`duplicate vote instruction index: ${index}`);
    }
    seen.add(index);
    validated.push(index);
  }
  if (validated.length === 0) {
    throw new RangeError("vote instruction indexes cannot be empty");
  }
  return validated;
}

function ownerEntry(
  method: string,
  params: EntryOptions & { owner: AddressLike },
  args: Record<string, unknown>,
) {
  const owner = Address.from(params.owner);
  return entry(method, params, {
    owner: new Signer(owner),
    ...args,
  }, owner);
}

function entry(
  method: string,
  options: EntryOptions,
  args: Record<string, unknown>,
  defaultPayer: AddressLike | null = null,
) {
  return buildEntry(provider, method, args, options, defaultPayer);
}

function view(method: string, args: Record<string, unknown>) {
  return buildView(provider, method, args);
}
