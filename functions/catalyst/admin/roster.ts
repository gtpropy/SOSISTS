import type { Env, PagesFunction } from "../_lib/env";
import { esc, htmlResponse, page } from "../_lib/html";

interface Row {
  reg_no: string;
  name: string;
  school: string;
  class: string;
  team_name: string | null;
  checked_in: number;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.CATALYST_DB
    .prepare(
      `SELECT p.reg_no, p.name, p.school, p.class, t.name as team_name,
              (SELECT 1 FROM scans WHERE participant_id = p.id AND kind IN ('checkin_d1','checkin_d2') LIMIT 1) as checked_in
       FROM participants p
       LEFT JOIN teams t ON t.id = p.team_id
       JOIN payments pay ON pay.participant_id = p.id AND pay.status = 'verified'
       WHERE p.removed_at IS NULL
       GROUP BY p.id
       ORDER BY t.name, p.name`,
    )
    .all<Row>();

  const body = `
    <div class="no-print cat-row">
      <h1>Verified roster</h1>
      <button class="cat-btn cat-btn-primary" onclick="window.print()">Print (${results.length})</button>
    </div>
    <p class="cat-muted no-print">All payment-verified participants — for headcount and printed sign-in reference. Export the same list as CSV from Config &rarr; Exports.</p>
    <div class="cat-table-wrap">
      <table class="cat-table">
        <tr><th>#</th><th>Reg.No</th><th>Name</th><th>School</th><th>Class</th><th>Team</th><th>Checked in</th></tr>
        ${results
          .map(
            (r, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${esc(r.reg_no)}</td>
            <td>${esc(r.name)}</td>
            <td>${esc(r.school)}</td>
            <td>${esc(r.class)}</td>
            <td>${r.team_name ? esc(r.team_name) : "Solo"}</td>
            <td>${r.checked_in ? "✓" : ""}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>
  `;

  const head = `<style>
    @media print {
      body { background: #fff; }
      .cat-table th, .cat-table td { padding: 5px 8px; font-size: 0.8rem; }
    }
  </style>`;

  return htmlResponse(page({ title: "Verified roster — CATALYST Admin", body, head }));
};
