const textEncoder = new TextEncoder();
/// Domain separator for instruction hashes.
export const IX_HASH_DOMAIN = textEncoder.encode("milon.ix.v1");
/// Domain separator for transaction hashes.
export const TX_HASH_DOMAIN = textEncoder.encode("milon.tx.v1");
/// Domain separator for account authorization messages.
export const TX_AUTH_DOMAIN = textEncoder.encode("milon.tx.auth.v1");
/// Domain separator for block header hashes.
export const BLOCK_HEADER_DOMAIN = textEncoder.encode("milon.block.header.v1");
/// Domain separator for transaction history and receipt hashes.
export const TX_HISTORY_DOMAIN = textEncoder.encode("milon.tx-history.v1");
/// Domain separator for combined transaction-hash and proof-list hashes.
export const TX_BATCH_HASH_DOMAIN = textEncoder.encode("milon.tx-batch.v1");
export const TX_HISTORY_LEAF_DOMAIN = textEncoder.encode("milon.tx-history.leaf.v1");
export const TX_MERKLE_NODE_DOMAIN = textEncoder.encode("milon.tx-merkle.node.v1");
export const TX_MERKLE_PAD_DOMAIN = textEncoder.encode("milon.tx-merkle.pad.v1");
