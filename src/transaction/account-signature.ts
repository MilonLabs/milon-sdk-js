import { PublicKey, type PublicKeyLike } from "../crypto/public-key";
import { Signature, type SignatureLike } from "../crypto/signature";
import type { Deserializer as BcsDeserializer } from "../bcs/deserializer";
import type { Serializer as BcsSerializer } from "../bcs/serializer";

export interface MultisigEntry {
  index: number;
  signature: SignatureLike;
}

export interface AccountSignatureOptions {
  authBit?: bigint | number | string;
  sigBit?: bigint | number | string;
  signatures?: SignatureLike[];
  publicKey?: PublicKeyLike | null;
}

export class AccountSignature {
  static readonly AUTH_VOTE_BIT = 62;
  static readonly AUTH_PAYER_BIT = 63;

  readonly authBit: bigint;
  readonly sigBit: bigint;
  readonly signatures: Signature[];
  readonly publicKey: PublicKey | null;

  static single(signature: SignatureLike, publicKey: PublicKeyLike): AccountSignature {
    return new AccountSignature({
      authBit: 0n,
      sigBit: 0n,
      signatures: [signature],
      publicKey
    });
  }

  static multisig(entries: MultisigEntry[]): AccountSignature {
    let sigBit = 0n;
    const signatures: SignatureLike[] = [];
    for (const { index, signature } of entries) {
      if (!Number.isInteger(index) || index < 0 || index >= 64) {
        throw new RangeError("multisig index must be in 0..63");
      }
      sigBit |= 1n << BigInt(index);
      signatures.push(signature);
    }
    return new AccountSignature({ authBit: 0n, sigBit, signatures });
  }

  static authIx(ix: number): bigint {
    if (!Number.isInteger(ix) || ix < 0 || ix >= AccountSignature.AUTH_VOTE_BIT) {
      throw new RangeError("ix auth bit must be in 0..61");
    }
    return 1n << BigInt(ix);
  }

  static authPayer(): bigint {
    return 1n << 63n;
  }

  static authIxAndPayer(ix: number): bigint {
    return AccountSignature.authIx(ix) | AccountSignature.authPayer();
  }

  static authIxes(ixes: Iterable<number>): bigint {
    let raw = 0n;
    for (const ix of ixes) {
      raw |= AccountSignature.authIx(ix);
    }
    return raw;
  }

  static authVoteIxes(ixes: Iterable<number>): bigint {
    return AccountSignature.authIxes(ixes) |
      (1n << BigInt(AccountSignature.AUTH_VOTE_BIT));
  }

  static unsigned(authBit: bigint | number | string): AccountSignature {
    return new AccountSignature({ authBit });
  }

  authorizesIx(ix: number): boolean {
    return (this.authBit & AccountSignature.authIx(ix)) !== 0n;
  }

  authorizesPayer(): boolean {
    return (this.authBit & AccountSignature.authPayer()) !== 0n;
  }

  authorizesVote(): boolean {
    return (
      this.authBit & (1n << BigInt(AccountSignature.AUTH_VOTE_BIT))
    ) !== 0n;
  }

  constructor({ authBit = 0n, sigBit = 0n, signatures = [], publicKey = null }: AccountSignatureOptions = {}) {
    this.authBit = BigInt(authBit);
    this.sigBit = BigInt(sigBit);
    this.signatures = signatures.map(Signature.from);
    this.publicKey = publicKey ? PublicKey.from(publicKey) : null;
  }

  serialize(serializer: BcsSerializer): void {
    serializer.serializeU64(this.authBit);
    serializer.serializeU64(this.sigBit);
    serializer.serializeVector(this.signatures);
    serializer.serializeOption(this.publicKey);
  }

  static deserialize(deserializer: BcsDeserializer): AccountSignature {
    return new AccountSignature({
      authBit: deserializer.deserializeU64(),
      sigBit: deserializer.deserializeU64(),
      signatures: deserializer.deserializeVector(Signature),
      publicKey: deserializer.deserializeOption(PublicKey) ?? null
    });
  }

  toJSON(): { auth_bit: string; sig_bit: string; signatures: Signature[]; pubkey: PublicKey | null } {
    return {
      auth_bit: this.authBit.toString(),
      sig_bit: this.sigBit.toString(),
      signatures: this.signatures,
      pubkey: this.publicKey
    };
  }
}
