import type { Env, PagesFunction } from "../_lib/env";
import { type AdminSession, isSameOrigin } from "../_lib/auth";
import { adminPage, banner, button, esc, htmlResponse } from "../_lib/html";
import { generateReceiptNo } from "../_lib/regno";
import { logAction } from "../_lib/audit";
import { notifyPaymentVerified } from "../_lib/notify";

interface QueueRow {
  id: number;
  participant_id: number;
  name: string;
  reg_no: string;
  team_name: string | null;
  method: string;
  amount: number;
  transaction_id: string | null;
  payer_phone: string | null;
  screenshot_key: string | null;
  status: string;
  flag_note: string | null;
  created_at: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, data }) => {
  const admin = data.admin as AdminSession;
  const url = new URL(request.url);
  const notice = url.searchParams.get("notice");

  const { results } = await env.CATALYST_DB
    .prepare(
      `SELECT pay.id, pay.participant_id, p.name, p.reg_no, t.name as team_name,
              pay.method, pay.amount, pay.transaction_id, pay.payer_phone,
              pay.screenshot_key, pay.status, pay.flag_note, pay.created_at
       FROM payments pay
       JOIN participants p ON p.id = pay.participant_id
       LEFT JOIN teams t ON t.id = p.team_id
       WHERE pay.status IN ('submitted', 'cash_pending')
       ORDER BY pay.created_at ASC`,
    )
    .all<QueueRow>();

  const body = `
    <h1>Payments queue</h1>
    ${banner(notice, "good")}
    <p class="cat-muted">${results.length} waiting for review, oldest first.</p>

    <form method="post" action="/catalyst/admin/payments">
      <input type="hidden" name="action" value="verify_bulk" />
      ${
        results.length === 0
          ? `<div class="card">Nothing to review right now. 🎉</div>`
          : results
              .map(
                (r) => `
        <div class="card">
          <div class="cat-row">
            <label class="cat-checkbox" style="margin:0"><input type="checkbox" name="ids" value="${r.id}" /> <strong>${esc(r.name)}</strong> (${esc(r.reg_no)})</label>
            <span class="cat-pill cat-pill-${r.status === "cash_pending" ? "warn" : "neutral"}">${esc(r.status.replace("_", " "))}</span>
          </div>
          <p class="cat-muted">${r.team_name ? `Team: ${esc(r.team_name)}` : "Solo"} &middot; ${esc(r.method)} &middot; NPR ${esc(r.amount)}</p>
          ${r.transaction_id ? `<p>Txn ID: <strong>${esc(r.transaction_id)}</strong> ${r.payer_phone ? `&middot; from ${esc(r.payer_phone)}` : ""}</p>` : ""}
          ${r.flag_note ? banner(r.flag_note, "warn") : ""}
          ${r.screenshot_key ? `<a href="/catalyst/admin/screenshot/${r.id}" target="_blank" rel="noopener"><img class="cat-screenshot" src="/catalyst/admin/screenshot/${r.id}" alt="Payment screenshot" loading="lazy" /></a>` : ""}

          <div class="cat-row" style="gap:8px;margin-top:10px">
            <form method="post" action="/catalyst/admin/payments" style="flex:1">
              <input type="hidden" name="action" value="verify_one" />
              <input type="hidden" name="id" value="${r.id}" />
              ${button(r.method === "cash" ? "Mark cash received" : "Verify", { type: "submit" })}
            </form>
            <form method="post" action="/catalyst/admin/payments" style="flex:1">
              <input type="hidden" name="action" value="reject" />
              <input type="hidden" name="id" value="${r.id}" />
              <input class="cat-input" style="margin-bottom:6px" name="reason" placeholder="Reason (required)" />
              ${button("Reject", { type: "submit", variant: "danger" })}
            </form>
          </div>
        </div>
      `,
              )
              .join("")
      }
      ${results.length > 0 ? button("Verify selected (bulk)", { type: "submit", variant: "ghost" }) : ""}
    </form>
  `;

  return htmlResponse(adminPage({ title: "Payments — CATALYST Admin", body, path: url.pathname, role: admin.role }));
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, data }) => {
  if (!isSameOrigin(request)) return new Response("Bad request", { status: 400 });
  const admin = data.admin as AdminSession;
  const db = env.CATALYST_DB;
  const form = await request.formData();
  const action = String(form.get("action") ?? "");

  const origin = new URL(request.url).origin;

  async function verify(paymentId: number): Promise<boolean> {
    const receiptNo = await generateReceiptNo(db);
    const result = await db
      .prepare(
        `UPDATE payments SET status = 'verified', receipt_no = ?1, verified_by = ?2, verified_at = ?3
         WHERE id = ?4 AND status IN ('submitted', 'cash_pending')`,
      )
      .bind(receiptNo, admin.adminId, new Date().toISOString(), paymentId)
      .run();
    const changed = (result.meta.changes ?? 0) > 0;
    if (changed) {
      await logAction(db, admin.adminId, "verify_payment", `payment:${paymentId}`, `receipt=${receiptNo}`);
      const payment = await db.prepare("SELECT participant_id FROM payments WHERE id = ?1").bind(paymentId).first<{ participant_id: number }>();
      if (payment) await notifyPaymentVerified(env, db, payment.participant_id, origin);
    }
    return changed;
  }

  if (action === "verify_one") {
    const id = Number(form.get("id"));
    const changed = await verify(id);
    const notice = changed ? "Verified." : "Already handled — nothing changed.";
    return Response.redirect(new URL(`/catalyst/admin/payments?notice=${encodeURIComponent(notice)}`, request.url).toString(), 303);
  }

  if (action === "verify_bulk") {
    const ids = form.getAll("ids").map((v) => Number(v)).filter(Number.isFinite);
    let count = 0;
    for (const id of ids) if (await verify(id)) count++;
    return Response.redirect(
      new URL(`/catalyst/admin/payments?notice=${encodeURIComponent(`${count} of ${ids.length} verified.`)}`, request.url).toString(),
      303,
    );
  }

  if (action === "reject") {
    const id = Number(form.get("id"));
    const reason = String(form.get("reason") ?? "").trim() || "Not specified";
    const result = await db
      .prepare("UPDATE payments SET status = 'rejected', reject_reason = ?1 WHERE id = ?2 AND status IN ('submitted', 'cash_pending')")
      .bind(reason, id)
      .run();
    const changed = (result.meta.changes ?? 0) > 0;
    if (changed) await logAction(db, admin.adminId, "reject_payment", `payment:${id}`, reason);
    const notice = changed ? "Rejected." : "Already handled — nothing changed.";
    return Response.redirect(new URL(`/catalyst/admin/payments?notice=${encodeURIComponent(notice)}`, request.url).toString(), 303);
  }

  return Response.redirect(new URL("/catalyst/admin/payments", request.url).toString(), 303);
};
