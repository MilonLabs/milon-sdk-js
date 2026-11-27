import {
  Address,
  SecretKey,
  SecretKeyKind,
  Signer,
  assertBytes,
  bs58ToBytes,
  bs58ToHex,
  bytesToBs58,
  bytesToHex,
  hexToBytes,
  toBytes,
  type AddressLike,
  type BytesLike,
} from "../crypto/index";
import {
  ClientHandler,
  EventsByTxHashRequest,
  type AccessValueEntry,
} from "../executor/index";
import { AccountSignature, Transaction } from "../transaction/index";
import { Network, NetworkToChainId } from "../utils/network";
import { RpcMethodEnum } from "../utils/method";
import { delay } from "../utils/index";
import {
  IdlName,
  IdlProvider,
  KindEnum,
  type DecodedAnySerializeValue,
  type MilonIdl,
} from "../idl/index";
import { PostcardSerializer } from "../postcard/index";
import {
  totalSupply as buildTotalSupply,
} from "../methods/token/index";
import {
  listActiveVotes as buildListActiveVotes,
} from "../methods/account/index";

const TX_STAMP_LEAD_MS = 30_000n;

let configuredTokenIdl: MilonIdl | null = null;

export interface CreateTokenOptions {
  fetchImpl?: typeof fetch;
  requestId?: number;
  tokenIdl?: MilonIdl;
}

export interface TokenIdlOptions {
  tokenIdl?: MilonIdl;
}

export interface ClaimFaucetOptions {
  network: Network;
  claimerSecretKey: SecretKey;
  tokenIdl?: MilonIdl;
  stamp?: bigint;
}

export interface TokenTransactionModeExampleOptions {
  /** Transaction network. Defaults to DEVNET. */
  network?: Network;
  /** Timestamp of the first example transaction; each subsequent timestamp is incremented by one. */
  stamp?: bigint;
  /** Token address used by Mint and Transfer. Its on-chain owner must match `ownerSecretKey`. */
  token: AddressLike;
  /** Recipient address for the Transfer instruction. */
  recipient: AddressLike;
  /** Mint amount in each example. Defaults to 1000. */
  amount?: bigint;
  /** Transfer amount in each example. Defaults to 300. */
  transferAmount?: bigint;
  /** Token owner's secret key, used to authorize the Mint instruction at index 0. */
  ownerSecretKey: SecretKey;
  /** Token holder's secret key, used to authorize the Transfer instruction at index 1. */
  holderSecretKey: SecretKey;
  /** Gas-only payer secret key for UnifiedDualSign mode. */
  payerSecretKey: SecretKey;
  /** Sponsor secret key for UnifiedPayerOnlyGas mode. */
  sponsorSecretKey: SecretKey;
}

export interface AutoFundOptions {
  /** Claim sponsored DEVNET faucet funds before submitting a gas-paying transaction. */
  fundWithFaucet?: boolean;
  /** Token IDL used by ClaimFaucet when auto-funding a non-token operation. */
  tokenIdl?: MilonIdl;
}

export type DecodedResourceValue = DecodedAnySerializeValue;

export type DecodedAccessValueEntry =
  AccessValueEntry<DecodedAnySerializeValue>;

export function setTokenIdl(idl: MilonIdl): void {
  configuredTokenIdl = idl;
}

export async function getBlockHead(network: Network = Network.DEVNET) {
  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.chain_head,
    body: [],
  });

  if (res.status === 0) {
    const blockHead = res.body;
    return {
      postcardData: res.postcardData,
      chainId: blockHead.chainId,
      blockHeight: blockHead.blockHeight,
      blockHash: bytesToBs58(blockHead.blockHash),
      timestampMsecs: blockHead.timestampMsecs,
      ...(blockHead.stateHash === undefined
        ? {}
        : { stateHash: bytesToBs58(blockHead.stateHash) }),
      request_id: res.request_id,
    };
  } else {
    throw new Error(formatRpcError(res.status, res.error));
  }
}

export async function getBlockByHeight(
  network: Network = Network.DEVNET,
  height: bigint,
) {
  const serializer = new PostcardSerializer();
  serializer.serializeU64(height);
  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.get_block_by_height,
    body: Array.from(serializer.toUint8Array()),
  });

  if (res.status !== 0) {
    throw new Error(formatRpcError(res.status, res.error));
  }

  return res;
}

