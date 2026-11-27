import { Address, Signer, type AddressLike } from "../crypto/address";
import { PublicKey, type PublicKeyLike } from "../crypto/public-key";
import { Signature, type SignatureLike } from "../crypto/signature";
import type { BytesLike, U64Like } from "../crypto/bytes";

export const APP_NAME = "account";
export type AccountInstructionVariant =
  | "Create"
  | "CreateIfNotExists"
  | "CreateWithSigners"
  | "AddSigner"
  | "SetThreshold"
  | "Get"
  | "Verify";

export interface AppInstruction<TVariant extends string = string, TFields = Record<string, unknown>> {
  app: string;
  variant: TVariant;
  fields: TFields;
}

export function create(ownerPk: PublicKeyLike): AppInstruction {
  return instruction("Create", { owner_pk: PublicKey.from(ownerPk) });
}

export function createIfNotExists(ownerPk: PublicKeyLike): AppInstruction {
  return instruction("CreateIfNotExists", { owner_pk: PublicKey.from(ownerPk) });
}

export function createWithSigners(owner: AddressLike, signers: PublicKeyLike[], threshold: number): AppInstruction {
  return instruction("CreateWithSigners", {
    owner: new Signer(owner),
    signers: signers.map(PublicKey.from),
    threshold
  });
}

export function addSigner(owner: AddressLike, signerPk: PublicKeyLike): AppInstruction {
  return instruction("AddSigner", { owner: new Signer(owner), signer_pk: PublicKey.from(signerPk) });
}

export function setThreshold(owner: AddressLike, threshold: number): AppInstruction {
  return instruction("SetThreshold", { owner: new Signer(owner), threshold });
}

export function get(owner: AddressLike): AppInstruction {
  return instruction("Get", { owner: Address.from(owner) });
}

export function verify(owner: AddressLike, message: BytesLike, signatures: SignatureLike[], sigBit: U64Like): AppInstruction {
  return instruction("Verify", {
    owner: Address.from(owner),
    message,
    signatures: signatures.map(Signature.from),
    sig_bit: BigInt(sigBit)
  });
}

function instruction(variant: AccountInstructionVariant, fields: Record<string, unknown>): AppInstruction {
  return { app: APP_NAME, variant, fields };
}
