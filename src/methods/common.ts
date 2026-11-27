import type { AddressLike } from "../crypto/address";
import type { U64Like } from "../crypto/bytes";
import {
  type IdlArgs,
  type IdlName,
  type IdlProvider,
} from "../idl/index";
import { Transaction } from "../transaction/index";
import { Network, NetworkToChainId } from "../utils/network";

const TX_STAMP_LEAD_MS = 30_000n;

export interface EntryOptions {
  network?: Network;
  chainId?: U64Like;
  stamp?: U64Like;
  payer?: AddressLike | null;
}

export interface ViewOptions {
  network?: Network;
  chainId?: U64Like;
}

export function buildEntry<TName extends IdlName>(
  provider: IdlProvider<TName>,
  method: string,
  args: IdlArgs,
  options: EntryOptions,
  defaultPayer: AddressLike | null = null,
): Transaction {
  const network = options.network ?? Network.DEVNET;
  return new Transaction({
    stamp: options.stamp ?? BigInt(Date.now()) + TX_STAMP_LEAD_MS,
    payer: options.payer === undefined ? defaultPayer : options.payer,
    instructions: [provider.method(method).arg(args).encode],
    chainId: options.chainId ?? NetworkToChainId[network],
  });
}

export function buildView<TName extends IdlName>(
  provider: IdlProvider<TName>,
  method: string,
  args: IdlArgs,
): Uint8Array {
  return provider.method(method).arg(args).encode;
}
