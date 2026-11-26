import type { Env, PagesFunction } from "../_lib/env";
import { type AdminSession, hashSecret, isSameOrigin } from "../_lib/auth";
import { adminPage, banner, button, esc, htmlResponse } from "../_lib/html";
import { logAction } from "../_lib/audit";
import { generateReceiptNo } from "../_lib/regno";
import { getConfig } from "../_lib/config";
import { notifyPaymentVerified } from "../_lib/notify";

interface Row {
  id: number;
  reg_no: string;
  name: string;
  phone: string;
  school: string;
  class: string;
  team_name: string | null;
  solo_mode: string;
  payment_status: string | null;
  pin_reset_requested: number;
}

function randomPin(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 10000;
  return String(n).padStart(4, "0");
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, data }) => {
  const admin = data.admin as AdminSession;
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const notice = url.searchParams.get("notice");

  const { results } = await env.CATALYST_DB
    .prepare(
      `SELECT p.id, p.reg_no, p.name, p.phone, p.school, p.class, t.name as team_name, p.solo_mode, p.pin_reset_requested,
              (SELECT status FROM payments WHERE participant_id = p.id ORDER BY id DESC LIMIT 1) as payment_status
       FROM participants p
       LEFT JOIN teams t ON t.id = p.team_id
       WHERE p.removed_at IS NULL
         AND (?1 = '' OR p.name LIKE '%' || ?1 || '%' OR p.reg_no LIKE '%' || ?1 || '%' OR p.school LIKE '%' || ?1 || '%' OR p.phone LIKE '%' || ?1 || '%')
       ORDER BY p.pin_reset_requested DESC, p.created_at DESC
       LIMIT 300`,
    )
    .bind(q)
    .all<Row>();

  const body = `
    <h1>Participants</h1>
    ${banner(notice, "good")}
    <form method="get" action="/catalyst/admin/participants" class="cat-row" style="margin-bottom:14px">
      <input class="cat-input" name="q" value="${esc(q)}" placeholder="Search name, Reg.No, school, phone" style="flex:1" />
      ${button("Search", { type: "submit", variant: "ghost" })}
    </form>
    <p class="cat-muted">${results.length} shown${results.length === 300 ? " (first 300)" : ""}.</p>
    <div class="cat-table-wrap">
      <table class="cat-table">
        <tr><th>Reg.No</th><th>Name</th><th>School</th><th>Class</th><th>Team</th><th>Payment</th><th></th></tr>
        ${results
          .map(
            (r) => `
          <tr>
            <td>${esc(r.reg_no)} ${r.pin_reset_requested ? '<span class="cat-pill cat-pill-warn">PIN reset?</span>' : ""}</td>
            <td>${esc(r.name)}</td>
            <td>${esc(r.school)}</td>
            <td>${esc(r.class)}</td>
            <td>${r.team_name ? esc(r.team_name) : r.solo_mode !== "none" ? `Solo (${esc(r.solo_mode)})` : "—"}</td>
            <td>${esc(r.payment_status ?? "unpaid")}</td>
            <td style="white-space:nowrap">
              ${
                r.payment_status === "verified"
                  ? `<form method="post" action="/catalyst/admin/participants" style="display:inline" data-confirm="Mark ${esc(r.name)} as unverified?">
                       <input type="hidden" name="action" value="mark_unverified" /><input type="hidden" name="id" value="${r.id}" />
                       <button type="submit" class="cat-btn cat-btn-ghost" style="min-height:0;padding:4px 10px;font-size:0.8rem">Mark unverified</button>
                     </form>`
                  : `<form method="post" action="/catalyst/admin/participants" style="display:inline" data-confirm="Mark ${esc(r.name)} as payment verified?">
                       <input type="hidden" name="action" value="mark_verified" /><input type="hidden" name="id" value="${r.id}" />
                       <button type="submit" class="cat-btn cat-btn-ghost" style="min-height:0;padding:4px 10px;font-size:0.8rem">Mark verified</button>
                     </form>`
              }
              <form method="post" action="/catalyst/admin/participants" style="display:inline" data-confirm="Reset ${esc(r.name)}'s PIN?">
                <input type="hidden" name="action" value="reset_pin" /><input type="hidden" name="id" value="${r.id}" />
                <button type="submit" class="cat-btn cat-btn-ghost" style="min-height:0;padding:4px 10px;font-size:0.8rem">Reset PIN</button>
              </form>
              <form method="post" action="/catalyst/admin/participants" style="display:inline" data-confirm="Remove ${esc(r.name)}? This can't be undone from here.">
                <input type="hidden" name="action" value="remove" /><input type="hidden" name="id" value="${r.id}" />
                <button type="submit" class="cat-btn cat-btn-danger" style="min-height:0;padding:4px 10px;font-size:0.8rem">Remove</button>
              </form>
            </td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>
  `;

  return htmlResponse(adminPage({ title: "Participants — CATALYST Admin", body, path: url.pathname, role: admin.role }));
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, data }) => {
  if (!isSameOrigin(request)) return new Response("Bad request", { status: 400 });
  const admin = data.admin as AdminSession;
  const form = await request.formData();
  const action = String(form.get("action") ?? "");
  const id = Number(form.get("id"));

  if (action === "reset_pin") {
    const pin = randomPin();
    const hash = await hashSecret(pin);
    await env.CATALYST_DB
      .prepare("UPDATE participants SET pin_hash = ?1, pin_reset_requested = 0, failed_logins = 0, locked_until = NULL WHERE id = ?2")
      .bind(hash, id)
      .run();
    await logAction(env.CATALYST_DB, admin.adminId, "reset_pin", `participant:${id}`);
    return Response.redirect(
      new URL(`/catalyst/admin/participants?notice=${encodeURIComponent(`New PIN: ${pin} — tell them in person, it won't be shown again.`)}`, request.url).toString(),
      303,
    );
  }

  if (action === "mark_verified") {
    const latest = await env.CATALYST_DB
      .prepare("SELECT id, status FROM payments WHERE participant_id = ?1 ORDER BY id DESC LIMIT 1")
      .bind(id)
      .first<{ id: number; status: string }>();
    const receiptNo = await generateReceiptNo(env.CATALYST_DB);

    if (latest) {
      await env.CATALYST_DB
        .prepare("UPDATE payments SET status = 'verified', receipt_no = COALESCE(receipt_no, ?1), verified_by = ?2, verified_at = ?3 WHERE id = ?4")
        .bind(receiptNo, admin.adminId, new Date().toISOString(), latest.id)
        .run();
    } else {
      const cfg = await getConfig(env.CATALYST_DB);
      await env.CATALYST_DB
        .prepare(
          `INSERT INTO payments (participant_id, method, amount, status, receipt_no, verified_by, verified_at)
           VALUES (?1, 'cash', ?2, 'verified', ?3, ?4, ?5)`,
        )
        .bind(id, cfg.fee_amount, receiptNo, admin.adminId, new Date().toISOString())
        .run();
    }
    await logAction(env.CATALYST_DB, admin.adminId, "mark_verified", `participant:${id}`);
    await notifyPaymentVerified(env, env.CATALYST_DB, id, new URL(request.url).origin);
    return Response.redirect(new URL("/catalyst/admin/participants?notice=Marked verified.", request.url).toString(), 303);
  }

  if (action === "mark_unverified") {
    await env.CATALYST_DB
      .prepare(
        `UPDATE payments SET status = 'rejected', reject_reason = 'Marked unverified by admin'
         WHERE id = (SELECT id FROM payments WHERE participant_id = ?1 ORDER BY id DESC LIMIT 1) AND status = 'verified'`,
      )
      .bind(id)
      .run();
    await logAction(env.CATALYST_DB, admin.adminId, "mark_unverified", `participant:${id}`);
    return Response.redirect(new URL("/catalyst/admin/participants?notice=Marked unverified.", request.url).toString(), 303);
  }

  if (action === "remove") {
    await env.CATALYST_DB
      .prepare("UPDATE participants SET removed_at = ?1, team_id = NULL WHERE id = ?2")
      .bind(new Date().toISOString(), id)
      .run();
    await logAction(env.CATALYST_DB, admin.adminId, "remove_participant", `participant:${id}`);
    return Response.redirect(
      new URL("/catalyst/admin/participants?notice=Removed.", request.url).toString(),
      303,
    );
  }

  return Response.redirect(new URL("/catalyst/admin/participants", request.url).toString(), 303);
};
