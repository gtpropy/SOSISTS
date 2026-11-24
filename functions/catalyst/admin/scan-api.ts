import type { Env, PagesFunction } from "../_lib/env";
import { type AdminSession, isSameOrigin } from "../_lib/auth";
import { jsonResponse } from "../_lib/html";

const KINDS = new Set(["checkin_d1", "checkin_d2", "food_1", "food_2", "food_3"]);

export const onRequestPost: PagesFunction<Env> = async ({ request, env, data }) => {
  if (!isSameOrigin(request)) return jsonResponse({ ok: false, message: "Bad request" }, { status: 400 });
  const admin = data.admin as AdminSession;
  const db = env.CATALYST_DB;

  const body = (await request.json().catch(() => ({}))) as { reg_no?: string; kind?: string };
  const raw = (body.reg_no ?? "").trim().toUpperCase();
  const kind = body.kind ?? "";

  if (!KINDS.has(kind)) return jsonResponse({ ok: false, message: "Invalid scan mode." }, { status: 400 });
  if (!raw) return jsonResponse({ ok: false, message: "Enter or scan a Reg.No." }, { status: 400 });

  // A scanned QR encodes "REGNO:VERIFYCODE"; manual entry may be just the
  // Reg.No (a volunteer trusting the person in front of them) or the full
  // pair typed off a screenshot.
  const [regNo, verifyCode] = raw.includes(":") ? raw.split(":", 2) : [raw, null];

  const participant = await db
    .prepare("SELECT id, name, team_id, verify_code FROM participants WHERE reg_no = ?1 AND removed_at IS NULL")
    .bind(regNo)
    .first<{ id: number; name: string; team_id: number | null; verify_code: string | null }>();
  if (!participant) return jsonResponse({ ok: false, message: `No one found with Reg.No ${regNo}.` });

  if (verifyCode && participant.verify_code && verifyCode !== participant.verify_code) {
    return jsonResponse({ ok: false, message: `Verification code doesn't match ${participant.name}'s ticket.` });
  }

  const payment = await db
    .prepare("SELECT status FROM payments WHERE participant_id = ?1 ORDER BY id DESC LIMIT 1")
    .bind(participant.id)
    .first<{ status: string }>();
  if (payment?.status !== "verified") {
    return jsonResponse({ ok: false, message: `${participant.name} isn't confirmed yet (payment not verified).` });
  }

  const team = participant.team_id
    ? await db.prepare("SELECT name FROM teams WHERE id = ?1").bind(participant.team_id).first<{ name: string }>()
    : null;

  const insert = await db
    .prepare("INSERT INTO scans (participant_id, kind, scanned_by) VALUES (?1, ?2, ?3)")
    .bind(participant.id, kind, admin.adminId)
    .run()
    .catch(() => null);

  if (!insert || !insert.success) {
    return jsonResponse({
      ok: false,
      message: `${participant.name} already ${kind.startsWith("food") ? "took food in this round" : "checked in"}.`,
      name: participant.name,
      team: team?.name ?? null,
    });
  }

  const counts = await db
    .prepare("SELECT COUNT(*) as n FROM scans WHERE kind = ?1")
    .bind(kind)
    .first<{ n: number }>();

  return jsonResponse({
    ok: true,
    message: "Confirmed",
    name: participant.name,
    team: team?.name ?? null,
    count: counts?.n ?? 0,
  });
};
