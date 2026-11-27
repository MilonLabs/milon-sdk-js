import { Address, Signer, type AddressLike } from "../../crypto/address";
import type { BytesLike, U64Like } from "../../crypto/bytes";
import type { SignatureLike } from "../../crypto/signature";
import { IdlName, IdlProvider } from "../../idl/index";
import { buildEntry, buildView, type EntryOptions, type ViewOptions } from "../common";

const provider = new IdlProvider(IdlName.Token);

export interface TokenMetadata {
  decimals: number;
  icon: string;
  name: string;
  symbol: string;
  uri: string;
}

export type ComplianceMode = "All" | "Any";
export interface HongbaoRules {
  credentialId?: string;
  recipients?: AddressLike[];
  expiresAtMs?: U64Like;
}
/** @deprecated Use `HongbaoRules`. */
export type GiftRules = HongbaoRules;
export type HongbaoAllocation = "Equal" | "Lucky";

/** One recipient's vesting schedule. Amounts and periods are encoded as u64. */
export interface VestingRecipient {
  recipient: AddressLike;
  /** Recipient label shown with the vesting schedule. */
  name?: string;
  totalAmount: U64Like;
  /** Delay before the initial amount becomes claimable. Defaults to zero. */
  initialPeriodSeconds?: U64Like;
  initialAmount: U64Like;
  periodSeconds: U64Like;
  periods: U64Like;
  amountPerPeriod: U64Like;
}
export type TokenEntryOptions = EntryOptions;
export type TokenViewOptions = ViewOptions;

interface TokenParam { token: AddressLike }
interface TokenAccountParam extends TokenParam { account: AddressLike }

export function createToken(params: EntryOptions & {
  token: AddressLike;
  owner: AddressLike;
  metadata: TokenMetadata;
}) {
  return buildEntry(provider, "Create", {
    token: new Signer(params.token),
    owner: Address.from(params.owner),
    metadata: params.metadata,
  }, params, params.token);
}

export function abandonOwner(params: EntryOptions & TokenParam) {
  return entry("AbandonOwner", params, { token: Address.from(params.token) });
}

export function transferOwner(params: EntryOptions & TokenParam & { to: AddressLike }) {
  return entry("TransferOwner", params, {
    token: Address.from(params.token),
    to: Address.from(params.to),
  });
}

export function abandonFreezer(params: EntryOptions & TokenParam) {
  return entry("AbandonFreezer", params, { token: Address.from(params.token) });
}

export function transferFreezer(params: EntryOptions & TokenParam & { to: AddressLike }) {
  return entry("TransferFreezer", params, {
    token: Address.from(params.token),
    to: Address.from(params.to),
  });
}

export function mint(params: EntryOptions & TokenParam & { to: AddressLike; amount: U64Like }) {
  return entry("Mint", params, {
    token: Address.from(params.token),
    to: Address.from(params.to),
    amount: BigInt(params.amount),
  });
}

export function mintBatch(params: EntryOptions & TokenParam & {
  to: AddressLike[];
  amount: U64Like[];
}) {
  return entry("MintBatch", params, {
    token: Address.from(params.token),
    to: params.to.map(Address.from),
    amount: params.amount.map(BigInt),
  });
}

export function burn(params: EntryOptions & TokenParam & {
  holder: AddressLike;
  amount: U64Like;
}) {
  return entry("Burn", params, {
    holder: new Signer(params.holder),
    token: Address.from(params.token),
    amount: BigInt(params.amount),
  }, params.holder);
}

export function transfer(params: EntryOptions & TokenParam & {
  from: AddressLike;
  to: AddressLike;
  amount: U64Like;
}) {
  return entry("Transfer", params, {
    from: new Signer(params.from),
    token: Address.from(params.token),
    to: Address.from(params.to),
    amount: BigInt(params.amount),
  }, params.from);
}

export function transferBatch(params: EntryOptions & TokenParam & {
  from: AddressLike;
  to: AddressLike[];
  amount: U64Like[];
}) {
  return entry("TransferBatch", params, {
    from: new Signer(params.from),
    token: Address.from(params.token),
    to: params.to.map(Address.from),
    amount: params.amount.map(BigInt),
  }, params.from);
}

