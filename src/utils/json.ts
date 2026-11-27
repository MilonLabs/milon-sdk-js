import { type BytesLike, toBytes } from "../crypto/index";

const textDecoder = new TextDecoder();

export function decodeJsonBody<T>(body: BytesLike): T {
  return JSON.parse(textDecoder.decode(toBytes(body))) as T;
}
