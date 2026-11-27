import {
  Address,
  IdlName,
  IdlProvider,
  Network,
  NetworkToChainId,
  SecretKey,
  Transaction,
  bytesToHex,
} from "../dist/index.js";

const secretKey = SecretKey.generateClassical();
const publicKey = await secretKey.ed25519Public();
const owner = Address.fromPublicKey(publicKey);
const provider = new IdlProvider(IdlName.Token);

const createInstruction = provider.Create.arg({
  token: owner,
  owner,
  metadata: {
    name: "Example Token",
    symbol: "EXM",
    decimals: 6,
    icon: "https://example.com/token.png",
  },
}).encode;

const decodedInstruction = provider.Create.arg(createInstruction).decode;
console.log("decoded instruction", decodedInstruction.method, decodedInstruction.args);

const chainId = BigInt(NetworkToChainId[Network.DEVNET]);
const transaction = new Transaction({
  stamp: BigInt(Date.now()) + 30_000n,
  payer: owner,
  instructions: [createInstruction],
  chainId,
});

// Authorize every instruction and the payer together.
await transaction.signEd25519(owner, secretKey, publicKey);
transaction.validateWire();

const postcard = transaction.postcardToBytes();
const restored = Transaction.fromPostcard(postcard, chainId);
restored.validateWire();

console.log("transaction", {
  payer: owner.toBase58(),
  hash: bytesToHex(transaction.txHash()),
  postcard: bytesToHex(postcard),
  roundTripHash: bytesToHex(restored.txHash()),
});
