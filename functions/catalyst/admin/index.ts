import type { Env, PagesFunction } from "../_lib/env";
import { htmlResponse, page } from "../_lib/html";
import { getConfig } from "../_lib/config";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const db = env.CATALYST_DB;
  const cfg = await getConfig(db);

  const [registered, confirmed, teams, solos, pendingPayments, verifiedTotal] = await Promise.all([
    db.prepare("SELECT COUNT(*) as n FROM participants WHERE removed_at IS NULL").first<{ n: number }>(),
    db
      .prepare(
        `SELECT COUNT(DISTINCT p.id) as n FROM participants p
         JOIN payments pay ON pay.participant_id = p.id AND pay.status = 'verified'
         WHERE p.removed_at IS NULL`,
      )
      .first<{ n: number }>(),
    db.prepare("SELECT COUNT(*) as n FROM teams").first<{ n: number }>(),
    db
      .prepare("SELECT COUNT(*) as n FROM participants WHERE solo_mode = 'match' AND team_id IS NULL")
      .first<{ n: number }>(),
    db
      .prepare("SELECT COUNT(*) as n FROM payments WHERE status IN ('submitted', 'cash_pending')")
      .first<{ n: number }>(),
    db
      .prepare("SELECT COALESCE(SUM(amount), 0) as n FROM payments WHERE status = 'verified'")
      .first<{ n: number }>(),
  ]);

  const regCount = registered?.n ?? 0;
  const cap = cfg.participant_cap || 1;
  const pct = Math.min(100, Math.round((regCount / cap) * 100));

  const body = `
    <h1>Overview</h1>
    <div class="card">
      <div class="cat-row"><span>Registered</span><strong>${regCount} / ${cfg.participant_cap}</strong></div>
      <div style="background:var(--border);border-radius:999px;height:10px;margin-top:8px;overflow:hidden">
        <div style="background:var(--amber);height:100%;width:${pct}%"></div>
      </div>
    </div>
    <div class="cat-grid-3">
      <div class="card" style="text-align:center"><div style="font-size:1.8rem;font-weight:700">${confirmed?.n ?? 0}</div><div class="cat-muted">Confirmed</div></div>
      <div class="card" style="text-align:center"><div style="font-size:1.8rem;font-weight:700">${teams?.n ?? 0}</div><div class="cat-muted">Teams</div></div>
      <div class="card" style="text-align:center"><div style="font-size:1.8rem;font-weight:700">${solos?.n ?? 0}</div><div class="cat-muted">Unmatched solos</div></div>
      <div class="card" style="text-align:center"><div style="font-size:1.8rem;font-weight:700">${pendingPayments?.n ?? 0}</div><div class="cat-muted">Payments to review</div></div>
      <div class="card" style="text-align:center"><div style="font-size:1.8rem;font-weight:700">${cfg.fee_currency} ${verifiedTotal?.n ?? 0}</div><div class="cat-muted">Verified so far</div></div>
    </div>

    <div class="card">
      <h3>Quick links</h3>
      <div class="cat-grid-3">
        <a class="cat-btn cat-btn-ghost" href="/catalyst/admin/payments">Payments queue</a>
        <a class="cat-btn cat-btn-ghost" href="/catalyst/admin/participants">Participants</a>
        <a class="cat-btn cat-btn-ghost" href="/catalyst/admin/teams">Teams</a>
        <a class="cat-btn cat-btn-ghost" href="/catalyst/admin/solo">Solo matching</a>
        <a class="cat-btn cat-btn-ghost" href="/catalyst/admin/config">Config</a>
        <a class="cat-btn cat-btn-ghost" href="/catalyst/admin/audit">Audit log</a>
        <a class="cat-btn cat-btn-ghost" href="/catalyst/admin/scan">Scanner</a>
        <a class="cat-btn cat-btn-ghost" href="/catalyst/admin/badges">Badges</a>
      </div>
    </div>
  `;

  return htmlResponse(page({ title: "Admin — CATALYST", body }));
};
