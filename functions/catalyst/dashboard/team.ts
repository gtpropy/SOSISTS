import type { Env, PagesFunction } from "../_lib/env";
import { isSameOrigin } from "../_lib/auth";
import { banner, button, esc, field, htmlResponse, page, redirect } from "../_lib/html";
import { getTeamById, getTeamMembers, type ParticipantRow } from "../_lib/db";
import {
  createTeam,
  joinTeamByCode,
  leaveTeam,
  regenerateInvite,
  removeMember,
  setSoloMode,
  transferLeadership,
} from "../_lib/team";
import { firstIssueMessage, teamCreateSchema } from "../_lib/validate";
import { getConfig, isTeamLocked } from "../_lib/config";

async function renderNoTeam(error?: string | null, locked?: boolean) {
  return `
    ${banner(error)}
    ${locked ? banner("Team changes are closed for CATALYST. Contact an organizer if you still need help.", "warn") : ""}
    <div class="card">
      <h1>Build your team</h1>
      <p class="cat-muted">Teams of 1 to 4. Solo is completely fine.</p>

      <h3>Create a team</h3>
      <form method="post" action="/catalyst/dashboard/team">
        <input type="hidden" name="action" value="create" />
        ${field({ label: "Team name", name: "name", required: true, maxLength: 30 })}
        ${button("Create team", { type: "submit" })}
      </form>
    </div>

    <div class="card">
      <h3>Join a team</h3>
      <form method="post" action="/catalyst/dashboard/team">
        <input type="hidden" name="action" value="join_code" />
        ${field({ label: "Team code", name: "code", required: true, maxLength: 6, placeholder: "e.g. 7K3MQX" })}
        ${button("Join with code", { type: "submit", variant: "ghost" })}
      </form>
      <p class="cat-muted">Or open the invite link a teammate sent you.</p>
    </div>

    <div class="card">
      <h3>Go solo</h3>
      <form method="post" action="/catalyst/dashboard/team" style="margin-bottom:10px">
        <input type="hidden" name="action" value="solo_own" />
        ${button("Solo — team of one", { type: "submit", variant: "ghost" })}
      </form>
      <form method="post" action="/catalyst/dashboard/team">
        <input type="hidden" name="action" value="solo_match" />
        ${button("Solo — match me with others", { type: "submit", variant: "ghost" })}
      </form>
    </div>
  `;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, data }) => {
  const participant = data.participant as ParticipantRow;
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  const cfg = await getConfig(env.CATALYST_DB);
  const locked = isTeamLocked(cfg);

  if (!participant.team_id) {
    if (participant.solo_mode !== "none") {
      const body = `
        <div class="card" style="text-align:center">
          <h1>You're going solo</h1>
          <p>${participant.solo_mode === "match" ? "An organizer will group you with other solo participants before the deadline." : "You'll take part as a team of one."}</p>
          ${!locked ? `<form method="post" action="/catalyst/dashboard/team"><input type="hidden" name="action" value="undo_solo" />${button("Changed my mind — show team options", { type: "submit", variant: "ghost" })}</form>` : ""}
        </div>`;
      return htmlResponse(page({ title: "Team — CATALYST", body }));
    }
    return htmlResponse(page({ title: "Team — CATALYST", body: await renderNoTeam(error, locked) }));
  }

  const team = await getTeamById(env.CATALYST_DB, participant.team_id);
  if (!team) return htmlResponse(page({ title: "Team — CATALYST", body: await renderNoTeam(error, locked) }));

  const members = await getTeamMembers(env.CATALYST_DB, team.id);
  const isLeader = team.leader_id === participant.id;
  const inviteUrl = new URL(`/catalyst/join/${team.invite_token}`, request.url).toString();
  const waMessage = `Join my CATALYST team "${team.name}": ${inviteUrl}`;

  const body = `
    ${banner(error)}
    <div class="card">
      <div class="cat-row">
        <h1 style="margin:0">${esc(team.name)}</h1>
        <span class="cat-chip">${members.length}/4</span>
      </div>
      <p class="cat-muted">Team code: <strong>${esc(team.code)}</strong></p>

      <div style="margin:14px 0">
        ${members
          .map(
            (m) => `
          <div class="cat-row" style="padding:10px 0;border-bottom:1px solid var(--border)">
            <div>
              <strong>${esc(m.name)}</strong> ${m.id === team.leader_id ? statusTag("Leader") : ""}
              <div class="cat-muted">${esc(m.school)}</div>
            </div>
            <div class="cat-row" style="gap:6px">
              ${m.guardian_permission && m.rules_agreed_at ? statusTag("Profile done", "good") : statusTag("Profile pending", "warn")}
            </div>
          </div>
          ${
            isLeader && m.id !== participant.id && !locked
              ? `<div class="cat-row" style="gap:8px;margin-bottom:8px">
                   <form method="post" action="/catalyst/dashboard/team" style="flex:1">
                     <input type="hidden" name="action" value="make_leader" /><input type="hidden" name="member_id" value="${m.id}" />
                     ${button("Make leader", { type: "submit", variant: "ghost" })}
                   </form>
                   <form method="post" action="/catalyst/dashboard/team" data-confirm="Remove ${esc(m.name)} from the team?" style="flex:1">
                     <input type="hidden" name="action" value="remove" /><input type="hidden" name="member_id" value="${m.id}" />
                     ${button("Remove", { type: "submit", variant: "danger" })}
                   </form>
                 </div>`
              : ""
          }
        `,
          )
          .join("")}
      </div>

      ${members.length < 4 ? `
      <p class="cat-field-label">Invite link</p>
      <div class="cat-row" style="gap:8px">
        <input class="cat-input" readonly value="${esc(inviteUrl)}" onclick="this.select()" />
        ${button("Copy", { type: "button", variant: "ghost", attrs: `data-copy="${esc(inviteUrl)}"` })}
      </div>
      <a class="cat-btn cat-btn-ghost cat-btn-block" style="margin-top:8px" href="https://wa.me/?text=${encodeURIComponent(waMessage)}" target="_blank" rel="noopener">Share on WhatsApp</a>
      ` : `<p class="cat-muted">This team is full.</p>`}

      ${
        isLeader && !locked
          ? `<form method="post" action="/catalyst/dashboard/team" style="margin-top:10px" data-confirm="This kills the old invite link. Continue?">
               <input type="hidden" name="action" value="regenerate" />
               ${button("Regenerate invite link", { type: "submit", variant: "ghost" })}
             </form>`
          : ""
      }
    </div>

    ${!locked ? `
    <form method="post" action="/catalyst/dashboard/team" data-confirm="${isLeader && members.length > 1 ? "Pass leadership to someone else first, or this won\\'t work." : "Leave this team?"}">
      <input type="hidden" name="action" value="leave" />
      ${button("Leave team", { type: "submit", variant: "danger" })}
    </form>` : ""}
  `;

  return htmlResponse(page({ title: `${team.name} — CATALYST`, body }));
};