export function freeze(params: EntryOptions & TokenParam & {
  holder: AddressLike;
  amount: U64Like;
}) {
  return entry("Freeze", params, {
    token: Address.from(params.token),
    holder: Address.from(params.holder),
    amount: BigInt(params.amount),
  });
}

export function unfreeze(params: EntryOptions & TokenParam & {
  holder: AddressLike;
  amount: U64Like;
}) {
  return entry("Unfreeze", params, {
    token: Address.from(params.token),
    holder: Address.from(params.holder),
    amount: BigInt(params.amount),
  });
}

export function approve(params: EntryOptions & TokenParam & {
  owner: AddressLike;
  spender: AddressLike;
  amount: U64Like;
}) {
  return entry("Approve", params, {
    owner: new Signer(params.owner),
    token: Address.from(params.token),
    spender: Address.from(params.spender),
    amount: BigInt(params.amount),
  }, params.owner);
}

export function revoke(params: EntryOptions & TokenParam & {
  owner: AddressLike;
  spender: AddressLike;
}) {
  return entry("Revoke", params, {
    owner: new Signer(params.owner),
    token: Address.from(params.token),
    spender: Address.from(params.spender),
  }, params.owner);
}

export function transferFrom(params: EntryOptions & TokenParam & {
  spender: AddressLike;
  from: AddressLike;
  amount: U64Like;
}) {
  return entry("TransferFrom", params, {
    spender: new Signer(params.spender),
    token: Address.from(params.token),
    from: Address.from(params.from),
    amount: BigInt(params.amount),
  }, params.spender);
}

export function setIcon(params: EntryOptions & TokenParam & { iconUrl: string }) {
  return entry("SetIcon", params, {
    token: Address.from(params.token),
    icon_url: params.iconUrl,
  });
}

export function setUri(params: EntryOptions & TokenParam & { uri: string }) {
  return entry("SetUri", params, {
    token: Address.from(params.token),
    uri: params.uri,
  });
}

export function createWithCompliance(params: EntryOptions & {
  token: AddressLike;
  owner: AddressLike;
  metadata: TokenMetadata;
  credentialId: string;
}) {
  return entry("CreateWithCompliance", params, {
    token: new Signer(params.token),
    owner: Address.from(params.owner),
    metadata: params.metadata,
    credential_id: params.credentialId,
  }, params.token);
}

export function setComplianceMode(params: EntryOptions & TokenParam & {
  mode: ComplianceMode;
}) {
  return entry("SetComplianceMode", params, {
    token: Address.from(params.token),
    mode: params.mode,
  });
}

export function addComplianceRequirement(params: EntryOptions & TokenParam & {
  /** @deprecated Use credentialIds when adding more than one requirement. */
  credentialId?: string;
  credentialIds?: string[];
}) {
  return entry("AddComplianceRequirement", params, {
    token: Address.from(params.token),
    credential_ids: complianceCredentialIds(params),
  });
}

export function removeComplianceRequirement(params: EntryOptions & TokenParam & {
  /** @deprecated Use credentialIds when removing more than one requirement. */
  credentialId?: string;
  credentialIds?: string[];
}) {
  return entry("RemoveComplianceRequirement", params, {
    token: Address.from(params.token),
    credential_ids: complianceCredentialIds(params),
  });
}

export function clearComplianceRequirements(params: EntryOptions & TokenParam) {
  return entry("ClearComplianceRequirements", params, {
    token: Address.from(params.token),
  });
}

/** Publishes an issuer-signed VC attestation for the token subject. */
export function discloseTokenVcAttestation(params: EntryOptions & TokenParam & {
  issuer: AddressLike;
  issuerKeyId: number;
  credentialSchema: string;
  credentialHash: BytesLike;
  validUntilMs?: U64Like | null;
  issuerSignature: SignatureLike;
}) {
  return entry("DiscloseTokenVcAttestation", params, {
    token: Address.from(params.token),
    issuer: Address.from(params.issuer),
    issuer_key_id: params.issuerKeyId,
    credential_schema: params.credentialSchema,
    credential_hash: params.credentialHash,
    valid_until_ms: params.validUntilMs == null ? undefined : BigInt(params.validUntilMs),
    issuer_signature: params.issuerSignature,
  });
}

