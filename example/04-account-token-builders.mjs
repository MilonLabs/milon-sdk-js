import {
  AccountMethods,
  Address,
  Network,
  NetworkToChainId,
  SecretKey,
  TokenMethods,
} from "../dist/index.js";

const secretKey = SecretKey.generateClassical();
const publicKey = await secretKey.ed25519Public();
const owner = Address.fromPublicKey(publicKey);
const recipient = Address.fromHex("11223344556677889900aabbccddeeff00112233");
const chainId = BigInt(NetworkToChainId[Network.DEVNET]);
const stamp = BigInt(Date.now()) + 30_000n;

// Advanced builders return a Transaction directly; they do not sign or submit it automatically.
const createAccountTx = AccountMethods.createAccount({ ownerPk: publicKey, stamp, chainId });
await createAccountTx.signEd25519(owner, secretKey, publicKey);
createAccountTx.validateWire();

const transferTx = TokenMethods.transfer({
  token: owner,
  from: owner,
  to: recipient,
  amount: 25n,
  stamp: stamp + 1n,
  chainId,
});
await transferTx.signEd25519(owner, secretKey, publicKey);
transferTx.validateWire();

const balanceView = TokenMethods.balanceOf({ token: owner, account: recipient });
const accountView = AccountMethods.getAccount({ owner });

// A multisig account can first create a proposal and intent hash for an immutable instruction set.
const preparedVote = AccountMethods.prepareVoteProposal({
  instructions: transferTx.instructions,
  chainId,
});

console.log({
  createAccountInstructions: createAccountTx.instructions.length,
  transferInstructions: transferTx.instructions.length,
  balanceViewBytes: balanceView.length,
  accountViewBytes: accountView.length,
  voteIntentHash: Array.from(preparedVote.intentHash),
});