/** Return the feature and binary compatibility state of the target node. */
export async function nodeCapability(network: Network = Network.DEVNET) {
  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.node_capability,
    body: undefined,
  });
  if (res.status !== 0) throw new Error(formatRpcError(res.status, res.error));
  return res.body;
}

/** List public validator location data known to the target node. */
export async function validatorLocations(network: Network = Network.DEVNET) {
  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.validator_locations,
    body: undefined,
  });
  if (res.status !== 0) throw new Error(formatRpcError(res.status, res.error));
  return res.body;
}

export async function createToken(
  network: Network = Network.DEVNET,
  idl: MilonIdl,
  { fundWithFaucet = false }: AutoFundOptions = {},
) {
  const provider = new IdlProvider(IdlName.Token);
  const tokenSignerSecretKey = SecretKey.generateDsa512();
  const tokenSignerPublicKey = await tokenSignerSecretKey.fnDsa512Public();
  const token = Address.fromPublicKey(tokenSignerPublicKey);
  const owner = Address.from(bs58ToHex("2z3mDaJLnGnSaur9She2KWj3wSDT"));
  if (fundWithFaucet) {
    const faucet = await claim_faucet({
      network,
      claimerSecretKey: tokenSignerSecretKey,
      tokenIdl: idl,
    });
    await waitForSuccessfulTransaction(network, faucet.txHash, "claim_faucet");
  }

  const stamp = BigInt(Date.now()) + TX_STAMP_LEAD_MS;
  const chainId = BigInt(NetworkToChainId[network]);

  const create = provider.Create.arg({
    token,
    owner,
    metadata: {
      name: "SDK Test Token",
      symbol: "SDKT",
      decimals: 6,
      icon: "https://milon.test/token.png",
      uri: "https://milon.test/token.png",
    },
  }).encode;

  const tx = new Transaction({
    stamp,
    payer: token,
    instructions: [create],
    chainId,
  });

  const createSignature = await tx.signIxAndPayerFnDsa512(
    token,
    tokenSignerSecretKey,
    [0],
    token,
    tokenSignerPublicKey,
  );
  tx.addSignature(token, createSignature);
  const txPostcardBytes = tx.postcardToBytes();
  const txPostcardArray = Array.from(txPostcardBytes);

  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.submit_tx,
    body: txPostcardArray,
  });
  if (res.status !== 0) {
    throw new Error(formatRpcError(res.status, res.error));
  }

  const hashBytes = res.body;
  if (hashBytes.length !== 32) {
    throw new Error(
      `submit_tx expected 32-byte hash, got ${hashBytes.length} bytes`,
    );
  }

  return res;
}

function loadTokenIdl(idl?: MilonIdl): MilonIdl {
  if (idl) return idl;
  if (configuredTokenIdl) return configuredTokenIdl;
  throw new Error(
    "Token IDL is not configured. Call setTokenIdl(tokenIdl) first or pass { tokenIdl } to the method.",
  );
}

export const getTxByHash = async (network: Network, txHashOrId: BytesLike) => {
  const txHashOrIdBytes = normalizeTxHashOrId(txHashOrId);
  if (txHashOrIdBytes.length !== 12 && txHashOrIdBytes.length !== 32) {
    throw new TypeError(
      `txHashOrId must be 12-byte TxID or 32-byte TxHash, got ${txHashOrIdBytes.length} bytes`,
    );
  }
  const serializer = new PostcardSerializer();
  serializer.serializeBytes(txHashOrIdBytes);
  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.get_tx_by_hash,
    body: Array.from(serializer.toUint8Array()),
  });
  if (res.status === 2) {
    return res;
  }
  if (res.status !== 0) {
    throw new Error(formatRpcError(res.status, res.error));
  }
  return res.body;
};

export const getTxHistoryProof = async (
  network: Network,
  txHashOrId: BytesLike,
) => {
  const bytes = normalizeTxHashOrId(txHashOrId);
  if (bytes.length !== 12 && bytes.length !== 32) {
    throw new TypeError(
      `txHashOrId must be 12-byte TxID or 32-byte TxHash, got ${bytes.length} bytes`,
    );
  }
  const serializer = new PostcardSerializer();
  serializer.serializeBytes(bytes);
  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.get_tx_history_proof,
    body: Array.from(serializer.toUint8Array()),
  });
  if (res.status === 2) return res;
  if (res.status !== 0) {
    throw new Error(formatRpcError(res.status, res.error));
  }
  return res.body;
};

