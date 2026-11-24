import type { Env, PagesFunction } from "./_lib/env";
import { getConfig } from "./_lib/config";
import { getParticipantSession } from "./_lib/auth";
import { esc, htmlResponse, page } from "./_lib/html";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const session = await getParticipantSession(request, env.SESSION_SECRET);
  if (session) return Response.redirect(new URL("/catalyst/dashboard", request.url).toString(), 303);

  const cfg = await getConfig(env.CATALYST_DB);

  const body = `
    <div class="card" style="text-align:center">
      <span class="cat-pill cat-pill-warn">Interschool Hackathon</span>
      <h1 class="doodle-underline" style="margin-top:14px">${esc(cfg.event_name)}</h1>
      <p style="font-size:1.1rem">${esc(cfg.event_tagline)}</p>
      <div class="cat-grid-3" style="margin:18px 0">
        <div class="cat-chip">📅 ${esc(cfg.day1_label)}</div>
        <div class="cat-chip">🎤 ${esc(cfg.day2_label)}</div>
        <div class="cat-chip">💵 NPR ${esc(cfg.fee_amount)} / person</div>
      </div>
      <a class="cat-btn cat-btn-primary cat-btn-block" href="/catalyst/signup">Register now</a>
      <p style="margin-top:14px"><a href="/catalyst/login">Already registered? Log in</a></p>
    </div>

    <div class="card">
      <h3>How it works</h3>
      <ol style="padding-left:20px;margin:0">
        <li>Everyone registers on their own first — about 30 seconds.</li>
        <li>Then create a team, join one with a link, or go solo.</li>
        <li>Pay NPR ${esc(cfg.fee_amount)} (covers food on both days).</li>
        <li>Show your ticket QR code at the door.</li>
      </ol>
    </div>

    <div class="card">
      <h3>Who can join</h3>
      <p>Class 10, 11, 12 and gap-year students from Kaski District. Teams of 1&ndash;4 — solo is welcome.</p>
      <p class="cat-muted">Organized by ISTSOS at SOS Hermann Gmeiner Secondary School Gandaki, Pokhara. Supported by BPC.</p>
    </div>

    <p style="text-align:center"><a href="/catalyst/rules">Read the full Rules &amp; Conditions &rarr;</a></p>
  `;

  return htmlResponse(page({ title: `${cfg.event_name} — Register`, body }));
};
