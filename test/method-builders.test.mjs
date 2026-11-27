import test from "node:test";
import assert from "node:assert/strict";
import {
  AccountMethods,
  AccountSignature,
  Address,
  buildTokenTransactionModeExamples,
  IdlName,
  IdlProvider,
  Network,
  PublicKey,
  PublicKeyKind,
  SecretKey,
  Signature,
  SignatureKind,
  TokenMethods,
  Transaction,
} from "../dist/index.js";

const tokenProvider = new IdlProvider(IdlName.Token);
const accountProvider = new IdlProvider(IdlName.Account);
const token = new Address(new Uint8Array(20).fill(1));
const owner = new Address(new Uint8Array(20).fill(2));
const other = new Address(new Uint8Array(20).fill(3));
const publicKey = new PublicKey(
  PublicKeyKind.ED25519,
  new Uint8Array(32).fill(4),
);
const metadata = {
  name: "Method Test",
  symbol: "MT",
  decimals: 6,
  icon: "https://example.com/icon.png",
  uri: "https://example.com/icon.png",
};
const entryOptions = {
  network: Network.DEVNET,
  payer: owner,
  stamp: 1_000n,
};

test("TokenMethods covers every token IDL instruction", () => {
  const entries = new Map([
    ["Create", TokenMethods.createToken({ ...entryOptions, token, owner, metadata })],
    ["AbandonOwner", TokenMethods.abandonOwner({ ...entryOptions, token })],
    ["TransferOwner", TokenMethods.transferOwner({ ...entryOptions, token, to: other })],
    ["AbandonFreezer", TokenMethods.abandonFreezer({ ...entryOptions, token })],
    ["TransferFreezer", TokenMethods.transferFreezer({ ...entryOptions, token, to: other })],
    ["Mint", TokenMethods.mint({ ...entryOptions, token, to: other, amount: 1n })],
    ["MintBatch", TokenMethods.mintBatch({ ...entryOptions, token, to: [other], amount: [1n] })],
    ["Burn", TokenMethods.burn({ ...entryOptions, token, holder: owner, amount: 1n })],
    ["Transfer", TokenMethods.transfer({ ...entryOptions, token, from: owner, to: other, amount: 1n })],
    ["TransferBatch", TokenMethods.transferBatch({ ...entryOptions, token, from: owner, to: [other], amount: [1n] })],
    ["Freeze", TokenMethods.freeze({ ...entryOptions, token, holder: other, amount: 1n })],
    ["Unfreeze", TokenMethods.unfreeze({ ...entryOptions, token, holder: other, amount: 1n })],
    ["Approve", TokenMethods.approve({ ...entryOptions, token, owner, spender: other, amount: 1n })],
    ["Revoke", TokenMethods.revoke({ ...entryOptions, token, owner, spender: other })],
    ["TransferFrom", TokenMethods.transferFrom({ ...entryOptions, token, spender: owner, from: other, amount: 1n })],
    ["SetIcon", TokenMethods.setIcon({ ...entryOptions, token, iconUrl: metadata.icon })],
    ["SetUri", TokenMethods.setUri({ ...entryOptions, token, uri: metadata.uri })],
    ["CreateWithCompliance", TokenMethods.createWithCompliance({
      ...entryOptions,
      token,
      owner,
      metadata,
      credentialId: "kyc",
    })],
    ["SetComplianceMode", TokenMethods.setComplianceMode({ ...entryOptions, token, mode: "All" })],
    ["AddComplianceRequirement", TokenMethods.addComplianceRequirement({
      ...entryOptions,
      token,
      credentialId: "kyc",
    })],
    ["RemoveComplianceRequirement", TokenMethods.removeComplianceRequirement({
      ...entryOptions,
      token,
      credentialId: "kyc",
    })],
    ["ClearComplianceRequirements", TokenMethods.clearComplianceRequirements({ ...entryOptions, token })],
    ["DiscloseTokenVcAttestation", TokenMethods.discloseTokenVcAttestation({
      ...entryOptions,
      token,
      issuer: other,
      issuerKeyId: 0,
      credentialSchema: "kyc",
      credentialHash: new Uint8Array(32),
      validUntilMs: 1n,
      issuerSignature: new Signature(SignatureKind.ED25519, new Uint8Array(64)),
    })],
    ["ClaimFaucet", TokenMethods.claimFaucet({ ...entryOptions, claimer: owner })],
    ["CreateEqualHongbao", TokenMethods.createEqualHongbao({ ...entryOptions, creator: owner, token, totalAmount: 10n, claimCount: 2n, rules: {} })],
    ["CreateLuckyHongbao", TokenMethods.createLuckyHongbao({ ...entryOptions, creator: owner, token, totalAmount: 10n, claimCount: 2n, rules: {} })],
    ["CreateCredentialHongbao", TokenMethods.createCredentialHongbao({ ...entryOptions, creator: owner, token, totalAmount: 10n, claimCount: 2n, allocation: "Equal", credentialIds: ["kyc", "accredited"] })],
    ["CreateSftHongbao", TokenMethods.createSftHongbao({ ...entryOptions, creator: owner, token, totalAmount: 10n, claimCount: 2n, allocation: "Equal", sft: other, minAmount: 1n })],
    ["ClaimHongbao", TokenMethods.claimHongbao({ ...entryOptions, claimant: owner, hongbaoId: other })],
    ["RefundHongbao", TokenMethods.refundHongbao({ ...entryOptions, hongbaoId: other })],
    ["ScheduleHongbaoRefund", TokenMethods.scheduleHongbaoRefund({ ...entryOptions, hongbaoId: other })],
    ["RunHongbaoRefund", TokenMethods.runHongbaoRefund({ ...entryOptions, hongbaoId: other })],
    ["RunHongbaoCleanup", TokenMethods.runHongbaoCleanup({ ...entryOptions, hongbaoId: other })],
    ["CreateVesting", TokenMethods.createVesting({
      ...entryOptions, creator: owner, token, startAtMs: 1n,
      recipients: [{ recipient: other, totalAmount: 10n, initialAmount: 1n, periodSeconds: 60n, periods: 9n, amountPerPeriod: 1n }],
    })],
    ["ClaimVesting", TokenMethods.claimVesting({ ...entryOptions, claimant: owner, vestingId: other })],
  ]);
  const views = new Map([
    ["BalanceOf", TokenMethods.balanceOf({ token, account: owner })],
    ["FrozenOf", TokenMethods.frozenOf({ token, account: owner })],
    ["ApprovalOf", TokenMethods.approvalOf({ token, owner, spender: other })],
    ["TotalSupply", TokenMethods.totalSupply({ token })],
    ["Metadata", TokenMethods.metadata({ token })],
    ["Compliance", TokenMethods.compliance({ token })],
    ["FaucetCooldownRemaining", TokenMethods.faucetCooldownRemaining({ account: owner })],
    ["HongbaoMessage", TokenMethods.hongbaoMessage({ hongbaoId: other })],
    ["HongbaoInfo", TokenMethods.hongbaoInfo({ hongbaoId: other })],
    ["HongbaoSettlement", TokenMethods.hongbaoSettlement({ hongbaoId: other })],
    ["CanClaimHongbao", TokenMethods.canClaimHongbao({ hongbaoId: other, claimant: owner })],
    ["VestingInfo", TokenMethods.vestingInfo({ vestingId: other })],
    ["VestingClaimable", TokenMethods.vestingClaimable({ vestingId: other, recipient: owner })],
  ]);

  assert.equal(entries.size + views.size, tokenProvider.methodNames.length);
  for (const [name, tx] of entries) {
    assert.ok(tx instanceof Transaction);
    assert.equal(tokenProvider.decodeAny(tx.instructions[0]).method, name);
  }
  for (const [name, instruction] of views) {
    assert.ok(instruction instanceof Uint8Array);
    assert.equal(tokenProvider.decodeAny(instruction).method, name);
  }
});

