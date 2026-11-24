import type { Env, PagesFunction } from "./_lib/env";
import { createParticipantSession, hashSecret, isSameOrigin } from "./_lib/auth";
import { generateRegNo } from "./_lib/regno";
import { banner, button, esc, field, htmlResponse, page } from "./_lib/html";
import { firstIssueMessage, signupSchema } from "./_lib/validate";
import { joinTeamByToken } from "./_lib/team";

function renderForm(opts: { error?: string | null; invite?: string; values?: Record<string, string> } = {}) {
  const v = opts.values ?? {};
  return `
    ${banner(opts.error)}
    <div class="card">
      <h1>Register for CATALYST</h1>
      <p class="cat-muted">About 30 seconds. No email, no password — just your name, phone and a 4-digit PIN you'll remember.</p>
      <form method="post" action="/catalyst/signup${opts.invite ? `?invite=${esc(opts.invite)}` : ""}">
        ${opts.invite ? `<input type="hidden" name="invite" value="${esc(opts.invite)}" />` : ""}
        ${field({ label: "Full name", name: "name", required: true, value: v.name, autocomplete: "name" })}
        ${field({ label: "Phone / WhatsApp number", name: "phone", type: "tel", required: true, value: v.phone, autocomplete: "tel" })}
        ${field({ label: "School", name: "school", required: true, value: v.school })}
        ${field({
          label: "Class",
          name: "class",
          required: true,
          value: v.class,
          options: [
            { value: "10", label: "Class 10" },
            { value: "11", label: "Class 11" },
            { value: "12", label: "Class 12" },
            { value: "gap", label: "Gap year" },
          ],
        })}
        ${field({ label: "Choose a 4-digit PIN", name: "pin", type: "tel", required: true, pattern: "[0-9]{4}", maxLength: 4, help: "You'll use this to log back in — remember it, there's no email recovery." })}
        ${button("Register", { type: "submit" })}
      </form>
    </div>
    <p style="text-align:center"><a href="/catalyst/login">Already registered? Log in</a></p>
    <p class="cat-muted" style="text-align:center">We only collect what's needed to run CATALYST. Your name and school may be shown to your teammates; your phone number and guardian details are never shown to other participants.</p>
  `;
}

function renderSuccess(regNo: string, name: string, waMessage: string) {
  return `
    <div class="card" style="text-align:center">
      <h1>You're in, ${esc(name.split(" ")[0])}! 🎉</h1>
      <p>This is your Reg.No — you'll need it to log in. <strong>Save it now.</strong></p>
      <div class="cat-regno">${esc(regNo)}</div>
      <div class="cat-row" style="justify-content:center;gap:10px">
        ${button("Copy", { type: "button", variant: "ghost", attrs: `data-copy="${esc(regNo)}"` })}
        <a class="cat-btn cat-btn-ghost" href="https://wa.me/?text=${encodeURIComponent(waMessage)}" target="_blank" rel="noopener">Send to my WhatsApp</a>
      </div>
      <p class="cat-muted" style="margin-top:14px">📸 Take a screenshot of this screen too, just in case.</p>
      <a class="cat-btn cat-btn-primary cat-btn-block" style="margin-top:10px" href="/catalyst/dashboard">Continue</a>
    </div>
  `;
}

export const onRequestGet: PagesFunction<Env> = async ({ request }) => {
  const url = new URL(request.url);
  const invite = url.searchParams.get("invite") ?? undefined;
  return htmlResponse(page({ title: "Register — CATALYST", body: renderForm({ invite }) }));
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isSameOrigin(request)) return new Response("Bad request", { status: 400 });

  const form = await request.formData();
  const invite = String(form.get("invite") ?? "") || undefined;
  const raw = {
    name: String(form.get("name") ?? ""),
    phone: String(form.get("phone") ?? ""),
    school: String(form.get("school") ?? ""),
    class: String(form.get("class") ?? ""),
    pin: String(form.get("pin") ?? ""),
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return htmlResponse(
      page({
        title: "Register — CATALYST",
        body: renderForm({ error: firstIssueMessage(parsed.error), invite, values: raw }),
      }),
      { status: 400 },
    );
  }
  const data = parsed.data;

  const existingPhone = await env.CATALYST_DB
    .prepare("SELECT reg_no FROM participants WHERE phone = ?1 AND removed_at IS NULL")
    .bind(data.phone)
    .first<{ reg_no: string }>();
  if (existingPhone) {
    return htmlResponse(
      page({
        title: "Register — CATALYST",
        body: renderForm({
          error: "That phone number is already registered. Log in instead.",
          invite,
          values: raw,
        }),
      }),
      { status: 400 },
    );
  }

  const regNo = await generateRegNo(env.CATALYST_DB);
  const pinHash = await hashSecret(data.pin);

  const insert = await env.CATALYST_DB
    .prepare(
      `INSERT INTO participants (reg_no, name, phone, school, class, pin_hash)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
    )
    .bind(regNo, data.name, data.phone, data.school, data.class, pinHash)
    .run();

  const participantId = insert.meta.last_row_id;
  if (!participantId) return new Response("Could not create account. Please try again.", { status: 500 });

  const cookie = await createParticipantSession(participantId, env.SESSION_SECRET);

  let joinNote = "";
  if (invite) {
    const result = await joinTeamByToken(env.CATALYST_DB, invite, participantId);
    if (!result.ok) joinNote = `<p class="cat-muted">(${esc(result.error)} — you can still join a team from your dashboard.)</p>`;
  }

  const waMessage = `My CATALYST Reg.No is ${regNo} — saving this so I don't lose it!`;
  return htmlResponse(
    page({ title: "You're registered! — CATALYST", body: renderSuccess(regNo, data.name, waMessage) + joinNote }),
    { headers: { "Set-Cookie": cookie } },
  );
};
