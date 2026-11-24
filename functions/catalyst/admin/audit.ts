import type { Env, PagesFunction } from "../_lib/env";
import { esc, htmlResponse, page } from "../_lib/html";

interface Row {
  id: number;
  admin_username: string | null;
  action: string;
  target: string | null;
  detail: string | null;
  at: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.CATALYST_DB
    .prepare(
      `SELECT a.id, ad.username as admin_username, a.action, a.target, a.detail, a.at
       FROM audit_log a LEFT JOIN admins ad ON ad.id = a.admin_id
       ORDER BY a.id DESC LIMIT 200`,
    )
    .all<Row>();

  const body = `
    <h1>Audit log</h1>
    <p class="cat-muted">Most recent 200 actions.</p>
    <div class="cat-table-wrap">
      <table class="cat-table">
        <tr><th>When</th><th>Who</th><th>Action</th><th>Target</th><th>Detail</th></tr>
        ${results
          .map(
            (r) => `<tr>
              <td>${esc(new Date(r.at).toLocaleString())}</td>
              <td>${esc(r.admin_username ?? "system")}</td>
              <td>${esc(r.action)}</td>
              <td>${esc(r.target ?? "")}</td>
              <td>${esc(r.detail ?? "")}</td>
            </tr>`,
          )
          .join("")}
      </table>
    </div>
  `;

  return htmlResponse(page({ title: "Audit log — CATALYST Admin", body }));
};