function normalizeTxHashOrId(txHashOrId: BytesLike): Uint8Array {
  if (typeof txHashOrId !== "string") return toBytes(txHashOrId);

  try {
    return hexToBytes(txHashOrId);
  } catch {
    try {
      return bs58ToBytes(txHashOrId);
    } catch {
      throw new TypeError("txHashOrId must be valid hex or Base58");
    }
  }
}

export async function testCreateToken(network: Network = Network.DEVNET) {
  const provider = new IdlProvider(IdlName.Token);
  const tokenSignerSecretKey = SecretKey.generateFnDsa512();
  const ownerSignerSecretKey = SecretKey.generateFnDsa512();
  const user1SignerSecretKey = SecretKey.generateFnDsa512();
  const user2SignerSecretKey = SecretKey.generateFnDsa512();
  const payerSignerSecretKey = SecretKey.generateFnDsa512();
  const tokenSignerPublicKey = await tokenSignerSecretKey.fnDsa512Public();
  const ownerSignerPublicKey = await ownerSignerSecretKey.fnDsa512Public();
  const user1SignerPublicKey = await user1SignerSecretKey.fnDsa512Public();
  const user2SignerPublicKey = await user2SignerSecretKey.fnDsa512Public();
  const payerSignerPublicKey = await payerSignerSecretKey.fnDsa512Public();
  const token = Address.fromPublicKey(tokenSignerPublicKey);
  const owner = Address.fromPublicKey(ownerSignerPublicKey);
  const user1 = Address.fromPublicKey(user1SignerPublicKey);
  const user2 = Address.fromPublicKey(user2SignerPublicKey);
  const payer = Address.fromPublicKey(payerSignerPublicKey);
  const stamp = BigInt(Date.now()) + TX_STAMP_LEAD_MS;

  const chainId = BigInt(NetworkToChainId[network]);

  const create = provider.Create.arg({
    token,
    owner,
    metadata: {
      name: "SDK Multi Ix Token",
      symbol: "SMIX2",
      decimals: 6,
      icon: "https://milon.test/token.png",
      uri: "https://milon.test/token.png",
    },
  }).encode;

  const createTx = new Transaction({
    stamp,
    payer,
    instructions: [create],
    chainId,
  });

  const createSignature = await createTx.signIxFnDsa512(
    token,
    tokenSignerSecretKey,
    [0],
    tokenSignerPublicKey,
  );
  createTx.addSignature(token, createSignature);
  const createPayerSignature = await createTx.signPayerFnDsa512(
    payer,
    payerSignerSecretKey,
    payerSignerPublicKey,
  );
  createTx.addSignature(payer, createPayerSignature);
  const createTxPostcardBytes = createTx.postcardToBytes();

  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.submit_tx,
    body: createTxPostcardBytes,
  });

  if (res.status !== 0) {
    throw new Error(formatRpcError(res.status, res.error));
  }

  await delay(2000);
  const mint = provider.Mint.arg({
    token,
    to: user1,
    amount: 1000n,
  }).encode;
  const transfer = provider.Transfer.arg({
    from: user1,
    token,
    to: user2,
    amount: 300n,
  }).encode;

  const tx = new Transaction({
    stamp,
    payer,
    instructions: [mint, transfer],
    chainId,
  });
  const payerSignature = await tx.signPayerFnDsa512(
    payer,
    payerSignerSecretKey,
    payerSignerPublicKey,
  );
  const ownerSignature = await tx.signIxFnDsa512(
    owner,
    ownerSignerSecretKey,
    [0],
    ownerSignerPublicKey,
  );
  const user1Signature = await tx.signIxFnDsa512(
    user1,
    user1SignerSecretKey,
    [1],
    user1SignerPublicKey,
  );
  tx.addSignature(payer, payerSignature);
  tx.addSignature(owner, ownerSignature);
  tx.addSignature(user1, user1Signature);
  const txPostcardBytes = tx.postcardToBytes();

  const res2 = await new ClientHandler(network).request({
    method: RpcMethodEnum.submit_tx,
    body: txPostcardBytes,
  });

  return res2.body;
}

