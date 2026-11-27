import { Endpoint, Network } from "../utils/network";
import { DEFAULT_IDLS } from "../idl/default-idls";
import { serializeInvokeRequest } from "./request";
import { deserializeBatchViewRpcBody, deserializeRpcBody, deserializeViewRpcBody } from "./response";
import { RpcMethodEnum } from "../utils/method";
import type { RpcError, RpcMethodResponse, RpcResponse } from "../idl/struct";
export interface Transport {
  request(method: string, params: unknown): Promise<unknown>;
}

export interface ClientHandlerParams {
  method: RpcMethodEnum;
  body: unknown;
  endpoint?: Endpoint;
  fetchImpl?: typeof fetch | undefined;
  requestId?: number;
  timeoutMs?: number;
}

/** @deprecated Import RpcResponse from idl/struct instead. */
export type ClientInvokeResponse = RpcResponse;
/** @deprecated Import RpcError from idl/struct instead. */
export type ClientRpcError = RpcError;

export interface ClientHandlerOptions {
  fetchImpl?: typeof fetch;
  requestId?: number;
  timeoutMs?: number;
}

export type ClientRequestParams = Omit<ClientHandlerParams, "endpoint"> & {
  endpoint?: Endpoint;
};

export const getEndPoint = (network: Network = Network.DEVNET) => {
  return Endpoint[network] || Endpoint.devnet;
};

async function executeRequest<M extends RpcMethodEnum>(
  params: ClientHandlerParams & { method: M },
): Promise<RpcMethodResponse<M>> {
  const {
    method,
    body,
    endpoint = getEndPoint(Network.DEVNET),
    fetchImpl = globalThis.fetch,
    requestId = 1,
    timeoutMs = 30_000,
  } = params;

  if (!fetchImpl) {
    throw new TypeError("fetch implementation is required");
  }
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new RangeError("timeoutMs must be a positive finite number");
  }

  const requestBytes = serializeInvokeRequest(method, requestId, body);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-milon+postcard",
        Accept: "application/x-milon+json",
      },
      body: requestBytes as BodyInit,
      signal: controller.signal,
    });
    const rawResponse = (await res.json()) as ClientInvokeResponse;

    const response = withIdlErrorName(rawResponse);
    if (response.status !== 0) {
      return response as unknown as RpcMethodResponse<M>;
    }
    const decodedBody = (
      method === RpcMethodEnum.view ? deserializeViewRpcBody(body, response.body)
        : method === RpcMethodEnum.batch_view ? deserializeBatchViewRpcBody(body, response.body)
        : deserializeRpcBody(method, response.body)
    ) as RpcMethodResponse<M>["body"];
    return {
      ...response,
      postcardData: response.body,
      body: decodedBody,
    };
  } catch (error) {
    if (controller.signal.aborted) {
      const timeoutError = new Error(
        `client request timed out after ${timeoutMs}ms`,
      ) as Error & { cause?: unknown };
      timeoutError.name = "TimeoutError";
      timeoutError.cause = error;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function withIdlErrorName(
  response: ClientInvokeResponse,
): ClientInvokeResponse {
  const error = response.error;
  if (!error || typeof error.code !== "number") return response;

  const idls = DEFAULT_IDLS as unknown as readonly {
    errors?: readonly { code: number; name: string }[];
  }[];
  for (const idl of idls) {
    const matched = idl.errors?.find(
      (candidate) => candidate.code === error.code,
    );
    if (!matched) continue;
    return {
      ...response,
      error: {
        ...error,
        name: matched.name,
      },
    };
  }
  return response;
}

/**
 * Reusable RPC client bound to one network.
 *
 * The network defaults to DEVNET and can still be overridden per request by
 * passing an explicit endpoint.
 */
export class ClientHandler {
  readonly network: Network;
  readonly endpoint: Endpoint;
  readonly fetchImpl: typeof fetch | undefined;
  readonly requestId: number;
  readonly timeoutMs: number;

  constructor(
    network: Network = Network.DEVNET,
    options: ClientHandlerOptions = {},
  ) {
    this.network = network;
    this.endpoint = getEndPoint(network);
    this.fetchImpl = options.fetchImpl ?? globalThis.fetch;
    this.requestId = options.requestId ?? 1;
    this.timeoutMs = options.timeoutMs ?? 30_000;
  }

  request<M extends RpcMethodEnum>(
    params: ClientRequestParams & { method: M },
  ): Promise<RpcMethodResponse<M>> {
    return executeRequest({
      ...params,
      endpoint: params.endpoint ?? this.endpoint,
      fetchImpl: params.fetchImpl ?? this.fetchImpl,
      requestId: params.requestId ?? this.requestId,
      timeoutMs: params.timeoutMs ?? this.timeoutMs,
    });
  }
}

/**
 * Backward-compatible one-off request helper.
 */
export const clientHandler = (
  params: ClientHandlerParams,
): Promise<RpcMethodResponse<typeof params.method>> => executeRequest(params);
