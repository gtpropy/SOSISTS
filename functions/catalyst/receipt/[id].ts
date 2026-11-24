import type { Env, PagesFunction } from "../_lib/env";
import { getParticipantSession } from "../_lib/auth";
import { esc, htmlResponse, page, redirect } from "../_lib/html";
import { getConfig } from "../_lib/config";
import type { PaymentRow } from "../_lib/db";

export const onRequestGet: PagesFunction<Env, "id"> = async ({ request, env, params }) => {
  const session = await getParticipantSession(request, env.SESSION_SECRET);
  if (!session) return redirect("/catalyst/login");

  const receiptNo = String(params.id);
  const payment = await env.CATALYST_DB
    .prepare("SELECT * FROM payments WHERE receipt_no = ?1")
    .bind(receiptNo)
    .first<PaymentRow>();

  // Only the participant it belongs to (never anyone else, just because
  // they can guess/enumerate receipt numbers) can view a receipt.
  if (!payment || payment.participant_id !== session.participantId) {
    return htmlResponse(
      page({ title: "Receipt — CATALYST", body: `<div class="card">Receipt not found.</div>` }),
      { status: 404 },
    );
  }

  const participant = await env.CATALYST_DB
    .prepare("SELECT name, reg_no FROM participants WHERE id = ?1")
    .bind(payment.participant_id)
    .first<{ name: string; reg_no: string }>();

  const cfg = await getConfig(env.CATALYST_DB);

  const body = `
    <div class="card" id="receipt">
      <h1 class="doodle-underline">Receipt</h1>
      <p class="cat-muted">${esc(receiptNo)}</p>
      <table class="cat-table" style="margin-top:14px">
        <tr><td>Name</td><td><strong>${esc(participant?.name ?? "")}</strong></td></tr>
        <tr><td>Reg.No</td><td>${esc(participant?.reg_no ?? "")}</td></tr>
        <tr><td>Amount</td><td>${esc(cfg.fee_currency)} ${esc(payment.amount)}</td></tr>
        <tr><td>Method</td><td>${esc(payment.method)}</td></tr>
        <tr><td>Date</td><td>${esc(new Date(payment.verified_at ?? payment.created_at).toLocaleString())}</td></tr>
        <tr><td>Paid to</td><td><strong>ISTSOS</strong></td></tr>
      </table>
    </div>
    <button class="cat-btn cat-btn-ghost cat-btn-block no-print" onclick="window.print()">Print / save as PDF</button>
    <p style="text-align:center" class="no-print"><a href="/catalyst/dashboard">&larr; Back to dashboard</a></p>
  `;

  return htmlResponse(page({ title: `Receipt ${receiptNo} — CATALYST`, body }));
};