/**
 * Builds examples for the four transaction modes supported by the SDK. Each
 * transaction contains:
 *
 * - instruction 0: a Mint authorized by the token owner.
 * - instruction 1: a Transfer authorized by the token holder.
 *
 * The examples use classical Ed25519 secret keys and only build, sign, and
 * validate the wire transactions. They do not submit transactions to a node.
 */
export async function buildTokenTransactionModeExamples({
  network = Network.DEVNET,
  stamp = BigInt(Date.now()) + TX_STAMP_LEAD_MS,
  token: tokenLike,
  recipient: recipientLike,
  amount = 1_000n,
  transferAmount = 300n,
  ownerSecretKey,
  holderSecretKey,
  payerSecretKey,
  sponsorSecretKey,
}: TokenTransactionModeExampleOptions) {
  const provider = new IdlProvider(IdlName.Token);
  const chainId = BigInt(NetworkToChainId[network]);
  const token = Address.from(tokenLike);
  const recipient = Address.from(recipientLike);

  const ownerPublicKey = await ownerSecretKey.ed25519Public();
  const holderPublicKey = await holderSecretKey.ed25519Public();
  const payerPublicKey = await payerSecretKey.ed25519Public();
  const sponsorPublicKey = await sponsorSecretKey.ed25519Public();
  const owner = Address.fromPublicKey(ownerPublicKey);
  const holder = Address.fromPublicKey(holderPublicKey);
  const payer = Address.fromPublicKey(payerPublicKey);
  const sponsor = Address.fromPublicKey(sponsorPublicKey);

  // Keep the business instructions identical so payer and authorization bits are easy to compare.
  const instructions = (mintTo: Address, transferFrom: Address) => [
    provider.Mint.arg({
      token,
      to: mintTo,
      amount,
    }).encode,
    provider.Transfer.arg({
      from: transferFrom,
      token,
      to: recipient,
      amount: transferAmount,
    }).encode,
  ];

  /**
   * 1. UnifiedPayerSignAll
   *
   * The owner is both the business signer and unified payer. `signEd25519`:
   * - authorizes every instruction bit (instructions 0 and 1),
   * - authorizes the payer bit, and
   * - adds the signature to the transaction.
   *
   * Because the owner is the only signer, it is both the Mint recipient and
   * the Transfer sender in this example.
   */
  const unifiedPayerSignAll = new Transaction({
    stamp,
    payer: owner,
    instructions: instructions(owner, owner),
    chainId,
  });
  await unifiedPayerSignAll.signEd25519(owner, ownerSecretKey, ownerPublicKey);
  unifiedPayerSignAll.validateWire();

  /**
   * 2. UnifiedDualSign
   *
   * The payer is the unified fee account but does not authorize business operations:
   * - the payer signs only the payer bit,
   * - the token owner signs only instruction 0 (Mint), and
   * - the holder signs only instruction 1 (Transfer).
   */
  const unifiedDualSign = new Transaction({
    stamp: stamp + 1n,
    payer,
    instructions: instructions(holder, holder),
    chainId,
  });
  unifiedDualSign.addSignature(
    payer,
    await unifiedDualSign.signPayerEd25519(
      payer,
      payerSecretKey,
      payerPublicKey,
    ),
  );
  unifiedDualSign.addSignature(
    owner,
    await unifiedDualSign.signIxEd25519(
      owner,
      ownerSecretKey,
      [0],
      ownerPublicKey,
    ),
  );
  unifiedDualSign.addSignature(
    holder,
    await unifiedDualSign.signIxEd25519(
      holder,
      holderSecretKey,
      [1],
      holderPublicKey,
    ),
  );
  unifiedDualSign.validateWire();

  /**
   * 3. UnifiedPayerOnlyGas
   *
   * The wire signature layout matches UnifiedDualSign, but the payer acts as a sponsor:
   * - the sponsor pays gas and signs only the payer bit, and
   * - the owner and holder still authorize their own business instructions.
   */
  const unifiedPayerOnlyGas = new Transaction({
    stamp: stamp + 2n,
    payer: sponsor,
    instructions: instructions(holder, holder),
    chainId,
  });
  unifiedPayerOnlyGas.addSignature(
    sponsor,
    await unifiedPayerOnlyGas.signPayerEd25519(
      sponsor,
      sponsorSecretKey,
      sponsorPublicKey,
    ),
  );
  unifiedPayerOnlyGas.addSignature(
    owner,
    await unifiedPayerOnlyGas.signIxEd25519(
      owner,
      ownerSecretKey,
      [0],
      ownerPublicKey,
    ),
  );
  unifiedPayerOnlyGas.addSignature(
    holder,
    await unifiedPayerOnlyGas.signIxEd25519(
      holder,
      holderSecretKey,
      [1],
      holderPublicKey,
    ),
  );
  unifiedPayerOnlyGas.validateWire();

  /**
   * 4. Split
   *
   * The transaction has no unified payer. Each business signer uses
   * `signIxGasEd25519` to authorize both:
   * - its instruction bit, and
   * - gas for that instruction.
   *
   * Therefore, the owner pays for Mint and the holder pays for Transfer.
   */
  const split = new Transaction({
    stamp: stamp + 3n,
    payer: null,
    instructions: instructions(holder, holder),
    chainId,
  });
  split.addSignature(
    owner,
    await split.signIxGasEd25519(owner, ownerSecretKey, [0], {
      publicKey: ownerPublicKey,
    }),
  );
  split.addSignature(
    holder,
    await split.signIxGasEd25519(holder, holderSecretKey, [1], {
      publicKey: holderPublicKey,
    }),
  );
  split.validateWire();

  // Return Transaction instances so callers can serialize and submit them themselves.
  return {
    unifiedPayerSignAll,
    unifiedDualSign,
    unifiedPayerOnlyGas,
    split,
  };
}

