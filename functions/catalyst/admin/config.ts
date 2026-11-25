import type { Env, PagesFunction } from "../_lib/env";
import { type AdminSession, hashSecret, isSameOrigin } from "../_lib/auth";
import { adminPage, banner, button, esc, field, htmlResponse } from "../_lib/html";
import { getConfig, setConfigValue } from "../_lib/config";
import { logAction } from "../_lib/audit";

interface StaffRow {
  id: number;
  username: string;
  role: "admin" | "volunteer";
  created_at: string;
}

const EDITABLE_KEYS = [
  "event_name",
  "event_tagline",
  "day1_label",
  "day1_start",
  "day2_label",
  "build_end_time",
  "registration_deadline",
  "team_lock_date",
  "participant_cap",
  "fee_amount",
  "payment_esewa_id",
  "payment_khalti_id",
  "payment_bank_name",
  "payment_bank_account_name",
  "payment_bank_account_number",
  "refund_policy_text",
] as const;

export const onRequestGet: PagesFunction<Env> = async ({ request, env, data }) => {
  const cfg = await getConfig(env.CATALYST_DB);
  const notice = new URL(request.url).searchParams.get("notice");
  const self = data.admin as AdminSession;

  const { results: staff } = await env.CATALYST_DB
    .prepare("SELECT id, username, role, created_at FROM admins ORDER BY created_at ASC")
    .all<StaffRow>();

  const body = `
    <h1>Config</h1>
    ${banner(notice, "good")}
    <div class="card">
      <h3>Staff accounts</h3>
      <p class="cat-muted">Create a login for a volunteer (scanner + badges only) or another organizer (full admin). They can log in at <code>/catalyst/admin/login</code>.</p>
      <table class="cat-table">
        <tr><th>Username</th><th>Role</th><th></th></tr>
        ${staff
          .map(
            (s) => `
          <tr>
            <td>${esc(s.username)}${s.id === self.adminId ? " (you)" : ""}</td>
            <td>${esc(s.role)}</td>
            <td>
              ${
                s.id === self.adminId
                  ? ""
                  : `<form method="post" action="/catalyst/admin/config" style="display:inline" data-confirm="Remove staff account ${esc(s.username)}?">
                       <input type="hidden" name="action" value="remove_staff" /><input type="hidden" name="staff_id" value="${s.id}" />
                       <button type="submit" class="cat-btn cat-btn-danger" style="min-height:0;padding:4px 10px;font-size:0.8rem">Remove</button>
                     </form>`
              }
            </td>
          </tr>`,
          )
          .join("")}
      </table>
      <form method="post" action="/catalyst/admin/config" class="cat-row" style="margin-top:12px;align-items:flex-end">
        <input type="hidden" name="action" value="create_staff" />
        ${field({ label: "Username", name: "staff_username", required: true })}
        ${field({ label: "Password", name: "staff_password", type: "password", required: true })}
        ${field({
          label: "Role",
          name: "staff_role",
          required: true,
          value: "volunteer",
          options: [
            { value: "volunteer", label: "Volunteer (scanner only)" },
            { value: "admin", label: "Admin (full access)" },
          ],
        })}
        ${button("Add staff account", { type: "submit", variant: "ghost" })}
      </form>
    </div>
    <form method="post" action="/catalyst/admin/config">
      <input type="hidden" name="action" value="save_config" />
      <div class="card">
        <h3>Event facts</h3>
        ${field({ label: "Event name", name: "event_name", value: cfg.event_name })}
        ${field({ label: "Tagline", name: "event_tagline", value: cfg.event_tagline })}
        ${field({ label: "Day 1 label", name: "day1_label", value: cfg.day1_label })}
        ${field({ label: "Day 1 start time", name: "day1_start", value: cfg.day1_start })}
        ${field({ label: "Day 2 label", name: "day2_label", value: cfg.day2_label })}
        ${field({ label: "Build end time", name: "build_end_time", value: cfg.build_end_time })}
      </div>
      <div class="card">
        <h3>Dates &amp; cap</h3>
        ${field({ label: "Registration deadline", name: "registration_deadline", type: "datetime-local", value: cfg.registration_deadline.slice(0, 16) })}
        ${field({ label: "Team-lock date", name: "team_lock_date", type: "datetime-local", value: cfg.team_lock_date.slice(0, 16) })}
        ${field({ label: "Participant cap", name: "participant_cap", type: "number", value: String(cfg.participant_cap) })}
        ${field({ label: "Fee per person (NPR)", name: "fee_amount", type: "number", value: String(cfg.fee_amount) })}
      </div>
      <div class="card">
        <h3>Payment instructions</h3>
        <p class="cat-muted">These are shown to every participant on the Pay page. Real account details — enter them carefully.</p>
        ${field({ label: "eSewa ID", name: "payment_esewa_id", value: cfg.payment_esewa_id })}
        ${field({ label: "Khalti ID", name: "payment_khalti_id", value: cfg.payment_khalti_id })}
        ${field({ label: "Bank name", name: "payment_bank_name", value: cfg.payment_bank_name })}
        ${field({ label: "Bank account name", name: "payment_bank_account_name", value: cfg.payment_bank_account_name })}
        ${field({ label: "Bank account number", name: "payment_bank_account_number", value: cfg.payment_bank_account_number })}
      </div>
      <div class="card">
        <h3>Refund policy</h3>
        <label class="cat-field"><span class="cat-field-label">Shown on request / in admin notes</span>
          <textarea name="refund_policy_text" class="cat-input" rows="4">${cfg.refund_policy_text}</textarea>
        </label>
      </div>
      ${button("Save config", { type: "submit" })}
    </form>

    <div class="card">
      <h3>Email notifications</h3>
      <p class="cat-muted">Participants get a "you're confirmed" email when their payment is verified. This isn't set up yet — nothing breaks without it, emails just won't send until you run:</p>
      <pre style="background:var(--paper);border:1.5px solid var(--border);border-radius:8px;padding:10px 12px;font-size:0.82rem;overflow-x:auto">wrangler pages secret put GMAIL_ADDRESS
wrangler pages secret put GMAIL_APP_PASSWORD</pre>
      <p class="cat-muted">Use a Gmail address and an <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener">app password</a> (not your regular Gmail password) — these are secrets, so they're set via the command line, never stored here.</p>
    </div>
  `;

  return htmlResponse(adminPage({ title: "Config — CATALYST Admin", body, path: new URL(request.url).pathname, role: self.role }));
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, data }) => {
  if (!isSameOrigin(request)) return new Response("Bad request", { status: 400 });
  const admin = data.admin as AdminSession;
  const form = await request.formData();
  const action = String(form.get("action") ?? "save_config");

  if (action === "create_staff") {
    const username = String(form.get("staff_username") ?? "").trim();
    const password = String(form.get("staff_password") ?? "");
    const role = form.get("staff_role") === "admin" ? "admin" : "volunteer";

    if (username.length < 3 || password.length < 8) {
      return Response.redirect(
        new URL(
          `/catalyst/admin/config?notice=${encodeURIComponent("Username needs 3+ chars and password needs 8+ chars.")}`,
          request.url,
        ).toString(),
        303,
      );
    }

    const existing = await env.CATALYST_DB.prepare("SELECT id FROM admins WHERE username = ?1").bind(username).first();
    if (existing) {
      return Response.redirect(
        new URL(`/catalyst/admin/config?notice=${encodeURIComponent("That username is already taken.")}`, request.url).toString(),
        303,
      );
    }

    const hash = await hashSecret(password);
    const inserted = await env.CATALYST_DB
      .prepare("INSERT INTO admins (username, password_hash, role) VALUES (?1, ?2, ?3)")
      .bind(username, hash, role)
      .run();
    await logAction(env.CATALYST_DB, admin.adminId, "create_staff", `admin:${inserted.meta.last_row_id}`, `username=${username} role=${role}`);
    return Response.redirect(new URL("/catalyst/admin/config?notice=Staff account created.", request.url).toString(), 303);
  }

  if (action === "remove_staff") {
    const staffId = Number(form.get("staff_id"));
    if (staffId === admin.adminId) {
      return Response.redirect(
        new URL(`/catalyst/admin/config?notice=${encodeURIComponent("You can't remove your own account.")}`, request.url).toString(),
        303,
      );
    }
    await env.CATALYST_DB.prepare("DELETE FROM admins WHERE id = ?1").bind(staffId).run();
    await logAction(env.CATALYST_DB, admin.adminId, "remove_staff", `admin:${staffId}`);
    return Response.redirect(new URL("/catalyst/admin/config?notice=Staff account removed.", request.url).toString(), 303);
  }

  for (const key of EDITABLE_KEYS) {
    const raw = form.get(key);
    if (raw === null) continue;
    let value = String(raw);
    if ((key === "registration_deadline" || key === "team_lock_date") && value) {
      value = new Date(value).toISOString();
    }
    await setConfigValue(env.CATALYST_DB, key, value);
  }

  await logAction(env.CATALYST_DB, admin.adminId, "update_config");
  return Response.redirect(new URL("/catalyst/admin/config?notice=Saved.", request.url).toString(), 303);
};