export function claimFaucet(params: EntryOptions & { claimer: AddressLike }) {
  return entry("ClaimFaucet", { ...params, payer: null }, {
    claimer: new Signer(params.claimer),
  }, null);
}

export function createEqualHongbao(params: EntryOptions & TokenParam & {
  creator: AddressLike; totalAmount: U64Like; claimCount: U64Like; rules: HongbaoRules; message?: string | null;
}) {
  return hongbaoEntry("CreateEqualHongbao", params);
}

export function createLuckyHongbao(params: EntryOptions & TokenParam & {
  creator: AddressLike; totalAmount: U64Like; claimCount: U64Like; rules: HongbaoRules; message?: string | null;
}) {
  return hongbaoEntry("CreateLuckyHongbao", params);
}

/** Creates a Hongbao restricted to holders of every listed VC credential. */
export function createCredentialHongbao(params: EntryOptions & TokenParam & {
  creator: AddressLike; totalAmount: U64Like; claimCount: U64Like;
  allocation: HongbaoAllocation; credentialIds: readonly string[];
  expiresAtMs?: U64Like | null; message?: string | null;
}) {
  return entry("CreateCredentialHongbao", params, {
    creator: new Signer(params.creator),
    token: Address.from(params.token),
    total_amount: BigInt(params.totalAmount),
    claim_count: BigInt(params.claimCount),
    allocation: params.allocation,
    credential_ids: [...params.credentialIds],
    expires_at_ms: params.expiresAtMs == null ? null : BigInt(params.expiresAtMs),
    message: params.message ?? null,
  }, params.creator);
}

export function createSftHongbao(params: EntryOptions & TokenParam & {
  creator: AddressLike; totalAmount: U64Like; claimCount: U64Like; allocation: HongbaoAllocation;
  sft: AddressLike; minAmount: U64Like; expiresAtMs?: U64Like | null; message?: string | null;
}) {
  return entry("CreateSftHongbao", params, {
    creator: new Signer(params.creator),
    token: Address.from(params.token),
    total_amount: BigInt(params.totalAmount),
    claim_count: BigInt(params.claimCount),
    allocation: params.allocation,
    sft: Address.from(params.sft),
    min_amount: BigInt(params.minAmount),
    expires_at_ms: params.expiresAtMs == null ? null : BigInt(params.expiresAtMs),
    message: params.message ?? null,
  }, params.creator);
}

export function claimHongbao(params: EntryOptions & { claimant: AddressLike; hongbaoId: AddressLike }) {
  return entry("ClaimHongbao", { ...params, payer: null }, {
    claimant: new Signer(params.claimant), hongbao_id: Address.from(params.hongbaoId),
  }, null);
}

export function refundHongbao(params: EntryOptions & { hongbaoId: AddressLike }) {
  return entry("RefundHongbao", params, { hongbao_id: Address.from(params.hongbaoId) });
}

/** Schedules an expired Hongbao refund for automatic processing. */
export function scheduleHongbaoRefund(params: EntryOptions & { hongbaoId: AddressLike }) {
  return entry("ScheduleHongbaoRefund", params, {
    hongbao_id: Address.from(params.hongbaoId),
  });
}

/** Runs a sponsored Hongbao refund task. */
export function runHongbaoRefund(params: EntryOptions & { hongbaoId: AddressLike }) {
  return entry("RunHongbaoRefund", { ...params, payer: null }, {
    hongbao_id: Address.from(params.hongbaoId),
  }, null);
}

export function runHongbaoCleanup(params: EntryOptions & { hongbaoId: AddressLike }) {
  return entry("RunHongbaoCleanup", { ...params, payer: null }, {
    hongbao_id: Address.from(params.hongbaoId),
  }, null);
}

export function createVesting(params: EntryOptions & TokenParam & {
  creator: AddressLike;
  startAtMs: U64Like;
  recipients: VestingRecipient[];
}) {
  return entry("CreateVesting", params, {
    creator: new Signer(params.creator),
    token: Address.from(params.token),
    start_at_ms: BigInt(params.startAtMs),
    recipients: params.recipients.map((recipient) => ({
      recipient: Address.from(recipient.recipient),
      name: recipient.name ?? "",
      total_amount: BigInt(recipient.totalAmount),
      initial_period_seconds: BigInt(recipient.initialPeriodSeconds ?? 0),
      initial_amount: BigInt(recipient.initialAmount),
      period_seconds: BigInt(recipient.periodSeconds),
      periods: BigInt(recipient.periods),
      amount_per_period: BigInt(recipient.amountPerPeriod),
    })),
  }, params.creator);
}