export async function createTokenSimulate(
  network: Network = Network.DEVNET,
  idl: MilonIdl,
) {
  const provider = new IdlProvider(loadTokenIdl(idl));
  const tokenSignerSecretKey = SecretKey.generateDsa512();
  const tokenSignerPublicKey = await tokenSignerSecretKey.fnDsa512Public();
  const token = Address.fromPublicKey(tokenSignerPublicKey);
  const owner = Address.from(bs58ToHex("2z3mDaJLnGnSaur9She2KWj3wSDT"));
  const stamp = BigInt(Date.now()) + TX_STAMP_LEAD_MS;
  const chainId = BigInt(NetworkToChainId[network]);

  const create = provider.Create.arg({
    token,
    owner,
    metadata: {
      name: "SDK Test Token",
      symbol: "SDKT",
      decimals: 6,
      icon: "https://milon.test/token.png",
      uri: "https://milon.test/token.png",
    },
  }).encode;

  const tx = new Transaction({
    stamp,
    payer: token,
    instructions: [create],
    chainId,
  });

  const createSignature = await tx.signIxAndPayerFnDsa512(
    token,
    tokenSignerSecretKey,
    [0],
    token,
    tokenSignerPublicKey,
  );
  tx.addSignature(
    token,
    new AccountSignature({
      authBit: createSignature.authBit,
      sigBit: createSignature.sigBit,
      signatures: [],
      publicKey: createSignature.publicKey,
    }),
  );
  const txPostcardBytes = tx.postcardToBytes();
  const txPostcardArray = Array.from(txPostcardBytes);

  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.simulate_tx,
    body: txPostcardArray,
  });
  if (res.status !== 0) {
    throw new Error(
      `Request failed with status: ${res.status}, error: ${res.error}`,
    );
  }
  return res;
}

export const getEventByHash = async (
  network: Network,
  eventHashHex: string,
  typeTagFilter?: bigint | number | string,
) => {
  const request = new EventsByTxHashRequest({
    txHash: assertBytes(eventHashHex, 32, "eventHash"),
    ...(typeTagFilter !== undefined ? { typeTagFilter } : {}),
  });
  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.events_by_tx_hash,
    body: Array.from(request.toPostcardBytes()),
  });
  if (res.status !== 0) {
    throw new Error(
      `Request failed with status: ${res.status}, error: ${res.error}`,
    );
  }

  return res;
};

