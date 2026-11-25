/**
 * Minimal ambient types for Cloudflare's raw TCP sockets API, used to speak
 * SMTP directly to Gmail (see _lib/email.ts). Hand-written for the same
 * reason as env.ts: avoiding @cloudflare/workers-types' peer-dependency
 * conflict with wrangler.
 */
declare module "cloudflare:sockets" {
  interface SocketOptions {
    secureTransport?: "off" | "on" | "starttls";
    allowHalfOpen?: boolean;
  }

  interface Socket {
    readable: ReadableStream<Uint8Array>;
    writable: WritableStream<Uint8Array>;
    close(): Promise<void>;
  }

  export function connect(address: { hostname: string; port: number }, options?: SocketOptions): Socket;
}
