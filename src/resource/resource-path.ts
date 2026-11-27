import { assertBytes, type BytesLike } from "../crypto/index";
import { decodeJsonBody } from "../utils/index";

export interface ResourcePathEntry {
  hash: Uint8Array;
  path: string;
}

export type BatchResourcePathEntry =
  | { hash: Uint8Array; ok: true; path: string }
  | { hash: Uint8Array; ok: false; error: string };

export function decodeResourcePathList(body: BytesLike): ResourcePathEntry[] {
  const rows = decodeJsonBody<Array<[number[], string]>>(body);
  return rows.map(([hash, path]) => ({
    hash: assertBytes(Uint8Array.from(hash), 18, "resourceHash"),
    path,
  }));
}

export function decodeBatchResourcePathList(
  body: BytesLike,
): BatchResourcePathEntry[] {
  const rows = decodeJsonBody<
    Array<[number[], { Ok: string } | { Err: string }]>
  >(body);
  return rows.map(([rawHash, result], index) => {
    const hash = assertBytes(
      Uint8Array.from(rawHash),
      18,
      `batchResourcePath[${index}].hash`,
    );
    if ("Ok" in result && typeof result.Ok === "string") {
      return { hash, ok: true, path: result.Ok };
    }
    if ("Err" in result && typeof result.Err === "string") {
      return { hash, ok: false, error: result.Err };
    }
    throw new TypeError(`batchResourcePath[${index}] has an invalid result`);
  });
}
