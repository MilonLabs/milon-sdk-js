import {
  assertBytes,
  concatBytes,
  u32ToBeBytes,
  u64ToBeBytes,
  type BytesLike,
  type U64Like,
} from "../crypto/bytes";
import { blake3Hash, HASH_CONTEXT } from "../crypto/hash";
import type { Deserializer as BcsDeserializer } from "../bcs/deserializer";
import { Serializer as BcsSerializer, serializeBcs } from "../bcs/serializer";
import { chainIdToBytes, type ChainIdLike } from "../chain/index";
import { BLOCK_HEADER_DOMAIN } from "./hash-domain";
import type { TxHash } from "./transaction";

export function txProofIdentifier(blockId: U64Like, indexInBlock: number): Uint8Array {
  const out = new Uint8Array(12);
  new DataView(out.buffer).setBigUint64(0, BigInt(blockId), false);
  new DataView(out.buffer).setUint32(8, Number(indexInBlock), false);
  return out;
}

/** Current Rust Block header/wire model. */
export class Block {
  readonly number: bigint;
  readonly epoch: bigint;
  readonly hash: TxHash;
  readonly prevHash: Uint8Array;
  readonly stateHash: Uint8Array;
  readonly txRoot: Uint8Array;
  readonly txCount: number;
  readonly timestamp: bigint;

  static hash({ number, epoch, prevHash, txRoot, txCount, stateHash, chainId }: {
    number: U64Like;
    epoch: U64Like;
    prevHash: BytesLike;
    txRoot: BytesLike;
    txCount: number;
    stateHash: BytesLike;
    chainId?: ChainIdLike;
  }): Uint8Array {
    return blake3Hash(concatBytes(
      HASH_CONTEXT,
      BLOCK_HEADER_DOMAIN,
      chainIdToBytes(chainId),
      u64ToBeBytes(number),
      u64ToBeBytes(epoch),
      assertBytes(prevHash, 32, "prevHash"),
      assertBytes(txRoot, 32, "txRoot"),
      u32ToBeBytes(txCount),
      assertBytes(stateHash, 32, "stateHash"),
    ));
  }

  constructor({ number, epoch, hash = null, prevHash, stateHash, txRoot, txCount, timestamp, chainId }: {
    number: U64Like;
    epoch: U64Like;
    hash?: BytesLike | null;
    prevHash: BytesLike;
    stateHash: BytesLike;
    txRoot: BytesLike;
    txCount: number;
    timestamp: U64Like;
    chainId?: ChainIdLike;
  }) {
    this.number = BigInt(number);
    this.epoch = BigInt(epoch);
    this.prevHash = assertBytes(prevHash, 32, "prevHash");
    this.stateHash = assertBytes(stateHash, 32, "stateHash");
    this.txRoot = assertBytes(txRoot, 32, "txRoot");
    if (!Number.isInteger(txCount) || txCount < 0 || txCount > 0xffff_ffff) {
      throw new RangeError("txCount must be a u32");
    }
    this.txCount = txCount;
    this.timestamp = BigInt(timestamp);
    this.hash = hash ? assertBytes(hash, 32, "block hash") : Block.hash({
      number: this.number,
      epoch: this.epoch,
      prevHash: this.prevHash,
      stateHash: this.stateHash,
      txRoot: this.txRoot,
      txCount: this.txCount,
      ...(chainId !== undefined ? { chainId } : {}),
    });
  }

  serialize(serializer: BcsSerializer): void {
    serializer.serializeU64(this.number);
    serializer.serializeU64(this.epoch);
    serializer.serializeFixedBytes(this.hash);
    serializer.serializeFixedBytes(this.prevHash);
    serializer.serializeFixedBytes(this.stateHash);
    serializer.serializeFixedBytes(this.txRoot);
    serializer.serializeU32(this.txCount);
    serializer.serializeU64(this.timestamp);
  }

  bcsToBytes(): Uint8Array {
    return serializeBcs(this);
  }

  static deserialize(deserializer: BcsDeserializer): Block {
    return new Block({
      number: deserializer.deserializeU64(),
      epoch: deserializer.deserializeU64(),
      hash: deserializer.deserializeFixedBytes(32),
      prevHash: deserializer.deserializeFixedBytes(32),
      stateHash: deserializer.deserializeFixedBytes(32),
      txRoot: deserializer.deserializeFixedBytes(32),
      txCount: deserializer.deserializeU32(),
      timestamp: deserializer.deserializeU64(),
    });
  }
}
