import type { Env, PagesFunction } from "../_lib/env";
import { isSameOrigin } from "../_lib/auth";
import { banner, button, field, htmlResponse, page, redirect, wizardSteps } from "../_lib/html";
import { firstIssueMessage, profileSchema } from "../_lib/validate";
import { hasApplication, type ParticipantRow } from "../_lib/db";
import { ONBOARDING_STEPS } from "../signup";

function renderForm(p: ParticipantRow, error?: string | null) {
  const onboarding = !hasApplication(p);
  return `
    ${onboarding ? wizardSteps(2, ONBOARDING_STEPS) : ""}
    ${banner(error)}
    <div class="card">
      <h1>Your profile</h1>
      <p class="cat-muted">We need a guardian contact since CATALYST runs into the evening, plus a couple of consents.</p>
      <form method="post" action="/catalyst/dashboard/profile">
        ${field({ label: "Guardian name", name: "guardian_name", required: true, value: p.guardian_name ?? "" })}
        ${field({ label: "Guardian phone", name: "guardian_phone", type: "tel", required: true, value: p.guardian_phone ?? "" })}
        ${field({
          label: "Dietary preference",
          name: "diet",
          required: true,
          value: p.diet ?? "",
          options: [
            { value: "none", label: "No restrictions" },
            { value: "vegetarian", label: "Vegetarian" },
            { value: "vegan", label: "Vegan" },
            { value: "other", label: "Other (tell a volunteer)" },
          ],
        })}
        <label class="cat-checkbox">
          <input type="checkbox" name="photo_consent" ${p.photo_consent ? "checked" : ""} />
          <span>I'm okay with photos/video of me being used for CATALYST promotion.</span>
        </label>
        <label class="cat-checkbox">
          <input type="checkbox" name="guardian_permission" required ${p.guardian_permission ? "checked" : ""} />
          <span>My guardian has given me permission to take part in an event that runs into the evening on both days. *</span>
        </label>
        <label class="cat-checkbox">
          <input type="checkbox" name="rules_agreed" required ${p.rules_agreed_at ? "checked" : ""} />
          <span>I have read the <a href="/catalyst/rules" target="_blank" rel="noopener">Rules &amp; Conditions</a> and agree to follow them. *</span>
        </label>
        ${button(onboarding ? "Next: Tell us why →" : "Save profile", { type: "submit" })}
      </form>
    </div>
    ${onboarding ? "" : `<p style="text-align:center"><a href="/catalyst/dashboard">&larr; Back to dashboard</a></p>`}
  `;
}

export const onRequestGet: PagesFunction<Env> = async ({ data }) => {
  return htmlResponse(page({ title: "Profile — CATALYST", body: renderForm(data.participant as ParticipantRow) }));
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, data }) => {
  const participant = data.participant as ParticipantRow;
  if (!isSameOrigin(request)) return new Response("Bad request", { status: 400 });

  const form = await request.formData();
  const raw = {
    guardian_name: String(form.get("guardian_name") ?? ""),
    guardian_phone: String(form.get("guardian_phone") ?? ""),
    diet: String(form.get("diet") ?? ""),
    photo_consent: form.get("photo_consent") ? ("on" as const) : undefined,
    guardian_permission: form.get("guardian_permission") ? ("on" as const) : undefined,
    rules_agreed: form.get("rules_agreed") ? ("on" as const) : undefined,
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return htmlResponse(
      page({
        title: "Profile — CATALYST",
        body: renderForm({ ...participant, ...raw, photo_consent: raw.photo_consent ? 1 : 0 } as unknown as ParticipantRow, firstIssueMessage(parsed.error)),
      }),
      { status: 400 },
    );
  }

  await env.CATALYST_DB
    .prepare(
      `UPDATE participants SET guardian_name = ?1, guardian_phone = ?2, diet = ?3,
       photo_consent = ?4, guardian_permission = 1, rules_agreed_at = COALESCE(rules_agreed_at, ?5)
       WHERE id = ?6`,
    )
    .bind(
      parsed.data.guardian_name,
      parsed.data.guardian_phone,
      parsed.data.diet,
      parsed.data.photo_consent ? 1 : 0,
      new Date().toISOString(),
      participant.id,
    )
    .run();

  return redirect(hasApplication(participant) ? "/catalyst/dashboard" : "/catalyst/dashboard/application");
};
