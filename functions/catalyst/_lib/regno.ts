import type { D1Database } from "./env";

// No 0/O, 1/I/L — avoids characters that are easy to misread on a phone
// screen or a printed badge.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function randomCode(length: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let out = "";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
}

export async function generateRegNo(db: D1Database): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = `CAT-${randomCode(4)}`;
    const existing = await db
      .prepare("SELECT id FROM participants WHERE reg_no = ?1")
      .bind(candidate)
      .first();
    if (!existing) return candidate;
  }
  throw new Error("Could not generate a unique Reg.No after 20 attempts");
}

export function randomToken(bytes = 24): string {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function generateTeamCode(db: D1Database): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = randomCode(6);
    const existing = await db.prepare("SELECT id FROM teams WHERE code = ?1").bind(candidate).first();
    if (!existing) return candidate;
  }
  throw new Error("Could not generate a unique team code after 20 attempts");
}

export async function generateReceiptNo(db: D1Database): Promise<string> {
  const row = await db
    .prepare("SELECT COUNT(*) as n FROM payments WHERE receipt_no IS NOT NULL")
    .first<{ n: number }>();
  const next = (row?.n ?? 0) + 1;
  return `RCPT-${String(next).padStart(4, "0")}`;
}
