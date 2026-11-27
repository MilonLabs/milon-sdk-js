import { assertBytes, u64ToBeBytes, type BytesLike, type U64Like } from "../crypto/bytes";
import {
  NetworkToChainId,
  chainIdForNetwork,
  normalizeNetwork,
  type Network,
  type NetworkInput
} from "../utils/network";

export type ChainIdLike = U64Like | NetworkInput;

export interface ChainState {
  chainId: bigint;
  network?: Network;
  chainName?: string;
  genesisHash?: Uint8Array;
}

export interface ChainStateInput {
  chainId?: ChainIdLike;
  network?: NetworkInput;
  chainName?: string | null;
  genesisHash?: BytesLike | null;
}

let chainState: ChainState | undefined;

export function setChainId(chainId: ChainIdLike): ChainState {
  return setChainState({ chainId });
}

export function setNetwork(
  network: NetworkInput,
  options: Omit<ChainStateInput, "chainId" | "network"> = {}
): ChainState {
  return setChainState({ ...options, network });
}

export function setChainState(input: ChainStateInput): ChainState {
  const nextNetwork = input.network !== undefined
    ? normalizeNetwork(input.network)
    : networkFromChainIdInput(input.chainId);
  const nextChainId = resolveInputChainId(input.chainId, nextNetwork);

  if (chainState && chainState.chainId !== nextChainId) {
    throw new Error("chain_id is already set");
  }

  chainState = {
    chainId: nextChainId,
    ...(nextNetwork !== undefined
      ? { network: nextNetwork }
      : chainState?.network !== undefined
        ? { network: chainState.network }
        : {}),
    ...(input.chainName !== undefined && input.chainName !== null
      ? { chainName: input.chainName }
      : chainState?.chainName !== undefined
        ? { chainName: chainState.chainName }
        : {}),
    ...(input.genesisHash !== undefined && input.genesisHash !== null
      ? { genesisHash: assertBytes(input.genesisHash, 32, "genesisHash") }
      : chainState?.genesisHash !== undefined
        ? { genesisHash: chainState.genesisHash }
        : {})
  };

  return chainState;
}

export function getChainId(): bigint {
  if (!chainState) {
    throw new Error("chain_id is not set");
  }
  return chainState.chainId;
}

export function getChainState(): ChainState {
  if (!chainState) {
    throw new Error("chain_id is not set");
  }
  return {
    chainId: chainState.chainId,
    ...(chainState.network !== undefined ? { network: chainState.network } : {}),
    ...(chainState.chainName !== undefined ? { chainName: chainState.chainName } : {}),
    ...(chainState.genesisHash !== undefined ? { genesisHash: chainState.genesisHash.slice() } : {})
  };
}

export function getNetwork(): Network {
  const state = getChainState();
  if (state.network === undefined) {
    throw new Error("network is not set");
  }
  return state.network;
}

export function resolveChainId(chainId?: ChainIdLike): bigint {
  return chainId === undefined ? getChainId() : normalizeChainId(chainId);
}

export function chainIdToBytes(chainId?: ChainIdLike): Uint8Array {
  return u64ToBeBytes(resolveChainId(chainId));
}

export function normalizeChainId(chainId: ChainIdLike): bigint {
  const network = networkFromChainIdInput(chainId);
  if (network !== undefined) {
    return BigInt(chainIdForNetwork(network));
  }
  return BigInt(chainId);
}

function resolveInputChainId(chainId: ChainIdLike | undefined, network: Network | undefined): bigint {
  if (chainId === undefined) {
    if (network === undefined) {
      throw new Error("chain_id or network is required");
    }
    return BigInt(chainIdForNetwork(network));
  }

  const normalizedChainId = normalizeChainId(chainId);
  if (network !== undefined && normalizedChainId !== BigInt(chainIdForNetwork(network))) {
    throw new Error("chain_id does not match network");
  }
  return normalizedChainId;
}

function networkFromChainIdInput(chainId: ChainIdLike | undefined): Network | undefined {
  if (typeof chainId === "string") {
    try {
      return normalizeNetwork(chainId);
    } catch {
      return undefined;
    }
  }

  if (chainId !== undefined) {
    const normalized = BigInt(chainId);
    for (const [network, id] of Object.entries(NetworkToChainId) as Array<[Network, number]>) {
      if (normalized === BigInt(id)) {
        return network;
      }
    }
  }
  return undefined;
}
