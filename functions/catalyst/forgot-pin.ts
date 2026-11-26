import type { Env, PagesFunction } from "./_lib/env";
import { isSameOrigin } from "./_lib/auth";
import { banner, button, field, htmlResponse, page } from "./_lib/html";
import { normalizeName, normalizePhone } from "./_lib/validate";

function renderForm(notice?: string | null, error?: string | null) {
  return `
    ${banner(notice, "good")}
    ${banner(error)}
    <div class="card">
      <h1>Forgot your PIN?</h1>
      <p class="cat-muted">An organizer will reset it and give you a new one in person — there's no automatic email/SMS recovery for CATALYST.</p>
      <form method="post" action="/catalyst/forgot-pin">
        ${field({ label: "Phone number", name: "phone", type: "tel", required: true, autocomplete: "tel" })}
        ${field({ label: "Full name", name: "name", required: true })}
        ${button("Request a PIN reset", { type: "submit" })}
      </form>
    </div>
    <p style="text-align:center"><a href="/catalyst/login">&larr; Back to login</a></p>
  `;
}

export const onRequestGet: PagesFunction<Env> = async () => {
  return htmlResponse(page({ title: "Forgot PIN — CATALYST", body: renderForm() }));
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isSameOrigin(request)) return new Response("Bad request", { status: 400 });

  const form = await request.formData();
  const phone = normalizePhone(String(form.get("phone") ?? ""));
  const name = String(form.get("name") ?? "");

  const participant = await env.CATALYST_DB
    .prepare("SELECT id, name FROM participants WHERE phone = ?1 AND removed_at IS NULL")
    .bind(phone)
    .first<{ id: number; name: string }>();

  // Same confirmation message whether or not it matched, so this can't be
  // used to probe which phone/name combinations exist.
  const genericNotice = "If that phone number and name matched an account, an organizer has been notified.";

  if (participant && normalizeName(participant.name) === normalizeName(name)) {
    await env.CATALYST_DB
      .prepare("UPDATE participants SET pin_reset_requested = 1 WHERE id = ?1")
      .bind(participant.id)
      .run();
  }

  return htmlResponse(page({ title: "Forgot PIN — CATALYST", body: renderForm(genericNotice) }));
};
