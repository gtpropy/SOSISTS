import type { Env, PagesFunction } from "../_lib/env";
import { htmlResponse, page, statusPill } from "../_lib/html";
import { deriveStatus, getLatestPayment, hasCompleteProfile, hasTeam, STATUS_LABELS, type ParticipantRow } from "../_lib/db";
import { getConfig } from "../_lib/config";

export const onRequestGet: PagesFunction<Env> = async ({ env, data }) => {
  const participant = data.participant as ParticipantRow;
  const cfg = await getConfig(env.CATALYST_DB);

  const profileDone = hasCompleteProfile(participant);
  const teamDone = hasTeam(participant);
  const payment = await getLatestPayment(env.CATALYST_DB, participant.id);
  const payDone = payment?.status === "verified";
  const status = await deriveStatus(env.CATALYST_DB, participant);

  const steps = [
    { label: "Complete your profile", href: "/catalyst/dashboard/profile", done: profileDone },
    {
      label: teamDone
        ? participant.team_id
          ? "Team"
          : "Going solo"
        : "Create, join or go solo",
      href: "/catalyst/dashboard/team",
      done: teamDone,
    },
    {
      label: `Pay NPR ${cfg.fee_amount}`,
      href: "/catalyst/dashboard/pay",
      done: payDone,
      locked: !profileDone,
    },
    { label: "Confirmed — get your ticket", href: "/catalyst/dashboard/ticket", done: status === "confirmed" || status === "checked_in" },
  ];

  const body = `
    <div class="cat-row" style="margin-bottom:14px">
      <h1 style="margin:0">Hi, ${participant.name.split(" ")[0]}</h1>
      ${statusPill(STATUS_LABELS[status], status === "confirmed" || status === "checked_in" ? "good" : status === "payment_under_review" ? "warn" : "neutral")}
    </div>
    <p class="cat-muted">Reg.No <strong>${participant.reg_no}</strong></p>

    <ul class="cat-checklist">
      ${steps
        .map(
          (s, i) => `
        <li class="${s.done ? "done" : ""}">
          <span class="tick">${s.done ? "✓" : i + 1}</span>
          <div style="flex:1">
            <a href="${s.locked ? "#" : s.href}" style="${s.locked ? "pointer-events:none;color:var(--ink-faint)" : "font-weight:600"}">${s.label}</a>
            ${s.locked ? '<div class="cat-muted">Finish your profile first</div>' : ""}
          </div>
        </li>`,
        )
        .join("")}
    </ul>

    <div class="card">
      <h3>Event details</h3>
      <p><strong>${cfg.day1_label}</strong> — opening programme, then the build sprint, from ${cfg.day1_start}.</p>
      <p><strong>${cfg.day2_label}</strong> — public showcase, judging, winners announced.</p>
    </div>

    <form method="post" action="/catalyst/logout" style="text-align:center">
      ${`<button type="submit" class="cat-btn cat-btn-ghost">Log out</button>`}
    </form>
  `;

  return htmlResponse(page({ title: "Dashboard — CATALYST", body }));
};
