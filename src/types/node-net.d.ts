declare module "node:net" {
  export function createConnection(options: {
    host: string;
    port: number;
  }): {
    write(data: Uint8Array): void;
    destroy(): void;
    setTimeout(timeoutMs: number): void;
    once(event: "connect" | "timeout" | "end", listener: () => void): void;
    once(event: "error", listener: (error: Error) => void): void;
    on(event: "data", listener: (chunk: Uint8Array) => void): void;
  };

  export function createServer(
    listener?: (socket: {
      on(event: "data", listener: (chunk: Uint8Array) => void): void;
      write(data: Uint8Array): void;
      end(): void;
      destroy(): void;
    }) => void,
  ): {
    listen(port?: number, host?: string, listeningListener?: () => void): void;
    close(callback?: (error?: Error) => void): void;
    address(): { port: number } | null;
  };
}
