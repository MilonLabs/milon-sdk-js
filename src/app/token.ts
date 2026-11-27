import { Address, Signer, VirAddress, VirSigner, type AddressLike, type VirAddressLike } from "../crypto/address";
import type { U64Like } from "../crypto/bytes";

export const APP_NAME = "token";
export type TokenInstructionVariant =
  | "Create"
  | "Mint"
  | "Burn"
  | "Transfer"
  | "TransferVir"
  | "Approve"
  | "TransferFrom"
  | "BalanceOf"
  | "TotalSupply"
  | "Metadata";

export interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
  uri: string;
}

export interface AppInstruction<TVariant extends string = string, TFields = Record<string, unknown>> {
  app: string;
  variant: TVariant;
  fields: TFields;
}

export function create(token: AddressLike, owner: AddressLike, metadata: TokenMetadata): AppInstruction {
  return instruction("Create", {
    token: new Signer(token),
    owner: Address.from(owner),
    metadata: normalizeMetadata(metadata)
  });
}

export function mint(token: AddressLike, to: AddressLike, amount: U64Like): AppInstruction {
  return instruction("Mint", { token: Address.from(token), to: Address.from(to), amount: BigInt(amount) });
}

export function burn(token: AddressLike, holder: AddressLike, amount: U64Like): AppInstruction {
  return instruction("Burn", { token: Address.from(token), holder: new Signer(holder), amount: BigInt(amount) });
}

export function transfer(token: AddressLike, from: AddressLike, to: AddressLike, amount: U64Like): AppInstruction {
  return instruction("Transfer", {
    token: Address.from(token),
    from: new Signer(from),
    to: Address.from(to),
    amount: BigInt(amount)
  });
}

export function transferVir(token: AddressLike, from: VirAddressLike, to: VirAddressLike, amount: U64Like): AppInstruction {
  return instruction("TransferVir", {
    token: Address.from(token),
    from: new VirSigner(from),
    to: VirAddress.from(to),
    amount: BigInt(amount)
  });
}

export function approve(token: AddressLike, owner: AddressLike, spender: AddressLike, amount: U64Like): AppInstruction {
  return instruction("Approve", {
    token: Address.from(token),
    owner: new Signer(owner),
    spender: Address.from(spender),
    amount: BigInt(amount)
  });
}

export function transferFrom(token: AddressLike, from: AddressLike, spender: AddressLike, amount: U64Like): AppInstruction {
  return instruction("TransferFrom", {
    token: Address.from(token),
    from: Address.from(from),
    to: new Signer(spender),
    amount: BigInt(amount)
  });
}

export function balanceOf(token: AddressLike, account: AddressLike): AppInstruction {
  return instruction("BalanceOf", { token: Address.from(token), account: Address.from(account) });
}

export function totalSupply(token: AddressLike): AppInstruction {
  return instruction("TotalSupply", { token: Address.from(token) });
}

export function metadata(token: AddressLike): AppInstruction {
  return instruction("Metadata", { token: Address.from(token) });
}

export function normalizeMetadata({ name, symbol, decimals, icon, uri }: TokenMetadata): TokenMetadata {
  if (!name || name.length > 32) throw new RangeError("metadata.name must be 1..32 chars");
  if (!symbol || symbol.length > 16) throw new RangeError("metadata.symbol must be 1..16 chars");
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 9) {
    throw new RangeError("metadata.decimals must be 0..9");
  }
  if (typeof icon !== "string" || icon.length < 1 || icon.length > 512) {
    throw new RangeError("metadata.icon must be 1..512 chars");
  }
  if (typeof uri !== "string" || uri.length > 512) {
    throw new RangeError("metadata.uri must be 0..512 chars");
  }
  return { name, symbol, decimals, icon, uri };
}

function instruction(variant: TokenInstructionVariant, fields: Record<string, unknown>): AppInstruction {
  return { app: APP_NAME, variant, fields };
}

export const MinlonDecimal = 1000000;