function statusTag(label: string, kind: "good" | "warn" | "neutral" = "neutral") {
  return `<span class="cat-pill cat-pill-${kind}">${esc(label)}</span>`;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env, data }) => {
  if (!isSameOrigin(request)) return new Response("Bad request", { status: 400 });
  const participant = data.participant as ParticipantRow;
  const form = await request.formData();
  const action = String(form.get("action") ?? "");
  const db = env.CATALYST_DB;
  const cfg = await getConfig(db);
  const locked = isTeamLocked(cfg);

  const lockedActions = new Set(["create", "join_code", "leave", "remove", "regenerate", "make_leader"]);
  if (locked && lockedActions.has(action)) {
    return redirect("/catalyst/dashboard/team?error=" + encodeURIComponent("Team changes are closed for CATALYST."));
  }

  if (action === "create") {
    const parsed = teamCreateSchema.safeParse({ name: form.get("name") });
    if (!parsed.success) {
      return redirect("/catalyst/dashboard/team?error=" + encodeURIComponent(firstIssueMessage(parsed.error)));
    }
    const result = await createTeam(db, participant.id, parsed.data.name);
    if (!result.ok) return redirect("/catalyst/dashboard/team?error=" + encodeURIComponent(result.error));
    return redirect("/catalyst/dashboard/team");
  }

  if (action === "join_code") {
    const code = String(form.get("code") ?? "");
    const result = await joinTeamByCode(db, code, participant.id);
    if (!result.ok) return redirect("/catalyst/dashboard/team?error=" + encodeURIComponent(result.error));
    return redirect("/catalyst/dashboard/team");
  }

  if (action === "leave") {
    const result = await leaveTeam(db, participant.id);
    if (!result.ok) return redirect("/catalyst/dashboard/team?error=" + encodeURIComponent(result.error));
    return redirect("/catalyst/dashboard/team");
  }

  if (action === "remove") {
    const memberId = Number(form.get("member_id"));
    const result = await removeMember(db, participant.id, memberId);
    if (!result.ok) return redirect("/catalyst/dashboard/team?error=" + encodeURIComponent(result.error));
    return redirect("/catalyst/dashboard/team");
  }

  if (action === "make_leader") {
    const memberId = Number(form.get("member_id"));
    const result = await transferLeadership(db, participant.id, memberId);
    if (!result.ok) return redirect("/catalyst/dashboard/team?error=" + encodeURIComponent(result.error));
    return redirect("/catalyst/dashboard/team");
  }

  if (action === "regenerate") {
    const result = await regenerateInvite(db, participant.id);
    if (!result.ok) return redirect("/catalyst/dashboard/team?error=" + encodeURIComponent(result.error));
    return redirect("/catalyst/dashboard/team");
  }

  if (action === "solo_own" || action === "solo_match") {
    const result = await setSoloMode(db, participant.id, action === "solo_own" ? "own" : "match");
    if (!result.ok) return redirect("/catalyst/dashboard/team?error=" + encodeURIComponent(result.error));
    return redirect("/catalyst/dashboard/team");
  }

  if (action === "undo_solo") {
    await db.prepare("UPDATE participants SET solo_mode = 'none' WHERE id = ?1").bind(participant.id).run();
    return redirect("/catalyst/dashboard/team");
  }

  return redirect("/catalyst/dashboard/team");
};
