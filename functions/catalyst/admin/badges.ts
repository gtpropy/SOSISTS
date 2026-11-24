import QRCode from "qrcode";
import type { Env, PagesFunction } from "../_lib/env";
import { esc, htmlResponse, page } from "../_lib/html";

interface Row {
  reg_no: string;
  name: string;
  school: string;
  team_name: string | null;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.CATALYST_DB
    .prepare(
      `SELECT p.reg_no, p.name, p.school, t.name as team_name
       FROM participants p
       LEFT JOIN teams t ON t.id = p.team_id
       JOIN payments pay ON pay.participant_id = p.id AND pay.status = 'verified'
       WHERE p.removed_at IS NULL
       GROUP BY p.id
       ORDER BY t.name, p.name`,
    )
    .all<Row>();

  const badges = await Promise.all(
    results.map(async (r) => {
      const qr = await QRCode.toString(r.reg_no, { type: "svg", margin: 0, width: 90 });
      return `
        <div class="badge">
          <div class="badge-qr">${qr}</div>
          <div class="badge-info">
            <div class="badge-name">${esc(r.name)}</div>
            <div class="badge-team">${esc(r.team_name ?? "Solo")}</div>
            <div class="badge-school">${esc(r.school)}</div>
            <div class="badge-reg">${esc(r.reg_no)}</div>
          </div>
          <div class="badge-footer">CATALYST &middot; Supported by UNDP</div>
        </div>`;
    }),
  );

  const body = `
    <div class="no-print cat-row">
      <h1>Badges</h1>
      <button class="cat-btn cat-btn-primary" onclick="window.print()">Print all (${results.length})</button>
    </div>
    <div class="badge-sheet">${badges.join("")}</div>
  `;

  const head = `<style>
    .badge-sheet { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .badge { border: 1.5px dashed var(--border-strong); border-radius: 10px; padding: 12px; display: flex; gap: 10px; align-items: center; page-break-inside: avoid; }
    .badge-qr { flex-shrink: 0; }
    .badge-name { font-weight: 700; }
    .badge-team, .badge-school { font-size: 0.8rem; color: var(--ink-soft); }
    .badge-reg { font-family: var(--font-display); color: var(--amber); font-size: 1.1rem; }
    .badge-footer { display:none; }
    @media print {
      .badge-sheet { grid-template-columns: repeat(2, 1fr); }
      .badge-footer { display:block; font-size: 0.6rem; color: var(--ink-faint); margin-top: 4px; }
    }
  </style>`;

  return htmlResponse(page({ title: "Badges — CATALYST Admin", body, head }));
};
