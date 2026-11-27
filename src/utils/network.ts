export enum Network {
  MAINNET = "mainnet",
  TESTNET = "testnet",
  DEVNET = "devnet",
}

export enum Endpoint {
  mainnet = 'http://127.0.0.1:3000/v1/rpc',
  testnet = 'http://127.0.0.1:3000/v1/rpc',
  devnet = 'https://dev-api.milonlabs.com/v1/rpc',
}


export const NetworkToChainId: Record<Network, number> = {
  [Network.MAINNET]: 1,
  [Network.TESTNET]: 10001,
  [Network.DEVNET]: 10010
};

export const NetworkToNetworkName: Record<string, Network> = {
  mainnet: Network.MAINNET,
  testnet: Network.TESTNET,
  devnet: Network.DEVNET,
};

export type NetworkInput = Network | keyof typeof NetworkToNetworkName;

export function normalizeNetwork(network: NetworkInput): Network {
  const normalized = NetworkToNetworkName[String(network).toLowerCase()];
  if (!normalized) {
    throw new Error(`unsupported network: ${network}`);
  }
  return normalized;
}

export function chainIdForNetwork(network: NetworkInput): number {
  return NetworkToChainId[normalizeNetwork(network)];
}
