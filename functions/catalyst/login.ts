import type { Env, PagesFunction } from "./_lib/env";
import { createParticipantSession, isSameOrigin, verifySecret } from "./_lib/auth";
import { banner, button, esc, field, htmlResponse, page } from "./_lib/html";
import { loginSchema, normalizeName } from "./_lib/validate";
import { getParticipantByRegNo } from "./_lib/db";
import { joinTeamByToken } from "./_lib/team";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;
const GENERIC_ERROR = "Reg.No, name or PIN didn't match. Double check and try again.";

function renderForm(error: string | null | undefined, values: Record<string, string> | undefined, invite?: string) {
  const v = values ?? {};
  return `
    ${banner(error)}
    <div class="card">
      <h1>Log in</h1>
      <form method="post" action="/catalyst/login${invite ? `?invite=${esc(invite)}` : ""}">
        ${invite ? `<input type="hidden" name="invite" value="${esc(invite)}" />` : ""}
        ${field({ label: "Reg.No", name: "reg_no", required: true, value: v.reg_no, placeholder: "CAT-XXXX" })}
        ${field({ label: "Full name", name: "name", required: true, value: v.name })}
        ${field({ label: "4-digit PIN", name: "pin", type: "tel", required: true, pattern: "[0-9]{4}", maxLength: 4 })}
        ${button("Log in", { type: "submit" })}
      </form>
    </div>
    <p style="text-align:center"><a href="/catalyst/signup${invite ? `?invite=${esc(invite)}` : ""}">New here? Register</a></p>
    <p style="text-align:center"><a href="/catalyst/forgot-pin">Forgot your PIN?</a></p>
  `;
}

export const onRequestGet: PagesFunction<Env> = async ({ request }) => {
  const invite = new URL(request.url).searchParams.get("invite") ?? undefined;
  return htmlResponse(page({ title: "Log in — CATALYST", body: renderForm(null, undefined, invite) }));
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isSameOrigin(request)) return new Response("Bad request", { status: 400 });

  const form = await request.formData();
  const invite = String(form.get("invite") ?? "") || undefined;
  const raw = {
    reg_no: String(form.get("reg_no") ?? ""),
    name: String(form.get("name") ?? ""),
    pin: String(form.get("pin") ?? ""),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return htmlResponse(page({ title: "Log in — CATALYST", body: renderForm(GENERIC_ERROR, raw, invite) }), {
      status: 400,
    });
  }

  const regNo = parsed.data.reg_no.trim().toUpperCase();
  const participant = await getParticipantByRegNo(env.CATALYST_DB, regNo);

  // Always compare against *something* even when the Reg.No doesn't exist,
  // so response timing doesn't reveal whether a Reg.No is registered.
  const decoyHash = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8n0g6a4z8nE9z3H9r9m2k8l9r7e8W6";
  const pinMatches = await verifySecret(parsed.data.pin, participant?.pin_hash ?? decoyHash);

  if (!participant) {
    return htmlResponse(page({ title: "Log in — CATALYST", body: renderForm(GENERIC_ERROR, raw, invite) }), {
      status: 401,
    });
  }

  const now = Date.now();
  if (participant.locked_until && new Date(participant.locked_until).getTime() > now) {
    return htmlResponse(
      page({
        title: "Log in — CATALYST",
        body: renderForm("Too many attempts. Try again in 15 minutes.", raw, invite),
      }),
      { status: 429 },
    );
  }

  const nameMatches = normalizeName(participant.name) === normalizeName(parsed.data.name);

  if (!nameMatches || !pinMatches) {
    const windowStillOpen =
      participant.first_failed_at && now - new Date(participant.first_failed_at).getTime() < WINDOW_MS;
    const failed = windowStillOpen ? participant.failed_logins + 1 : 1;
    const firstFailedAt = windowStillOpen ? participant.first_failed_at : new Date(now).toISOString();
    const lockedUntil = failed >= MAX_ATTEMPTS ? new Date(now + LOCK_MS).toISOString() : null;

    await env.CATALYST_DB
      .prepare(
        "UPDATE participants SET failed_logins = ?1, first_failed_at = ?2, locked_until = ?3 WHERE id = ?4",
      )
      .bind(lockedUntil ? 0 : failed, lockedUntil ? null : firstFailedAt, lockedUntil, participant.id)
      .run();

    const msg = lockedUntil ? "Too many attempts. Try again in 15 minutes." : GENERIC_ERROR;
    return htmlResponse(page({ title: "Log in — CATALYST", body: renderForm(msg, raw, invite) }), {
      status: 401,
    });
  }

  await env.CATALYST_DB
    .prepare("UPDATE participants SET failed_logins = 0, first_failed_at = NULL, locked_until = NULL WHERE id = ?1")
    .bind(participant.id)
    .run();

  const cookie = await createParticipantSession(participant.id, env.SESSION_SECRET);

  // If this login came from an invite link and the person isn't already on
  // a team, join them automatically. If they're already on a different
  // team, don't silently switch them — they land on their dashboard and
  // the join link page (which they'd need to reopen) asks to confirm.
  if (invite && !participant.team_id) {
    await joinTeamByToken(env.CATALYST_DB, invite, participant.id);
  }

  return new Response(null, {
    status: 303,
    headers: { Location: "/catalyst/dashboard", "Set-Cookie": cookie },
  });
};