test("AccountMethods covers every account IDL instruction", () => {
  const intentHash = new Uint8Array(32).fill(5);
  const entries = new Map([
    ["Create", AccountMethods.createAccount({ ...entryOptions, ownerPk: publicKey })],
    ["EnsureAccount", AccountMethods.ensureAccount({ ...entryOptions, ownerPk: publicKey })],
    ["CreateMultisig", AccountMethods.createMultisig({
      ...entryOptions,
      owner,
      signers: [publicKey],
      weights: new Uint8Array([1]),
      threshold: 1,
    })],
    ["AddSigner", AccountMethods.addSigner({ ...entryOptions, owner, signerPk: publicKey, weight: 1 })],
    ["AddSignerByAddress", AccountMethods.addSignerByAddress({ ...entryOptions, owner, signer: other, weight: 1 })],
    ["AddSigners", AccountMethods.addSigners({
      ...entryOptions,
      owner,
      signers: [publicKey],
      weights: new Uint8Array([1]),
      threshold: 1,
    })],
    ["AddSignersByAddress", AccountMethods.addSignersByAddress({
      ...entryOptions, owner, signers: [other], weights: new Uint8Array([1]), threshold: 1,
    })],
    ["RemoveSigner", AccountMethods.removeSigner({ ...entryOptions, owner, index: 0, threshold: 1 })],
    ["SetThreshold", AccountMethods.setThreshold({ ...entryOptions, owner, threshold: 1 })],
    ["SetSignerWeight", AccountMethods.setSignerWeight({ ...entryOptions, owner, index: 0, weight: 1 })],
    ["VoteInit", AccountMethods.voteInit({
      ...entryOptions,
      owner,
      intentHash,
      proposal: { instructions: [new Uint8Array([1])], authBit: 1n },
    })],
    ["Vote", AccountMethods.vote({ ...entryOptions, owner, intentHash })],
    ["SweepExpiredVotes", AccountMethods.sweepExpiredVotes(entryOptions)],
  ]);
  const views = new Map([
    ["GetAccount", AccountMethods.getAccount({ owner })],
    ["ListSigners", AccountMethods.listSigners({ owner })],
    ["ResolveSigners", AccountMethods.resolveSigners({
      owner,
      sigBit: 1n,
      policy: { minSigners: 1 },
    })],
    ["GetVote", AccountMethods.getVote({ owner, intentHash })],
    ["ListActiveVotes", AccountMethods.listActiveVotes({ owner })],
  ]);

  assert.equal(entries.size + views.size, accountProvider.methodNames.length);
  for (const [name, tx] of entries) {
    assert.ok(tx instanceof Transaction);
    assert.equal(accountProvider.decodeAny(tx.instructions[0]).method, name);
  }
  for (const [name, instruction] of views) {
    assert.ok(instruction instanceof Uint8Array);
    assert.equal(accountProvider.decodeAny(instruction).method, name);
  }
});

