import type { D1Database, Env } from "./env";
import { sendEmail } from "./email";
import { paymentVerifiedEmail } from "./email-templates";

/** Fire-and-forget: a misconfigured or failing email should never break an
 * admin action that already succeeded in the database. */
export async function notifyPaymentVerified(env: Env, db: D1Database, participantId: number, origin: string): Promise<void> {
  const participant = await db
    .prepare(
      `SELECT p.name, p.email, p.reg_no, t.name as team_name
       FROM participants p LEFT JOIN teams t ON t.id = p.team_id
       WHERE p.id = ?1`,
    )
    .bind(participantId)
    .first<{ name: string; email: string | null; reg_no: string; team_name: string | null }>();

  if (!participant?.email) return;

  const { html, text } = paymentVerifiedEmail({
    name: participant.name,
    regNo: participant.reg_no,
    teamName: participant.team_name,
    ticketUrl: `${origin}/catalyst/dashboard/ticket`,
  });

  try {
    await sendEmail(env, { to: participant.email, toName: participant.name, subject: "You're confirmed for CATALYST!", html, text });
  } catch {
    // Email is best-effort — the payment is already verified either way.
  }
}
