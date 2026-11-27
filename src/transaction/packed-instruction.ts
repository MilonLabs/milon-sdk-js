import { assertBytes, concatBytes, type BytesLike } from "../crypto/bytes";
import { blake3Hash, HASH_CONTEXT } from "../crypto/hash";
import { chainIdToBytes, type ChainIdLike } from "../chain/index";
import { IX_HASH_DOMAIN } from "./hash-domain";

export const MIN_PACKED_INSTRUCTION_LEN = 3;
export const MAX_PACKED_INSTRUCTION_LEN = 64 * 1024;

/** Transparent owner for `app_id || discriminator u16 LE || postcard(args)` instruction bytes. */
export class PackedInstruction {
  readonly bytes: Uint8Array;

  constructor(bytes: BytesLike) {
    this.bytes = assertBytes(bytes, undefined, "PackedInstruction");
  }

  static from(value: BytesLike | PackedInstruction): PackedInstruction {
    return value instanceof PackedInstruction ? value : new PackedInstruction(value);
  }

  validateLength(): this {
    if (
      this.bytes.length < MIN_PACKED_INSTRUCTION_LEN ||
      this.bytes.length > MAX_PACKED_INSTRUCTION_LEN
    ) {
      throw new RangeError(
        `packed instruction length must be in ${MIN_PACKED_INSTRUCTION_LEN}..${MAX_PACKED_INSTRUCTION_LEN}`,
      );
    }
    return this;
  }

  ixHash(chainId?: ChainIdLike): Uint8Array {
    return blake3Hash(concatBytes(
      HASH_CONTEXT,
      IX_HASH_DOMAIN,
      chainIdToBytes(chainId),
      this.bytes,
    ));
  }

  toBytes(): Uint8Array {
    return this.bytes.slice();
  }
}