test("AccountMethods builds and submits Rust-compatible voted transactions", async () => {
  const proposalInstruction = tokenProvider.Mint.arg({
    token,
    to: other,
    amount: 1n,
  }).encode;
  const prepared = AccountMethods.prepareVoteProposal({
    instructions: [proposalInstruction],
    chainId: 900_000_001n,
  });
  assert.equal(prepared.intentHash.length, 32);
  assert.deepEqual(
    prepared.intentHash,
    AccountMethods.voteIntentHash(prepared.proposal, 900_000_001n),
  );

  const relayerKey = SecretKey.generateClassical();
  const relayer = Address.fromPublicKey(await relayerKey.ed25519Public());
  const multisigOwner = new Address(new Uint8Array(20).fill(9));
  const transaction = new Transaction({
    chainId: 900_000_001n,
    stamp: 456n,
    payer: relayer,
    instructions: prepared.proposal.instructions,
  });
  transaction.addSignature(
    relayer,
    await transaction.signPayerEd25519(relayer, relayerKey),
  );
  let submitted;
  const result = await AccountMethods.sendVotedTransaction({
    transport: {
      async request(method, params) {
        submitted = { method, params };
        return "submitted";
      },
    },
    transaction,
    owner: multisigOwner,
  });

  assert.equal(result, "submitted");
  assert.equal(submitted.method, "submitTransaction");
  const voteSignature = transaction.signatures.find(([address]) =>
    address.equals(multisigOwner)
  )[1];
  assert.equal(voteSignature.authBit, AccountSignature.authVoteIxes([0]));
  assert.equal(voteSignature.authorizesVote(), true);
  assert.equal(voteSignature.sigBit, 0n);
  assert.equal(voteSignature.signatures.length, 0);
  assert.equal(voteSignature.publicKey, null);
  transaction.validateWire();
});

test("token transaction examples cover all four gas payment modes", async () => {
  const ownerSecretKey = SecretKey.generateClassical();
  const holderSecretKey = SecretKey.generateClassical();
  const payerSecretKey = SecretKey.generateClassical();
  const sponsorSecretKey = SecretKey.generateClassical();
  const recipientSecretKey = SecretKey.generateClassical();
  const tokenSecretKey = SecretKey.generateClassical();
  const recipient = Address.fromPublicKey(
    await recipientSecretKey.ed25519Public(),
  );
  const token = Address.fromPublicKey(await tokenSecretKey.ed25519Public());

  const examples = await buildTokenTransactionModeExamples({
    network: Network.DEVNET,
    stamp: 10_000n,
    token,
    recipient,
    ownerSecretKey,
    holderSecretKey,
    payerSecretKey,
    sponsorSecretKey,
  });
  const allIxAndPayer =
    AccountSignature.authIxes([0, 1]) | AccountSignature.authPayer();

  assert.equal(examples.unifiedPayerSignAll.signatures.length, 1);
  assert.equal(
    examples.unifiedPayerSignAll.signatures[0][1].authBit,
    allIxAndPayer,
  );

  for (const tx of [
    examples.unifiedDualSign,
    examples.unifiedPayerOnlyGas,
  ]) {
    assert.equal(tx.signatures.length, 3);
    assert.equal(
      tx.signatures[0][1].authBit,
      AccountSignature.authPayer(),
    );
    assert.equal(
      tx.signatures[1][1].authBit,
      AccountSignature.authIx(0),
    );
    assert.equal(
      tx.signatures[2][1].authBit,
      AccountSignature.authIx(1),
    );
  }

  assert.equal(examples.split.payer, null);
  assert.equal(examples.split.signatures.length, 2);
  assert.equal(
    examples.split.signatures[0][1].authBit,
    AccountSignature.authIxAndPayer(0),
  );
  assert.equal(
    examples.split.signatures[1][1].authBit,
    AccountSignature.authIxAndPayer(1),
  );

  for (const tx of Object.values(examples)) {
    assert.equal(tokenProvider.decodeAny(tx.instructions[0]).method, "Mint");
    assert.equal(
      tokenProvider.decodeAny(tx.instructions[1]).method,
      "Transfer",
    );
    tx.validateWire();
  }
});
