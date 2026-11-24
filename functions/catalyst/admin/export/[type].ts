import type { Env, PagesFunction } from "../../_lib/env";
import { csvResponse } from "../../_lib/csv";

export const onRequestGet: PagesFunction<Env, "type"> = async ({ request, env, params }) => {
  const db = env.CATALYST_DB;
  const type = String(params.type);
  const verifiedOnly = new URL(request.url).searchParams.get("verified") === "1";

  if (type === "participants") {
    const { results } = await db
      .prepare(
        `SELECT p.reg_no, p.name, p.phone, p.school, p.class, t.name as team, p.solo_mode,
                (SELECT status FROM payments WHERE participant_id = p.id ORDER BY id DESC LIMIT 1) as payment_status
         FROM participants p LEFT JOIN teams t ON t.id = p.team_id
         WHERE p.removed_at IS NULL
           ${verifiedOnly ? "AND EXISTS (SELECT 1 FROM payments pay WHERE pay.participant_id = p.id AND pay.status = 'verified')" : ""}
         ORDER BY p.created_at`,
      )
      .all();
    return csvResponse(verifiedOnly ? "participants-verified.csv" : "participants.csv", results as Record<string, unknown>[]);
  }

  if (type === "teams") {
    const { results } = await db
      .prepare(
        `SELECT t.name, t.code,
                (SELECT COUNT(*) FROM participants WHERE team_id = t.id AND removed_at IS NULL) as members,
                (SELECT COUNT(DISTINCT p.id) FROM participants p JOIN payments pay ON pay.participant_id = p.id AND pay.status='verified' WHERE p.team_id = t.id) as verified
         FROM teams t ORDER BY t.name`,
      )
      .all();
    return csvResponse("teams.csv", results as Record<string, unknown>[]);
  }

  if (type === "payments") {
    const { results } = await db
      .prepare(
        `SELECT pay.id, p.reg_no, p.name, pay.method, pay.amount, pay.status, pay.transaction_id, pay.receipt_no, pay.created_at
         FROM payments pay JOIN participants p ON p.id = pay.participant_id ORDER BY pay.id`,
      )
      .all();
    return csvResponse("payments.csv", results as Record<string, unknown>[]);
  }

  if (type === "food") {
    const { results } = await db
      .prepare(
        `SELECT kind, COUNT(*) as headcount FROM scans WHERE kind LIKE 'food_%' GROUP BY kind ORDER BY kind`,
      )
      .all();
    return csvResponse("food-headcount.csv", results as Record<string, unknown>[]);
  }

  if (type === "donor") {
    const { results } = await db
      .prepare(
        `SELECT school, class, COUNT(*) as count
         FROM participants WHERE removed_at IS NULL
         GROUP BY school, class ORDER BY school, class`,
      )
      .all();
    return csvResponse("donor-summary.csv", results as Record<string, unknown>[]);
  }

  return new Response("Unknown export type", { status: 404 });
};
