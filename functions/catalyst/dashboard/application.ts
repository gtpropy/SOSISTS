import type { Env, PagesFunction } from "../_lib/env";
import { isSameOrigin } from "../_lib/auth";
import { banner, button, esc, htmlResponse, page, redirect, wizardSteps } from "../_lib/html";
import { applicationSchema, firstIssueMessage } from "../_lib/validate";
import { hasApplication, hasCompleteProfile, type ParticipantRow } from "../_lib/db";
import { ONBOARDING_STEPS } from "../signup";

const MAX_CV_BYTES = 5 * 1024 * 1024;

function renderForm(p: ParticipantRow, error?: string | null) {
  const onboarding = !hasApplication(p);
  return `
    ${onboarding ? wizardSteps(3, ONBOARDING_STEPS) : ""}
    ${banner(error)}
    <div class="card">
      <h1>Tell us why</h1>
      <p class="cat-muted">This is the main thing organizers look at if we get more applications than spots — be yourself, there's no "right" answer.</p>
      <form method="post" action="/catalyst/dashboard/application" enctype="multipart/form-data" data-upload-form>
        <label class="cat-field" for="f_why_join">
          <span class="cat-field-label">Why do you want to join CATALYST? *</span>
          <textarea id="f_why_join" name="why_join" required minlength="20" maxlength="1000" rows="6" class="cat-input">${esc(p.why_join ?? "")}</textarea>
          <span class="cat-field-help">20–1000 characters.</span>
        </label>
        <label class="cat-field" for="f_cv">
          <span class="cat-field-label">CV / resume (PDF, optional)</span>
          <input type="file" id="f_cv" name="cv" accept="application/pdf" class="cat-input" />
          <span class="cat-field-help">${p.cv_key ? "You've already uploaded one — pick a file here only if you want to replace it." : "Not required, but it helps us get to know you."}</span>
        </label>
        ${button(onboarding ? "Next: Team →" : "Save", { type: "submit" })}
      </form>
    </div>
    ${onboarding ? "" : `<p style="text-align:center"><a href="/catalyst/dashboard">&larr; Back to dashboard</a></p>`}
  `;
}

export const onRequestGet: PagesFunction<Env> = async ({ data }) => {
  const participant = data.participant as ParticipantRow;
  if (!hasCompleteProfile(participant)) return redirect("/catalyst/dashboard/profile");
  return htmlResponse(page({ title: "Your application — CATALYST", body: renderForm(participant) }));
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, data }) => {
  const participant = data.participant as ParticipantRow;
  if (!isSameOrigin(request)) return new Response("Bad request", { status: 400 });
  if (!hasCompleteProfile(participant)) return redirect("/catalyst/dashboard/profile");

  const form = await request.formData();
  const whyJoin = String(form.get("why_join") ?? "");
  const parsed = applicationSchema.safeParse({ why_join: whyJoin });

  if (!parsed.success) {
    return htmlResponse(
      page({
        title: "Your application — CATALYST",
        body: renderForm({ ...participant, why_join: whyJoin }, firstIssueMessage(parsed.error)),
      }),
      { status: 400 },
    );
  }

  let cvKey = participant.cv_key;
  const file = form.get("cv");
  if (file instanceof File && file.size > 0) {
    if (file.type !== "application/pdf") {
      return htmlResponse(
        page({ title: "Your application — CATALYST", body: renderForm({ ...participant, why_join: whyJoin }, "CV must be a PDF.") }),
        { status: 400 },
      );
    }
    if (file.size > MAX_CV_BYTES) {
      return htmlResponse(
        page({ title: "Your application — CATALYST", body: renderForm({ ...participant, why_join: whyJoin }, "CV is too large (max 5MB).") }),
        { status: 400 },
      );
    }
    cvKey = `cv/${participant.id}.pdf`;
    await env.CATALYST_UPLOADS.put(cvKey, await file.arrayBuffer(), { httpMetadata: { contentType: "application/pdf" } });
  }

  await env.CATALYST_DB
    .prepare("UPDATE participants SET why_join = ?1, cv_key = ?2 WHERE id = ?3")
    .bind(parsed.data.why_join, cvKey, participant.id)
    .run();

  const wasOnboarding = !hasApplication(participant);
  return redirect(wasOnboarding ? "/catalyst/dashboard/team" : "/catalyst/dashboard");
};
