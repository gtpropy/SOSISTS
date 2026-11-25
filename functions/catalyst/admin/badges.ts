import QRCode from "qrcode";
import type { Env, PagesFunction } from "../_lib/env";
import { type AdminSession } from "../_lib/auth";
import { adminPage, esc, htmlResponse } from "../_lib/html";

interface Row {
  reg_no: string;
  verify_code: string | null;
  name: string;
  school: string;
  team_name: string | null;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, data }) => {
  const admin = data.admin as AdminSession;
  const { results } = await env.CATALYST_DB
    .prepare(
      `SELECT p.reg_no, p.verify_code, p.name, p.school, t.name as team_name
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
      const qr = await QRCode.toString(`${r.reg_no}:${r.verify_code ?? ""}`, { type: "svg", margin: 0, width: 90 });
      return `
        <div class="badge">
          <div class="badge-qr">${qr}</div>
          <div class="badge-info">
            <div class="badge-name">${esc(r.name)}</div>
            <div class="badge-team">${esc(r.team_name ?? "Solo")}</div>
            <div class="badge-school">${esc(r.school)}</div>
            <div class="badge-reg">${esc(r.reg_no)}</div>
            ${r.verify_code ? `<div class="badge-verify">Verify: ${esc(r.verify_code)}</div>` : ""}
          </div>
          <div class="badge-footer">CATALYST &middot; Supported by BPC</div>
        </div>`;
    }),
  );

  const body = `
    <div class="no-print cat-row">
      <h1>ID card sheet</h1>
      <button class="cat-btn cat-btn-primary" onclick="window.print()">Print all (${results.length})</button>
    </div>
    <p class="cat-muted no-print">Each card is a standard ID-card size (85.6 &times; 54mm) &mdash; print at 100% scale ("Actual size", not "Fit to page"), cut along the dashed lines, and it'll slot straight into a standard card holder.</p>
    <div class="badge-sheet">${badges.join("")}</div>
  `;

  const head = `<style>
    .badge-sheet { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .badge {
      border: 1.5px dashed var(--border-strong); border-radius: 10px; padding: 10px;
      display: flex; gap: 8px; align-items: center; page-break-inside: avoid;
      width: 85.6mm; height: 54mm; box-sizing: border-box; overflow: hidden;
    }
    .badge-qr { flex-shrink: 0; }
    .badge-qr svg { display: block; }
    .badge-info { min-width: 0; }
    .badge-name { font-weight: 700; font-size: 0.95rem; }
    .badge-team, .badge-school { font-size: 0.74rem; color: var(--ink-soft); }
    .badge-reg { font-family: var(--font-display); color: var(--amber); font-size: 1.1rem; }
    .badge-verify { font-size: 0.68rem; color: var(--ink-faint); letter-spacing: 0.04em; }
    .badge-footer { display:none; }
    @media print {
      @page { size: A4; margin: 10mm; }
      .badge-sheet { grid-template-columns: repeat(2, 85.6mm); grid-auto-rows: 54mm; justify-content: center; gap: 4mm; }
      .badge-footer { display:block; font-size: 0.55rem; color: var(--ink-faint); margin-top: 2px; }
    }
  </style>`;

  return htmlResponse(adminPage({ title: "ID card sheet — CATALYST Admin", body, head, path: new URL(request.url).pathname, role: admin.role }));
};
