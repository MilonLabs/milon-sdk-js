import { Address } from "../crypto/address";
import { assertBytes } from "../crypto/bytes";
import { PostcardSerializer } from "../postcard/index";
import { RpcMethodEnum } from "../utils/method";

export function serializeInvokeRequest(
  method: RpcMethodEnum,
  requestId: number,
  body: unknown,
): Uint8Array {
  const serializer = new PostcardSerializer();
  // Rust's Method enum is serialized as a repr(u16) Postcard value.
  serializer.serializeU16(method);
  serializer.serializeU64(BigInt(requestId));
  serializer.serializeBytes(serializeRpcBody(method, body));
  return serializer.toUint8Array();
}

function serializeRpcBody(method: RpcMethodEnum, body: unknown): Uint8Array {
  if (
    method === RpcMethodEnum.keyless_providers
    || method === RpcMethodEnum.keyless_params
    || method === RpcMethodEnum.node_capability
    || method === RpcMethodEnum.validator_locations
  ) {
    if (body === undefined || body === null) return new Uint8Array();
    return assertBytes(body as Uint8Array, 0, "KeylessIssuersBody");
  }
  if (
    method === RpcMethodEnum.keyless_sessions
    || method === RpcMethodEnum.keyless_binding
    || method === RpcMethodEnum.keyless_is_keyless
  ) {
    const address = body instanceof Address
      ? body
      : new Address(body as ConstructorParameters<typeof Address>[0]);
    return address.bytes.slice();
  }
  if (method === RpcMethodEnum.keyless_provider || method === RpcMethodEnum.keyless_provider_status) {
    return assertBytes(body as Uint8Array, 32, "KeylessProviderId");
  }
  if (method === RpcMethodEnum.keyless_audience) {
    const value = body as { providerId: Uint8Array; audience: string };
    const serializer = new PostcardSerializer();
    serializer.serializeFixedBytes(assertBytes(value.providerId, 32, "KeylessProviderId"));
    serializer.serializeStr(value.audience);
    return serializer.toUint8Array();
  }
  if (method === RpcMethodEnum.keyless_selected_jwk) {
    const value = body as { providerId: Uint8Array; issuer: string; kid: string; algorithm: string };
    const serializer = new PostcardSerializer();
    serializer.serializeFixedBytes(assertBytes(value.providerId, 32, "KeylessProviderId"));
    serializer.serializeStr(value.issuer);
    serializer.serializeStr(value.kid);
    serializer.serializeStr(value.algorithm);
    return serializer.toUint8Array();
  }
  if (method !== RpcMethodEnum.view && method !== RpcMethodEnum.batch_view) {
    return assertBytes(
      body as Parameters<typeof assertBytes>[0],
      undefined,
      "InvokeRequestBody",
    );
  }

  if (method === RpcMethodEnum.view) {
    const serializer = new PostcardSerializer();
    serializer.serializeBytes(assertBytes(body as Parameters<typeof assertBytes>[0], undefined, "ViewInstruction"));
    return serializer.toUint8Array();
  }
  const instructions = isInstructionList(body)
    ? body
    : (() => { throw new TypeError("BatchViewInstruction must be an array of Uint8Array"); })();
  const serializer = new PostcardSerializer();
  serializer.serializeU32(instructions.length);
  for (const instruction of instructions) {
    serializer.serializeBytes(instruction);
  }
  return serializer.toUint8Array();
}

function isInstructionList(body: unknown): body is Uint8Array[] {
  return Array.isArray(body)
    && body.every((item) => item instanceof Uint8Array);
}
