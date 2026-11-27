import {
  Address,
  Network,
  NetworkToChainId,
  TransactionJsonCodec,
  TransactionJsonError,
} from "../dist/index.js";

const address = Address.fromHex("00112233445566778899aabbccddeeff00112233").toBase58();
const input = {
  app: "Token",
  tx: {
    stamp: String(Date.now() + 30_000),
    payer: address,
    instructions: [{
      method: "Create",
      args: {
        token: address,
        owner: address,
        metadata: {
          name: "JSON Token",
          symbol: "JSON",
          decimals: 6,
          icon: "https://example.com/json-token.png",
        },
      },
    }],
    chainId: String(NetworkToChainId[Network.DEVNET]),
  },
};

const codec = new TransactionJsonCodec();
try {
  const transaction = codec.fromJson(input);
  const postcard = transaction.postcardToBytes();
  console.log("canonical JSON\n", codec.stringify(transaction, 2));
  console.log("from postcard", codec.fromPostcard(postcard, {
    chainId: input.tx.chainId,
  }));
} catch (error) {
  if (error instanceof TransactionJsonError) {
    console.error(error.code, error.path, error.message);
  } else {
    throw error;
  }
}
