import type { D1Database } from "./env";

export interface CatalystConfig {
  event_name: string;
  event_tagline: string;
  day1_date: string;
  day1_label: string;
  day1_start: string;
  day2_date: string;
  day2_label: string;
  build_end_time: string;
  registration_deadline: string;
  team_lock_date: string;
  participant_cap: number;
  fee_amount: number;
  fee_currency: string;
  payment_esewa_id: string;
  payment_khalti_id: string;
  payment_bank_name: string;
  payment_bank_account_name: string;
  payment_bank_account_number: string;
  refund_policy_text: string;
}

const NUMERIC_KEYS = new Set(["participant_cap", "fee_amount"]);

export async function getConfig(db: D1Database): Promise<CatalystConfig> {
  const { results } = await db.prepare("SELECT key, value FROM config").all<{
    key: string;
    value: string;
  }>();
  const raw: Record<string, string> = {};
  for (const row of results) raw[row.key] = row.value;

  const out: Record<string, unknown> = { ...raw };
  for (const k of NUMERIC_KEYS) out[k] = Number(raw[k] ?? 0);
  return out as unknown as CatalystConfig;
}

export async function setConfigValue(db: D1Database, key: string, value: string): Promise<void> {
  await db
    .prepare("INSERT INTO config (key, value) VALUES (?1, ?2) ON CONFLICT(key) DO UPDATE SET value = ?2")
    .bind(key, value)
    .run();
}

export function isRegistrationOpen(cfg: CatalystConfig, now = new Date()): boolean {
  return now.getTime() <= new Date(cfg.registration_deadline).getTime();
}

export function isTeamLocked(cfg: CatalystConfig, now = new Date()): boolean {
  return now.getTime() > new Date(cfg.team_lock_date).getTime();
}
