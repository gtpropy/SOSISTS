import type { Env, PagesFunction } from "../_lib/env";
import { type AdminSession, isSameOrigin } from "../_lib/auth";
import { adminPage, banner, button, esc, field, htmlResponse } from "../_lib/html";
import { generateTeamCode, randomToken } from "../_lib/regno";
import { logAction } from "../_lib/audit";

interface SoloRow {
  id: number;
  reg_no: string;
  name: string;
  school: string;
  class: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, data }) => {
  const admin = data.admin as AdminSession;
  const notice = new URL(request.url).searchParams.get("notice");
  const { results } = await env.CATALYST_DB
    .prepare(
      "SELECT id, reg_no, name, school, class FROM participants WHERE solo_mode = 'match' AND team_id IS NULL AND removed_at IS NULL ORDER BY school, class",
    )
    .all<SoloRow>();

  const body = `
    <h1>Solo matching</h1>
    ${banner(notice, "good")}
    <p class="cat-muted">${results.length} solo participants waiting to be grouped. Pick up to 4 and give the new team a name.</p>
    <form method="post" action="/catalyst/admin/solo">
      <input type="hidden" name="action" value="create_team" />
      <div class="card">
        ${results
          .map(
            (r) => `<label class="cat-checkbox"><input type="checkbox" name="ids" value="${r.id}" /><span><strong>${esc(r.name)}</strong> — ${esc(r.school)}, Class ${esc(r.class)} (${esc(r.reg_no)})</span></label>`,
          )
          .join("")}
      </div>
      ${field({ label: "New team name", name: "team_name", required: true, maxLength: 30 })}
      ${button("Create team from selected", { type: "submit" })}
    </form>
  `;

  return htmlResponse(adminPage({ title: "Solo matching — CATALYST Admin", body, path: new URL(request.url).pathname, role: admin.role }));
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, data }) => {
  if (!isSameOrigin(request)) return new Response("Bad request", { status: 400 });
  const admin = data.admin as AdminSession;
  const db = env.CATALYST_DB;
  const form = await request.formData();
  const ids = form.getAll("ids").map((v) => Number(v)).filter(Number.isFinite);
  const teamName = String(form.get("team_name") ?? "").trim();

  function redir(notice: string) {
    return Response.redirect(new URL(`/catalyst/admin/solo?notice=${encodeURIComponent(notice)}`, request.url).toString(), 303);
  }

  if (ids.length === 0 || ids.length > 4) return redir("Pick between 1 and 4 people.");
  if (!teamName) return redir("Team name is required.");

  const existing = await db.prepare("SELECT id FROM teams WHERE name = ?1").bind(teamName).first();
  if (existing) return redir("That team name is already taken.");

  const code = await generateTeamCode(db);
  const token = randomToken();
  const leaderId = ids[0];

  const insert = await db
    .prepare("INSERT INTO teams (name, code, invite_token, leader_id) VALUES (?1, ?2, ?3, ?4)")
    .bind(teamName, code, token, leaderId)
    .run();
  const teamId = insert.meta.last_row_id;
  if (!teamId) return redir("Could not create the team.");

  for (const id of ids) {
    await db.prepare("UPDATE participants SET team_id = ?1, solo_mode = 'none' WHERE id = ?2").bind(teamId, id).run();
  }

  await logAction(db, admin.adminId, "create_team_from_solo", `team:${teamId}`, `members=${ids.join(",")}`);
  return redir(`Created "${teamName}" with ${ids.length} member(s).`);
};
