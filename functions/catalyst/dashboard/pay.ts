import type { Env, PagesFunction } from "../_lib/env";
import { isSameOrigin } from "../_lib/auth";
import { banner, button, esc, field, htmlResponse, page, redirect, statusPill } from "../_lib/html";
import {
  getLatestPayment,
  getTeamMembers,
  hasCompleteProfile,
  type ParticipantRow,
} from "../_lib/db";
import { getConfig } from "../_lib/config";

const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png"]);

function statusView(status: string, reason: string | null) {
  if (status === "submitted" || status === "cash_pending") {
    return `${banner("We got your payment details. An organizer is checking them, usually within 24 hours.", "warn")}`;
  }
  if (status === "verified") {
    return `${banner("Payment confirmed! Your ticket is ready.", "good")}<a class="cat-btn cat-btn-primary cat-btn-block" href="/catalyst/dashboard/ticket">View ticket</a>`;
  }
  if (status === "rejected") {
    return `${banner(reason ? `Your payment was rejected: ${esc(reason)}` : "Your payment was rejected.", "bad")}`;
  }
  return "";
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, data }) => {
  const participant = data.participant as ParticipantRow;
  const cfg = await getConfig(env.CATALYST_DB);
  const error = new URL(request.url).searchParams.get("error");

  if (!hasCompleteProfile(participant)) {
    return redirect("/catalyst/dashboard/profile");
  }

  const payment = await getLatestPayment(env.CATALYST_DB, participant.id);

  const teammates = participant.team_id
    ? (await getTeamMembers(env.CATALYST_DB, participant.team_id)).filter((m) => m.id !== participant.id)
    : [];

  const canSubmit = !payment || payment.status === "unpaid" || payment.status === "rejected";

  const body = `
    <div class="cat-row"><h1 style="margin:0">Payment</h1>${payment ? statusPill(payment.status.replace("_", " "), payment.status === "verified" ? "good" : payment.status === "rejected" ? "bad" : "warn") : ""}</div>
    ${banner(error)}
    ${payment ? statusView(payment.status, payment.reject_reason) : ""}

    ${
      canSubmit
        ? `
    <div class="card">
      <p>NPR <strong>${cfg.fee_amount}</strong> per person &middot; covers food on both event days.</p>
      ${cfg.payment_esewa_id || cfg.payment_khalti_id || cfg.payment_bank_account_number ? "" : banner("Payment instructions aren't set up yet — ask an organizer before paying.", "warn")}
      ${cfg.payment_esewa_id ? `<p class="cat-chip">eSewa ID: <strong>${esc(cfg.payment_esewa_id)}</strong></p>` : ""}
      ${cfg.payment_khalti_id ? `<p class="cat-chip">Khalti ID: <strong>${esc(cfg.payment_khalti_id)}</strong></p>` : ""}
      ${cfg.payment_bank_account_number ? `<p class="cat-chip">${esc(cfg.payment_bank_name)}: <strong>${esc(cfg.payment_bank_account_name)} &middot; ${esc(cfg.payment_bank_account_number)}</strong></p>` : ""}
    </div>

    <div class="card">
      <h3>Pay online (eSewa / Khalti / bank)</h3>
      <form method="post" action="/catalyst/dashboard/pay" enctype="multipart/form-data" data-upload-form>
        <input type="hidden" name="action" value="online" />
        ${field({
          label: "Method",
          name: "method",
          required: true,
          options: [
            { value: "esewa", label: "eSewa" },
            { value: "khalti", label: "Khalti" },
            { value: "bank", label: "Bank transfer" },
          ],
        })}
        ${
          teammates.length > 0
            ? `<p class="cat-field-label">Paying for teammates too? (NPR ${cfg.fee_amount} each, added to your total)</p>
               ${teammates
                 .map(
                   (m) =>
                     `<label class="cat-checkbox"><input type="checkbox" name="pay_for" value="${m.id}" /><span>${esc(m.name)}</span></label>`,
                 )
                 .join("")}`
            : ""
        }
        ${field({ label: "Transaction ID", name: "transaction_id", required: true })}
        ${field({ label: "Phone number you paid from", name: "payer_phone", type: "tel", required: true })}
        <label class="cat-field">
          <span class="cat-field-label">Payment screenshot (JPG/PNG, up to 5MB) *</span>
          <input type="file" name="screenshot" id="screenshot" accept="image/jpeg,image/png" data-compress required class="cat-input" />
          <span class="cat-field-help" id="screenshot_status"></span>
        </label>
        ${button("Submit payment", { type: "submit" })}
      </form>
    </div>

    <div class="card">
      <h3>Pay cash at school</h3>
      <p class="cat-muted">A volunteer or admin will mark it paid when you hand over the cash.</p>
      <form method="post" action="/catalyst/dashboard/pay">
        <input type="hidden" name="action" value="cash" />
        ${
          teammates.length > 0
            ? teammates
                .map(
                  (m) =>
                    `<label class="cat-checkbox"><input type="checkbox" name="pay_for" value="${m.id}" /><span>Also paying cash for ${esc(m.name)}</span></label>`,
                )
                .join("")
            : ""
        }
        ${button("I'll pay cash at school", { type: "submit", variant: "ghost" })}
      </form>
    </div>
    `
        : ""
    }
    <p style="text-align:center"><a href="/catalyst/dashboard">&larr; Back to dashboard</a></p>
  `;

  return htmlResponse(page({ title: "Pay — CATALYST", body }));
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, data }) => {
  if (!isSameOrigin(request)) return new Response("Bad request", { status: 400 });
  const participant = data.participant as ParticipantRow;
  const db = env.CATALYST_DB;
  const cfg = await getConfig(db);

  if (!hasCompleteProfile(participant)) return redirect("/catalyst/dashboard/profile");

  const form = await request.formData();
  const action = String(form.get("action") ?? "");
  const payForIds = form.getAll("pay_for").map((v) => Number(v)).filter((n) => Number.isFinite(n));

  // Only allow paying for real, current teammates — never an arbitrary ID.
  const teammates = participant.team_id ? await getTeamMembers(db, participant.team_id) : [];
  const validPayFor = teammates.filter((m) => m.id !== participant.id && payForIds.includes(m.id));
  const payees = [participant, ...validPayFor];

  if (action === "cash") {
    for (const payee of payees) {
      await db
        .prepare(
          `INSERT INTO payments (participant_id, method, amount, status, paid_for_by_id)
           VALUES (?1, 'cash', ?2, 'cash_pending', ?3)`,
        )
        .bind(payee.id, cfg.fee_amount, payee.id === participant.id ? null : participant.id)
        .run();
    }
    return redirect("/catalyst/dashboard/pay");
  }

  if (action === "online") {
    const method = String(form.get("method") ?? "");
    const transactionId = String(form.get("transaction_id") ?? "").trim();
    const payerPhone = String(form.get("payer_phone") ?? "").trim();
    const file = form.get("screenshot");

    if (!["esewa", "khalti", "bank"].includes(method)) {
      return redirect("/catalyst/dashboard/pay?error=" + encodeURIComponent("Choose a payment method."));
    }
    if (!transactionId || !payerPhone) {
      return redirect(
        "/catalyst/dashboard/pay?error=" + encodeURIComponent("Transaction ID and payer phone are required."),
      );
    }
    if (!(file instanceof File) || file.size === 0) {
      return redirect("/catalyst/dashboard/pay?error=" + encodeURIComponent("Upload a payment screenshot."));
    }
    if (file.size > MAX_SCREENSHOT_BYTES) {
      return redirect("/catalyst/dashboard/pay?error=" + encodeURIComponent("Screenshot is too large (max 5MB)."));
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return redirect("/catalyst/dashboard/pay?error=" + encodeURIComponent("Screenshot must be a JPG or PNG."));
    }

    // Soft-flag (never hard-reject) a transaction ID already used by a
    // different payer group — an admin reviews it, per the spec.
    const existing = await db
      .prepare("SELECT participant_id FROM payments WHERE transaction_id = ?1 LIMIT 1")
      .bind(transactionId)
      .first<{ participant_id: number }>();
    const flagNote =
      existing && !payees.some((p) => p.id === existing.participant_id)
        ? "Transaction ID also used on another payment — check for duplicates."
        : null;

    const bytes = await file.arrayBuffer();
    const ext = file.type === "image/png" ? "png" : "jpg";

    for (const payee of payees) {
      const key = `payments/${payee.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      await env.CATALYST_UPLOADS.put(key, bytes, { httpMetadata: { contentType: file.type } });
      await db
        .prepare(
          `INSERT INTO payments
             (participant_id, method, amount, transaction_id, payer_phone, screenshot_key, status, flag_note, paid_for_by_id)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'submitted', ?7, ?8)`,
        )
        .bind(
          payee.id,
          method,
          cfg.fee_amount,
          transactionId,
          payerPhone,
          key,
          flagNote,
          payee.id === participant.id ? null : participant.id,
        )
        .run();
    }

    return redirect("/catalyst/dashboard/pay");
  }

  return redirect("/catalyst/dashboard/pay");
};