export const createAccount = async (
  network: Network,
  idl: MilonIdl,
  { fundWithFaucet = false, tokenIdl }: AutoFundOptions = {},
) => {
  const provider = new IdlProvider(idl);
  const ownerSecretKey = SecretKey.generateFnDsa512();
  const ownerPublicKey = await ownerSecretKey.fnDsa512Public();
  const owner = Address.fromPublicKey(ownerPublicKey);
  if (fundWithFaucet) {
    const faucet = await claim_faucet({
      network,
      claimerSecretKey: ownerSecretKey,
      ...(tokenIdl !== undefined ? { tokenIdl } : {}),
    });
    await waitForSuccessfulTransaction(network, faucet.txHash, "claim_faucet");
  }

  const stamp = BigInt(Date.now()) + TX_STAMP_LEAD_MS;
  const chainId = BigInt(NetworkToChainId[network]);

  const create = provider.CreateMultisig.arg({
    owner,
    signers: [ownerPublicKey],
    weights: [1],
    threshold: 1,
  }).encode;

  const tx = new Transaction({
    stamp,
    payer: owner,
    instructions: [create],
    chainId,
  });

  const payerSignature = await tx.signIxAndPayerFnDsa512(
    owner,
    ownerSecretKey,
    [0],
    owner,
    ownerPublicKey,
  );
  tx.addSignature(owner, payerSignature);

  const txPostcardBytes = tx.postcardToBytes();
  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.submit_tx,
    body: Array.from(txPostcardBytes),
  });
  if (res.status !== 0) {
    throw new Error(formatRpcError(res.status, res.error));
  }

  const hashBytes = res.body;
  if (hashBytes.length !== 32) {
    throw new Error(
      `submit_tx expected 32-byte hash, got ${hashBytes.length} bytes`,
    );
  }

  return {
    ...res,
    owner,
    ownerPublicKey,
    ownerSecretKey,
    tx,
  };
};

export const getAccount = async (network: Network, address: AddressLike) => {
  const accountAddress = Address.from(address);
  const serializer = new PostcardSerializer();
  serializer.serializeFixedBytes(accountAddress.bytes);

  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.get_account,
    body: Array.from(serializer.toUint8Array()),
  });
  if (res.status !== 0) {
    throw new Error(formatRpcError(res.status, res.error));
  }

  return res;
};

/** Fetch DID document/account information for multiple Base58 addresses. */
export const getAccountInfoBatch = async (
  network: Network,
  addresses: readonly string[],
) => {
  const provider = new IdlProvider(IdlName.Identity);
  const instructions = addresses.map(
    (address) =>
      provider.Document.arg({
        subject: Address.fromHex(bs58ToHex(address)),
      }).encode,
  );
  if (instructions.length === 0) return [];

  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.batch_view,
    body: instructions,
  });
  if (res.status !== 0) {
    throw new Error(formatRpcError(res.status, res.error));
  }
  return res;
};

export const getAccountMethod = async (
  network: Network,
  owner: AddressLike,
) => {
  const tx = buildListActiveVotes({ network, owner });
  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.view,
    body: tx,
  });
  if (res.status !== 0) {
    throw new Error(formatRpcError(res.status, res.error));
  }

  return res;
};

export const totalSupplyHandle = async (
  network: Network,
  owner: AddressLike,
) => {
  const tx = buildTotalSupply({ token: Address.from(owner) });
  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.view,
    body: tx,
  });
  if (res.status !== 0) {
    throw new Error(formatRpcError(res.status, res.error));
  }

  return res;
};

export const getResource = async (
  network: Network,
  resourceHash: BytesLike,
) => {
  const hash = assertBytes(resourceHash, 18, "resourceHash");
  const serializer = new PostcardSerializer();
  serializer.serializeFixedBytes(hash);

  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.get_resource,
    body: Array.from(serializer.toUint8Array()),
  });
  if (res.status !== 0) {
    throw new Error(
      `Request failed with status: ${res.status}, error: ${res.error}`,
    );
  }

  return res;
};

/**
 * Resolve resource paths from resource hashes.
 *
 * An 18-byte RsHash returns one path. A 32-byte transaction hash is resolved
 * through its receipt and returns the paths for its changed resources.
 */
