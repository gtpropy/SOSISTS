import QRCode from "qrcode";
import type { Env, PagesFunction } from "../_lib/env";
import { deriveStatus, getTeamById, type ParticipantRow } from "../_lib/db";
import { esc, htmlResponse, page } from "../_lib/html";

export const onRequestGet: PagesFunction<Env> = async ({ env, data }) => {
  const participant = data.participant as ParticipantRow;
  const status = await deriveStatus(env.CATALYST_DB, participant);

  if (status !== "confirmed" && status !== "checked_in") {
    return htmlResponse(
      page({
        title: "Ticket — CATALYST",
        body: `<div class="card" style="text-align:center">
          <h1>Not ready yet</h1>
          <p>Your ticket unlocks once your payment is verified.</p>
          <a class="cat-btn cat-btn-primary cat-btn-block" href="/catalyst/dashboard/pay">Go to payment</a>
        </div>`,
      }),
    );
  }

  const team = participant.team_id ? await getTeamById(env.CATALYST_DB, participant.team_id) : null;
  const qrSvg = await QRCode.toString(participant.reg_no, { type: "svg", margin: 1, width: 240 });

  const body = `
    <div class="card" style="text-align:center" id="ticket">
      <span class="cat-pill cat-pill-good">CATALYST Ticket</span>
      <h1 style="margin-top:10px">${esc(participant.name)}</h1>
      <p class="cat-muted">${esc(participant.school)} &middot; Class ${esc(participant.class)}</p>
      <div style="margin:16px auto;max-width:240px">${qrSvg}</div>
      <p class="cat-regno" style="font-size:2rem">${esc(participant.reg_no)}</p>
      ${team ? `<p>Team: <strong>${esc(team.name)}</strong></p>` : "<p>Solo participant</p>"}
    </div>
    <button class="cat-btn cat-btn-ghost cat-btn-block no-print" onclick="window.print()">Download / print ticket</button>
    <p style="text-align:center" class="no-print"><a href="/catalyst/dashboard">&larr; Back to dashboard</a></p>
  `;

  return htmlResponse(page({ title: "Your ticket — CATALYST", body }));
};
