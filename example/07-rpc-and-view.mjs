import {
  Address,
  ClientHandler,
  Network,
  RpcMethodEnum,
  TokenMethods,
  executeViewJson,
  getBlockHead,
} from "../dist/index.js";

if (process.env.MILON_RUN_NETWORK_EXAMPLES !== "1") {
  console.log("Skipped: set MILON_RUN_NETWORK_EXAMPLES=1 to access DEVNET.");
  process.exit(0);
}

const head = await getBlockHead(Network.DEVNET);
console.log("chain head", head);

const client = new ClientHandler(Network.DEVNET, { timeoutMs: 10_000 });
const lowLevelHead = await client.request({
  method: RpcMethodEnum.chain_head,
  body: [],
});
if (lowLevelHead.status !== 0) {
  throw new Error(lowLevelHead.error?.message ?? `RPC status ${lowLevelHead.status}`);
}
console.log("low-level chain head", lowLevelHead.body);

const token = Address.fromHex("0000000000000000000000000000000000000000").toBase58();
const account = Address.fromHex("00112233445566778899aabbccddeeff00112233").toBase58();
const viewInput = {
  app: "Token",
  instructions: [{ method: "BalanceOf", args: { token, account } }],
};

// executeViewJson validates JSON, encodes IDL arguments, sends the request, and decodes return values.
const viewResponse = await executeViewJson(Network.DEVNET, viewInput);
console.log("view JSON response", viewResponse);

// You can also build one View instruction directly and pass it to ClientHandler's view RPC.
const balanceInstruction = TokenMethods.balanceOf({ token, account });
const rawViewResponse = await client.request({
  method: RpcMethodEnum.view,
  body: [balanceInstruction],
});
console.log("low-level view response", rawViewResponse);
