import bcrypt from "bcryptjs";
import type { D1Database } from "./env";

const SESSION_COOKIE = "catalyst_session";
const ADMIN_COOKIE = "catalyst_admin_session";
const SESSION_MAX_AGE_S = 7 * 24 * 60 * 60; // 7 days

export interface ParticipantSession {
  kind: "participant";
  participantId: number;
  exp: number;
}

export interface AdminSession {
  kind: "admin";
  adminId: number;
  role: "admin" | "volunteer";
  exp: number;
}

// --- PIN / password hashing (bcryptjs is pure JS, works fine on Workers) ---

export async function hashSecret(secret: string): Promise<string> {
  return bcrypt.hash(secret, 10);
}

export async function verifySecret(secret: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(secret, hash);
  } catch {
    return false;
  }
}

// --- Signed, HTTP-only session cookies (HMAC-SHA256 via Web Crypto) ---

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (const b of arr) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(s.length + ((4 - (s.length % 4)) % 4), "=");
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function signSession(payload: ParticipantSession | AdminSession, secret: string): Promise<string> {
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return `${body}.${toBase64Url(sig)}`;
}

async function verifySession<T extends ParticipantSession | AdminSession>(
  token: string,
  secret: string,
): Promise<T | null> {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const key = await hmacKey(secret);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    fromBase64Url(sig) as BufferSource,
    new TextEncoder().encode(body),
  );
  if (!valid) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as T;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function parseCookies(request: Request): Record<string, string> {
  const header = request.headers.get("Cookie") ?? "";
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i === -1) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function cookieHeader(name: string, value: string, maxAgeS: number): string {
  const attrs = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/catalyst",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${maxAgeS}`,
  ];
  return attrs.join("; ");
}

export async function createParticipantSession(
  participantId: number,
  secret: string,
): Promise<string> {
  const exp = Date.now() + SESSION_MAX_AGE_S * 1000;
  const token = await signSession({ kind: "participant", participantId, exp }, secret);
  return cookieHeader(SESSION_COOKIE, token, SESSION_MAX_AGE_S);
}

export async function createAdminSession(
  adminId: number,
  role: "admin" | "volunteer",
  secret: string,
): Promise<string> {
  const exp = Date.now() + SESSION_MAX_AGE_S * 1000;
  const token = await signSession({ kind: "admin", adminId, role, exp }, secret);
  return cookieHeader(ADMIN_COOKIE, token, SESSION_MAX_AGE_S);
}

export function clearSessionCookie(name: "participant" | "admin"): string {
  const cookieName = name === "participant" ? SESSION_COOKIE : ADMIN_COOKIE;
  return `${cookieName}=; Path=/catalyst; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function getParticipantSession(
  request: Request,
  secret: string,
): Promise<ParticipantSession | null> {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) return null;
  return verifySession<ParticipantSession>(token, secret);
}

export async function getAdminSession(request: Request, secret: string): Promise<AdminSession | null> {
  const token = parseCookies(request)[ADMIN_COOKIE];
  if (!token) return null;
  return verifySession<AdminSession>(token, secret);
}

// --- CSRF: same-origin check for every mutating request ---

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("Origin");
  if (!origin) {
    // Some older mobile browsers omit Origin on same-site form posts; fall
    // back to comparing Referer's origin instead of failing outright.
    const referer = request.headers.get("Referer");
    if (!referer) return false;
    try {
      return new URL(referer).origin === new URL(request.url).origin;
    } catch {
      return false;
    }
  }
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

// --- Rate limiting ---
// Participant login attempts live on participants.failed_logins /
// locked_until (naturally per-account). This generic limiter is for
// actions not tied to one participant row yet (PIN reset requests,
// invite-link join attempts) — scoped by caller-supplied key (e.g. IP).

export async function checkRateLimit(
  db: D1Database,
  scope: string,
  key: string,
  opts: { maxAttempts: number; windowMs: number; lockMs: number },
): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  const now = Date.now();
  const row = await db
    .prepare("SELECT count, window_start, locked_until FROM rate_limits WHERE scope = ?1 AND key = ?2")
    .bind(scope, key)
    .first<{ count: number; window_start: string; locked_until: string | null }>();

  if (row?.locked_until && new Date(row.locked_until).getTime() > now) {
    return { allowed: false, retryAfterMs: new Date(row.locked_until).getTime() - now };
  }

  const windowStart = row ? new Date(row.window_start).getTime() : now;
  const withinWindow = now - windowStart < opts.windowMs;
  const count = withinWindow ? (row?.count ?? 0) + 1 : 1;
  const newWindowStart = withinWindow ? row!.window_start : new Date(now).toISOString();

  const lockedUntil =
    count > opts.maxAttempts ? new Date(now + opts.lockMs).toISOString() : null;

  await db
    .prepare(
      `INSERT INTO rate_limits (scope, key, count, window_start, locked_until)
       VALUES (?1, ?2, ?3, ?4, ?5)
       ON CONFLICT(scope, key) DO UPDATE SET count = ?3, window_start = ?4, locked_until = ?5`,
    )
    .bind(scope, key, count, newWindowStart, lockedUntil)
    .run();

  if (lockedUntil) return { allowed: false, retryAfterMs: opts.lockMs };
  return { allowed: true };
}

export function clientKey(request: Request): string {
  return request.headers.get("CF-Connecting-IP") ?? request.headers.get("X-Forwarded-For") ?? "unknown";
}
