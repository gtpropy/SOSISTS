/**
 * Minimal hand-written ambient types for the Cloudflare bindings we use.
 * We deliberately don't depend on @cloudflare/workers-types here — wrangler's
 * own peer-dependency range for it conflicts with other deps in this repo,
 * and we only touch a handful of D1/R2 methods, so a small local interface
 * is simpler and avoids that whole fight.
 */

export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: { changes?: number; last_row_id?: number; duration?: number };
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
  first<T = unknown>(column?: string): Promise<T | null>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

export interface R2Object {
  key: string;
  size: number;
  httpMetadata?: { contentType?: string };
  body: ReadableStream;
}

export interface R2Bucket {
  put(
    key: string,
    value: ArrayBuffer | ArrayBufferView | ReadableStream | Blob,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>;
  get(key: string): Promise<R2Object | null>;
  delete(key: string): Promise<void>;
}

export interface Env {
  CATALYST_DB: D1Database;
  CATALYST_UPLOADS: R2Bucket;
  SESSION_SECRET: string;
  UPLOAD_SIGNING_SECRET: string;
}

export interface EventContext<E = Env, P extends string = string> {
  request: Request;
  env: E;
  params: Record<P, string | string[]>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Record<string, unknown>;
}

export type PagesFunction<E = Env, P extends string = string> = (
  context: EventContext<E, P>,
) => Response | Promise<Response>;