export const get_resource_path_by_hash = async (
  network: Network,
  resourceHash: BytesLike[] | BytesLike,
) => {
  if (isResourceHashList(resourceHash)) {
    const serializer = new PostcardSerializer();
    serializer.serializeU32(resourceHash.length);
    resourceHash.forEach((value) =>
      serializer.serializeFixedBytes(normalizeResourceHash(value)),
    );
    const res = await new ClientHandler(network).request({
      method: RpcMethodEnum.batch_get_resource_path_by_hash,
      body: Array.from(serializer.toUint8Array()),
    });
    if (res.status !== 0) {
      throw new Error(
        `Request failed with status: ${res.status}, error: ${res.error}`,
      );
    }
    return res;
  }

  const candidateHash = decodeHashBytes(resourceHash);
  if (candidateHash.length === 32) {
    const transaction = await getTxByHash(network, candidateHash);
    if ("status" in transaction) return transaction;

    const resourceHashes = [
      ...new Map(
        transaction.receipt.accessResourceChanges.map((change) => [
          bytesToHex(change.resourceId),
          change.resourceId,
        ]),
      ).values(),
    ];
    if (resourceHashes.length === 0) {
      throw new Error("transaction has no access resource changes");
    }
    const serializer = new PostcardSerializer();
    serializer.serializeU32(resourceHashes.length);
    resourceHashes.forEach((value) => serializer.serializeFixedBytes(value));
    const res = await new ClientHandler(network).request({
      method: RpcMethodEnum.batch_get_resource_path_by_hash,
      body: Array.from(serializer.toUint8Array()),
    });
    if (res.status !== 0) {
      throw new Error(
        `Request failed with status: ${res.status}, error: ${res.error}`,
      );
    }
    return res;
  }

  const hash = normalizeResourceHash(resourceHash);
  const serializer = new PostcardSerializer();
  serializer.serializeFixedBytes(hash);

  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.get_resource_path_by_hash,
    body: Array.from(serializer.toUint8Array()),
  });
  if (res.status === 2) {
    return {
      ...res,
      body: undefined,
    };
  }
  if (res.status !== 0) {
    throw new Error(
      `Request failed with status: ${res.status}, error: ${res.error}`,
    );
  }

  return res;
};

function isResourceHashList(
  value: BytesLike | BytesLike[],
): value is BytesLike[] {
  return (
    Array.isArray(value) && (value.length === 0 || typeof value[0] !== "number")
  );
}

function normalizeResourceHash(resourceHash: BytesLike): Uint8Array {
  const hash = decodeHashBytes(resourceHash);

  return assertBytes(hash, 18, "resourceHash (RsHash)");
}

function decodeHashBytes(hashValue: BytesLike): Uint8Array {
  let hash: Uint8Array;
  if (typeof hashValue === "string") {
    try {
      hash = hexToBytes(hashValue);
    } catch {
      hash = bs58ToBytes(hashValue);
    }
  } else {
    hash = toBytes(hashValue);
  }
  return hash;
}

export const get_access_value = async (
  network: Network,
  blobHash: BytesLike,
) => {
  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.get_access_value,
    body: assertBytes(blobHash, 32, "blobHash"),
  });
  if (res.status !== 0) {
    throw new Error(
      `Request failed with status: ${res.status}, error: ${res.error}`,
    );
  }

  return res;
};

export const batch_get_access_value = async (network: Network, blobHashes: readonly BytesLike[]) => {
  if (blobHashes.length === 0) throw new Error("blobHashes must not be empty");
  // The node's batch endpoint returns per-item Result values. Keep this public
  // convenience API deterministic until callers need those individual failures.
  const responses = await Promise.all(blobHashes.map((hash) => get_access_value(network, hash)));
  return { body: responses.map((response) => response.body) };
};

export const get_resource_list_by_hash = async (
  network: Network,
  txhash: BytesLike,
  isFiller = true,
) => {
  const result = await getTxByHash(network, txhash);
  if ("status" in result) {
    throw new Error(formatRpcError(result.status, result.error));
  }
  const history = result;
  const changesData = isFiller
    ? history.receipt.accessResourceChanges.filter(
        (item) => item.resourceId[0] === 2 && item.resourceId[1] === 34,
      )
    : history.receipt.accessResourceChanges;
  const changes = changesData;

  const externalBlobHashes = new Map<string, Uint8Array>();
  for (const change of changes) {
    for (const value of [change.firstSnapshot, change.lastWritten]) {
      if (value?.kind === KindEnum.EXTERNAL) {
        externalBlobHashes.set(value.blobHashHex, value.blobHash); // Batch-fetch external blobs.
      }
    }
  }

  const [resourcePaths, accessValueResponse] = await Promise.all([
    Promise.all(
      changes.map((change) =>
        get_resource_path_by_hash(network, change.resourceId),
      ),
    ),
    externalBlobHashes.size > 0
      ? batch_get_access_value(network, [...externalBlobHashes.values()])
      : Promise.resolve(undefined),
  ]);
  const accessValuesByHash = new Map(
    (accessValueResponse?.body ?? []).map((entry) => [
      bytesToHex(entry.hash),
      entry.value,
    ]),
  );

  const resolveExternalValue = (
    value: (typeof changes)[number]["lastWritten"] | undefined,
  ) => {
    if (value?.kind !== "external") return value;
    const resolved = accessValuesByHash.get(value.blobHashHex);
    if (!resolved) return value;
    return {
      ...value,
      typeTag: resolved.typeTag,
      bytes: resolved.bytes,
      ...(resolved.decoded !== undefined ? { decoded: resolved.decoded } : {}),
      ...(resolved.error !== undefined ? { error: resolved.error } : {}),
    };
  };

  return {
    txData: result,
    txChanges: changes.map((change, index) => ({
      lastWritten: resolveExternalValue(change.lastWritten),
      firstSnapshot: resolveExternalValue(change.firstSnapshot),
      resourcePath: resourcePaths[index]!.body,
      resourceIdParsed: change.resourceIdParsed,
    })),
  };
};

