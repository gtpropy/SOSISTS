import type { D1Database } from "./env";

export interface ParticipantRow {
  id: number;
  reg_no: string;
  name: string;
  phone: string;
  school: string;
  class: string;
  pin_hash: string;
  guardian_name: string | null;
  guardian_phone: string | null;
  diet: string | null;
  photo_consent: number;
  guardian_permission: number;
  rules_agreed_at: string | null;
  team_id: number | null;
  solo_mode: "own" | "match" | "none";
  failed_logins: number;
  first_failed_at: string | null;
  locked_until: string | null;
  pin_reset_requested: number;
  removed_at: string | null;
  created_at: string;
  why_join: string | null;
  cv_key: string | null;
  verify_code: string | null;
  email: string | null;
}

export interface TeamRow {
  id: number;
  name: string;
  code: string;
  invite_token: string;
  leader_id: number;
  locked: number;
  finalized_at: string | null;
  created_at: string;
}

export interface PaymentRow {
  id: number;
  participant_id: number;
  method: string;
  amount: number;
  transaction_id: string | null;
  payer_phone: string | null;
  screenshot_key: string | null;
  status: string;
  reject_reason: string | null;
  flag_note: string | null;
  paid_for_by_id: number | null;
  receipt_no: string | null;
  verified_by: number | null;
  verified_at: string | null;
  created_at: string;
}

export async function getParticipantById(db: D1Database, id: number): Promise<ParticipantRow | null> {
  return db.prepare("SELECT * FROM participants WHERE id = ?1 AND removed_at IS NULL").bind(id).first<ParticipantRow>();
}

export async function getParticipantByRegNo(db: D1Database, regNo: string): Promise<ParticipantRow | null> {
  return db
    .prepare("SELECT * FROM participants WHERE reg_no = ?1 AND removed_at IS NULL")
    .bind(regNo.trim().toUpperCase())
    .first<ParticipantRow>();
}

export async function getTeamById(db: D1Database, id: number): Promise<TeamRow | null> {
  return db.prepare("SELECT * FROM teams WHERE id = ?1").bind(id).first<TeamRow>();
}

export async function getTeamMembers(db: D1Database, teamId: number): Promise<ParticipantRow[]> {
  const { results } = await db
    .prepare("SELECT * FROM participants WHERE team_id = ?1 AND removed_at IS NULL ORDER BY id ASC")
    .bind(teamId)
    .all<ParticipantRow>();
  return results;
}

export async function getLatestPayment(db: D1Database, participantId: number): Promise<PaymentRow | null> {
  return db
    .prepare("SELECT * FROM payments WHERE participant_id = ?1 ORDER BY id DESC LIMIT 1")
    .bind(participantId)
    .first<PaymentRow>();
}

export type RegistrationStatus =
  | "incomplete"
  | "awaiting_payment"
  | "payment_under_review"
  | "confirmed"
  | "checked_in";

export function hasCompleteProfile(p: ParticipantRow): boolean {
  return Boolean(p.guardian_name && p.guardian_phone && p.guardian_permission && p.rules_agreed_at);
}

export function hasTeam(p: ParticipantRow): boolean {
  return Boolean(p.team_id) || p.solo_mode !== "none";
}

export function hasApplication(p: ParticipantRow): boolean {
  return Boolean(p.why_join);
}

export function isFullyRegistered(p: ParticipantRow): boolean {
  return hasCompleteProfile(p) && hasApplication(p);
}

/** Solo participants are always "ready"; team members need their leader to
 * have finalized the roster (everyone on it fully registered first). */
export async function isTeamReady(db: D1Database, p: ParticipantRow): Promise<boolean> {
  if (p.solo_mode !== "none") return true;
  if (!p.team_id) return false;
  const team = await getTeamById(db, p.team_id);
  return Boolean(team?.finalized_at);
}

export async function deriveStatus(
  db: D1Database,
  p: ParticipantRow,
): Promise<RegistrationStatus> {
  if (!hasCompleteProfile(p) || !(await isTeamReady(db, p))) return "incomplete";
  const payment = await getLatestPayment(db, p.id);
  if (!payment || payment.status === "unpaid") return "awaiting_payment";
  if (payment.status === "submitted" || payment.status === "cash_pending") return "payment_under_review";
  if (payment.status === "rejected") return "awaiting_payment";
  if (payment.status === "verified") {
    const scan = await db
      .prepare("SELECT 1 FROM scans WHERE participant_id = ?1 AND kind IN ('checkin_d1','checkin_d2') LIMIT 1")
      .bind(p.id)
      .first();
    return scan ? "checked_in" : "confirmed";
  }
  return "awaiting_payment";
}

export const STATUS_LABELS: Record<RegistrationStatus, string> = {
  incomplete: "Incomplete",
  awaiting_payment: "Awaiting payment",
  payment_under_review: "Payment under review",
  confirmed: "Confirmed",
  checked_in: "Checked in",
};
