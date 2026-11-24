import QRCode from "qrcode";
import type { Env, PagesFunction } from "../_lib/env";
import { deriveStatus, getTeamById, type ParticipantRow } from "../_lib/db";
import { generateVerifyCode } from "../_lib/regno";
import { esc, htmlResponse, page } from "../_lib/html";

export const onRequestGet: PagesFunction<Env> = async ({ env, data }) => {
  const participant = data.participant as ParticipantRow;
  const status = await deriveStatus(env.CATALYST_DB, participant);

  // Accounts created before verification codes existed won't have one yet.
  let verifyCode = participant.verify_code;
  if (!verifyCode) {
    verifyCode = await generateVerifyCode(env.CATALYST_DB);
    await env.CATALYST_DB.prepare("UPDATE participants SET verify_code = ?1 WHERE id = ?2").bind(verifyCode, participant.id).run();
  }

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
  const qrPayload = `${participant.reg_no}:${verifyCode}`;
  const qrSvg = await QRCode.toString(qrPayload, { type: "svg", margin: 1, width: 240 });

  const body = `
    <div class="card cat-ticket" id="ticket">
      <span class="cat-pill cat-pill-good">CATALYST Ticket</span>
      <h1 style="margin-top:10px">${esc(participant.name)}</h1>
      <p class="cat-muted">${esc(participant.school)} &middot; Class ${esc(participant.class)}</p>
      <p>Team: <strong>${team ? esc(team.name) : "Solo participant"}</strong></p>
      <div style="margin:16px auto;max-width:240px">${qrSvg}</div>
      <p class="cat-regno" style="font-size:2rem">${esc(participant.reg_no)}</p>
      <p class="cat-muted">Verification No. <strong style="color:var(--ink);letter-spacing:0.05em">${esc(verifyCode)}</strong></p>
    </div>
    <button class="cat-btn cat-btn-ghost cat-btn-block no-print" onclick="window.print()">Download / print ticket</button>
    <p class="cat-muted no-print" style="text-align:center">On your phone, "Print" lets you save this as a PDF, or just take a screenshot — a volunteer can scan either off your screen.</p>
    <p style="text-align:center" class="no-print"><a href="/catalyst/dashboard">&larr; Back to dashboard</a></p>
  `;

  const head = `<style>
    @media print {
      .cat-ticket { width: 85.6mm; margin: 20mm auto; }
    }
  </style>`;

  return htmlResponse(page({ title: "Your ticket — CATALYST", body, head }));
};