export const claim_faucet = async ({
  network,
  claimerSecretKey,
  tokenIdl,
  stamp = BigInt(Date.now()) + TX_STAMP_LEAD_MS,
}: ClaimFaucetOptions) => {
  const provider = new IdlProvider(loadTokenIdl(tokenIdl));
  const instructionDefinition = provider.getInstruction("ClaimFaucet");
  if (
    instructionDefinition.kind !== "entry" ||
    instructionDefinition.sponsor !== true
  ) {
    throw new Error(
      "Token IDL ClaimFaucet must be a sponsored entry instruction",
    );
  }

  const isFnDsa512 = claimerSecretKey.kind === SecretKeyKind.FN_DSA512;
  const claimerPublicKey = isFnDsa512
    ? await claimerSecretKey.fnDsa512Public()
    : await claimerSecretKey.ed25519Public();
  const claimer = Address.fromPublicKey(claimerPublicKey);
  const instruction = provider.ClaimFaucet.arg({
    claimer: new Signer(claimer),
  }).encode;
  const tx = new Transaction({
    stamp,
    payer: null,
    instructions: [instruction],
    chainId: BigInt(NetworkToChainId[network]),
  });

  const signature = isFnDsa512
    ? await tx.signIxFnDsa512(claimer, claimerSecretKey, [0], claimerPublicKey)
    : await tx.signIxEd25519(claimer, claimerSecretKey, [0], claimerPublicKey);
  tx.addSignature(claimer, signature);
  tx.validateWire([0]);

  const txPostcardBytes = tx.postcardToBytes();
  const res = await new ClientHandler(network).request({
    method: RpcMethodEnum.submit_tx,
    body: Array.from(txPostcardBytes),
  });
  if (res.status !== 0) {
    throw new Error(formatRpcError(res.status, res.error));
  }

  const txHash = assertBytes(res.body, 32, "submit_tx hash");
  return {
    ...res,
    postcardData: res.postcardData,
    body: txHash,
    txHash,
    claimer,
    claimerPublicKey,
    tx,
  };
};

export async function waitForSuccessfulTransaction(
  network: Network,
  txHash: BytesLike,
  operation: string,
): Promise<void> {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    let response;
    try {
      response = await getTxByHash(network, txHash);
    } catch (error) {
      // A node can briefly have no complete committed snapshot while rotating
      // its read view. Treat RPC Status::Unavailable as transient while
      // waiting for a transaction; all other RPC failures remain terminal.
      if (!isUnavailableRpcError(error)) throw error;
      await delay(100);
      continue;
    }
    if (!("status" in response)) {
      if (response.receipt.error !== undefined) {
        throw new Error(
          `${operation} transaction failed with code ${response.receipt.error}`,
        );
      }
      return;
    }
    if (response.status !== 2) {
      throw new Error(formatRpcError(response.status, response.error));
    }
    await delay(100);
  }
  throw new Error(`${operation} transaction was not committed before timeout`);
}

function isUnavailableRpcError(error: unknown): boolean {
  return error instanceof Error && /Request failed with status: 4\b/.test(error.message);
}

function formatRpcError(status: number, error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return `Request failed with status: ${status}, error: ${String(error.message)}`;
  }
  if (error !== undefined && error !== null) {
    let details: string;
    try {
      details = JSON.stringify(error);
    } catch {
      details = String(error);
    }
    return `Request failed with status: ${status}, error: ${details}`;
  }
  return `Request failed with status: ${status}`;
}