export function claimVesting(params: EntryOptions & {
  claimant: AddressLike;
  vestingId: AddressLike;
}) {
  return entry("ClaimVesting", { ...params, payer: null }, {
    claimant: new Signer(params.claimant),
    vesting_id: Address.from(params.vestingId),
  }, null);
}

export function balanceOf(params: ViewOptions & TokenAccountParam) {
  return view("BalanceOf", {
    token: Address.from(params.token),
    account: Address.from(params.account),
  });
}

export function frozenOf(params: ViewOptions & TokenAccountParam) {
  return view("FrozenOf", {
    token: Address.from(params.token),
    account: Address.from(params.account),
  });
}

export function approvalOf(params: ViewOptions & TokenParam & {
  owner: AddressLike;
  spender: AddressLike;
}) {
  return view("ApprovalOf", {
    token: Address.from(params.token),
    owner: Address.from(params.owner),
    spender: Address.from(params.spender),
  });
}

export function totalSupply(params: ViewOptions & TokenParam) {
  return view("TotalSupply", { token: Address.from(params.token) });
}

export function metadata(params: ViewOptions & TokenParam) {
  return view("Metadata", { token: Address.from(params.token) });
}

export function compliance(params: ViewOptions & TokenParam) {
  return view("Compliance", { token: Address.from(params.token) });
}

/** @deprecated Use `compliance`. */
export const complianceConfig = compliance;

export function faucetCooldownRemaining(params: ViewOptions & { account: AddressLike }) {
  return view("FaucetCooldownRemaining", {
    account: Address.from(params.account),
  });
}

export function hongbaoMessage(params: ViewOptions & { hongbaoId: AddressLike }) {
  return view("HongbaoMessage", { hongbao_id: Address.from(params.hongbaoId) });
}

export function hongbaoInfo(params: ViewOptions & { hongbaoId: AddressLike }) {
  return view("HongbaoInfo", { hongbao_id: Address.from(params.hongbaoId) });
}

export function hongbaoSettlement(params: ViewOptions & { hongbaoId: AddressLike }) {
  return view("HongbaoSettlement", { hongbao_id: Address.from(params.hongbaoId) });
}

export function canClaimHongbao(params: ViewOptions & { hongbaoId: AddressLike; claimant: AddressLike }) {
  return view("CanClaimHongbao", {
    hongbao_id: Address.from(params.hongbaoId), claimant: Address.from(params.claimant),
  });
}

export function vestingInfo(params: ViewOptions & { vestingId: AddressLike }) {
  return view("VestingInfo", { vesting_id: Address.from(params.vestingId) });
}

export function vestingClaimable(params: ViewOptions & {
  vestingId: AddressLike;
  recipient: AddressLike;
}) {
  return view("VestingClaimable", {
    vesting_id: Address.from(params.vestingId),
    recipient: Address.from(params.recipient),
  });
}

function hongbaoEntry(
  method: "CreateEqualHongbao" | "CreateLuckyHongbao",
  params: EntryOptions & TokenParam & { creator: AddressLike; totalAmount: U64Like; claimCount: U64Like; rules: HongbaoRules; message?: string | null },
) {
  return entry(method, params, {
    creator: new Signer(params.creator), token: Address.from(params.token),
    total_amount: BigInt(params.totalAmount), claim_count: BigInt(params.claimCount),
    rules: {
      credential_id: params.rules.credentialId,
      recipients: (params.rules.recipients ?? []).map(Address.from),
      expires_at_ms: params.rules.expiresAtMs === undefined ? undefined : BigInt(params.rules.expiresAtMs),
    },
    message: params.message ?? null,
  }, params.creator);
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

function complianceCredentialIds(params: { credentialId?: string; credentialIds?: string[] }): string[] {
  if (params.credentialIds !== undefined) return params.credentialIds;
  if (params.credentialId !== undefined) return [params.credentialId];
  throw new Error("credentialIds is required");
}
