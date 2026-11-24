import type { Env, PagesFunction } from "../_lib/env";
import { type AdminSession, isSameOrigin } from "../_lib/auth";
import { banner, button, esc, field, htmlResponse, page } from "../_lib/html";
import { logAction } from "../_lib/audit";

interface TeamSummary {
  id: number;
  name: string;
  code: string;
  locked: number;
  member_count: number;
  verified_count: number;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const notice = new URL(request.url).searchParams.get("notice");
  const { results } = await env.CATALYST_DB
    .prepare(
      `SELECT t.id, t.name, t.code, t.locked,
              (SELECT COUNT(*) FROM participants WHERE team_id = t.id AND removed_at IS NULL) as member_count,
              (SELECT COUNT(DISTINCT p.id) FROM participants p
                 JOIN payments pay ON pay.participant_id = p.id AND pay.status = 'verified'
                 WHERE p.team_id = t.id) as verified_count
       FROM teams t ORDER BY t.name ASC`,
    )
    .all<TeamSummary>();

  const body = `
    <h1>Teams</h1>
    ${banner(notice, "good")}
    <div class="cat-table-wrap">
      <table class="cat-table">
        <tr><th>Name</th><th>Code</th><th>Members</th><th>Paid</th><th>Status</th><th></th></tr>
        ${results
          .map(
            (t) => `
          <tr>
            <td>${esc(t.name)}</td>
            <td>${esc(t.code)}</td>
            <td>${t.member_count}/4</td>
            <td>${t.verified_count}/${t.member_count}</td>
            <td>${t.verified_count === t.member_count && t.member_count > 0 ? "Complete" : "Incomplete"} ${t.locked ? "🔒" : ""}</td>
            <td style="white-space:nowrap">
              <form method="post" action="/catalyst/admin/teams" style="display:inline">
                <input type="hidden" name="action" value="${t.locked ? "unlock" : "lock"}" />
                <input type="hidden" name="team_id" value="${t.id}" />
                <button type="submit" class="cat-btn cat-btn-ghost" style="min-height:0;padding:4px 10px;font-size:0.8rem">${t.locked ? "Unlock" : "Lock"}</button>
              </form>
              <form method="post" action="/catalyst/admin/teams" style="display:inline" data-rename-form data-team-id="${t.id}" data-team-name="${esc(t.name)}">
                <input type="hidden" name="action" value="rename" />
                <input type="hidden" name="team_id" value="${t.id}" />
                <input type="hidden" name="new_name" value="" />
                <button type="button" class="cat-btn cat-btn-ghost" data-rename-btn style="min-height:0;padding:4px 10px;font-size:0.8rem">Rename</button>
              </form>
            </td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>

    <div class="card">
      <h3>Move a participant</h3>
      <form method="post" action="/catalyst/admin/teams">
        <input type="hidden" name="action" value="move" />
        ${field({ label: "Participant Reg.No", name: "reg_no", required: true, placeholder: "CAT-XXXX" })}
        ${field({ label: "Target team code (blank = remove from team)", name: "team_code", placeholder: "e.g. 7K3MQX" })}
        ${button("Move", { type: "submit", variant: "ghost" })}
      </form>
    </div>

