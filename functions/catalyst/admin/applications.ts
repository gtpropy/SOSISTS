import type { Env, PagesFunction } from "../_lib/env";
import { type AdminSession } from "../_lib/auth";
import { adminPage, esc, htmlResponse } from "../_lib/html";

interface Row {
  id: number;
  reg_no: string;
  name: string;
  school: string;
  class: string;
  team_name: string | null;
  why_join: string | null;
  cv_key: string | null;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, data }) => {
  const admin = data.admin as AdminSession;
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";

  const { results } = await env.CATALYST_DB
    .prepare(
      `SELECT p.id, p.reg_no, p.name, p.school, p.class, t.name as team_name, p.why_join, p.cv_key
       FROM participants p
       LEFT JOIN teams t ON t.id = p.team_id
       WHERE p.removed_at IS NULL
         AND (?1 = '' OR p.name LIKE '%' || ?1 || '%' OR p.reg_no LIKE '%' || ?1 || '%' OR p.school LIKE '%' || ?1 || '%')
       ORDER BY (p.why_join IS NULL) ASC, p.created_at ASC
       LIMIT 300`,
    )
    .bind(q)
    .all<Row>();

  const answered = results.filter((r) => r.why_join);
  const unanswered = results.filter((r) => !r.why_join);

  const body = `
    <h1>Applications</h1>
    <p class="cat-muted">Use this to help decide who gets in if registration is oversubscribed. ${answered.length} answered, ${unanswered.length} haven't filled this in yet.</p>
    <form method="get" action="/catalyst/admin/applications" class="cat-row" style="margin-bottom:14px">
      <input class="cat-input" name="q" value="${esc(q)}" placeholder="Search name, Reg.No, school" style="flex:1" />
      <button type="submit" class="cat-btn cat-btn-ghost">Search</button>
    </form>
    ${answered
      .map(
        (r) => `
      <div class="card">
        <div class="cat-row">
          <strong>${esc(r.name)}</strong>
          <span class="cat-muted">${esc(r.reg_no)}</span>
        </div>
        <p class="cat-muted">${esc(r.school)} &middot; Class ${esc(r.class)}${r.team_name ? ` &middot; Team: ${esc(r.team_name)}` : ""}</p>
        <p style="white-space:pre-wrap">${esc(r.why_join)}</p>
        ${r.cv_key ? `<a class="cat-btn cat-btn-ghost" href="/catalyst/admin/cv/${r.id}" target="_blank" rel="noopener">Download CV</a>` : `<span class="cat-muted">No CV uploaded</span>`}
      </div>`,
      )
      .join("")}
    ${
      unanswered.length > 0
        ? `<h3>Haven't answered yet (${unanswered.length})</h3>
           <div class="cat-table-wrap"><table class="cat-table">
             <tr><th>Reg.No</th><th>Name</th><th>School</th></tr>
             ${unanswered.map((r) => `<tr><td>${esc(r.reg_no)}</td><td>${esc(r.name)}</td><td>${esc(r.school)}</td></tr>`).join("")}
           </table></div>`
        : ""
    }
  `;

  return htmlResponse(adminPage({ title: "Applications — CATALYST Admin", body, path: url.pathname, role: admin.role }));
};