    <div class="card">
      <h3>Merge teams</h3>
      <p class="cat-muted">Moves every member of the source team into the target team (must fit within 4), then deletes the source team.</p>
      <form method="post" action="/catalyst/admin/teams" data-confirm="Merge these teams? This can't be undone.">
        <input type="hidden" name="action" value="merge" />
        ${field({ label: "Source team code (dissolved)", name: "from_code", required: true })}
        ${field({ label: "Target team code (kept)", name: "to_code", required: true })}
        ${button("Merge", { type: "submit", variant: "danger" })}
      </form>
    </div>
  `;

  return htmlResponse(page({ title: "Teams — CATALYST Admin", body }));
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, data }) => {
  if (!isSameOrigin(request)) return new Response("Bad request", { status: 400 });
  const admin = data.admin as AdminSession;
  const db = env.CATALYST_DB;
  const form = await request.formData();
  const action = String(form.get("action") ?? "");

  function redir(notice: string) {
    return Response.redirect(new URL(`/catalyst/admin/teams?notice=${encodeURIComponent(notice)}`, request.url).toString(), 303);
  }

  if (action === "lock" || action === "unlock") {
    const teamId = Number(form.get("team_id"));
    await db.prepare("UPDATE teams SET locked = ?1 WHERE id = ?2").bind(action === "lock" ? 1 : 0, teamId).run();
    await logAction(db, admin.adminId, `${action}_team`, `team:${teamId}`);
    return redir(action === "lock" ? "Team locked." : "Team unlocked.");
  }

  if (action === "rename") {
    const teamId = Number(form.get("team_id"));
    const newName = String(form.get("new_name") ?? "").trim();
    if (newName.length < 3 || newName.length > 30) {
      return redir("Team name must be 3-30 characters.");
    }
    const clash = await db.prepare("SELECT id FROM teams WHERE name = ?1 AND id != ?2").bind(newName, teamId).first();
    if (clash) return redir("Another team already has that name.");

    await db.prepare("UPDATE teams SET name = ?1 WHERE id = ?2").bind(newName, teamId).run();
    await logAction(db, admin.adminId, "rename_team", `team:${teamId}`, newName);
    return redir("Renamed.");
  }

  if (action === "move") {
    const regNo = String(form.get("reg_no") ?? "").trim().toUpperCase();
    const teamCode = String(form.get("team_code") ?? "").trim().toUpperCase();
    const participant = await db.prepare("SELECT id FROM participants WHERE reg_no = ?1").bind(regNo).first<{ id: number }>();
    if (!participant) return redir("No participant with that Reg.No.");

    if (!teamCode) {
      await db.prepare("UPDATE participants SET team_id = NULL WHERE id = ?1").bind(participant.id).run();
      await logAction(db, admin.adminId, "move_participant", `participant:${participant.id}`, "removed from team");
      return redir("Removed from team.");
    }

    const team = await db.prepare("SELECT id FROM teams WHERE code = ?1").bind(teamCode).first<{ id: number }>();
    if (!team) return redir("No team with that code.");
    const count = await db.prepare("SELECT COUNT(*) as n FROM participants WHERE team_id = ?1").bind(team.id).first<{ n: number }>();
    if ((count?.n ?? 0) >= 4) return redir("That team is already full.");

    await db.prepare("UPDATE participants SET team_id = ?1, solo_mode = 'none' WHERE id = ?2").bind(team.id, participant.id).run();
    await logAction(db, admin.adminId, "move_participant", `participant:${participant.id}`, `-> team ${teamCode}`);
    return redir("Moved.");
  }

  if (action === "merge") {
    const fromCode = String(form.get("from_code") ?? "").trim().toUpperCase();
    const toCode = String(form.get("to_code") ?? "").trim().toUpperCase();
    const from = await db.prepare("SELECT id FROM teams WHERE code = ?1").bind(fromCode).first<{ id: number }>();
    const to = await db.prepare("SELECT id FROM teams WHERE code = ?1").bind(toCode).first<{ id: number }>();
    if (!from || !to) return redir("Couldn't find one of those teams.");
    if (from.id === to.id) return redir("Pick two different teams.");

    const [fromCount, toCount] = await Promise.all([
      db.prepare("SELECT COUNT(*) as n FROM participants WHERE team_id = ?1").bind(from.id).first<{ n: number }>(),
      db.prepare("SELECT COUNT(*) as n FROM participants WHERE team_id = ?1").bind(to.id).first<{ n: number }>(),
    ]);
    if ((fromCount?.n ?? 0) + (toCount?.n ?? 0) > 4) return redir("Merged team would have more than 4 members.");

    await db.prepare("UPDATE participants SET team_id = ?1 WHERE team_id = ?2").bind(to.id, from.id).run();
    await db.prepare("DELETE FROM teams WHERE id = ?1").bind(from.id).run();
    await logAction(db, admin.adminId, "merge_teams", `team:${from.id}->${to.id}`);
    return redir("Merged.");
  }

  return redir("No action taken.");
};
