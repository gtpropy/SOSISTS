import type { Env, PagesFunction } from "../_lib/env";
import { getParticipantSession, isSameOrigin } from "../_lib/auth";
import { banner, button, esc, htmlResponse, page, redirect } from "../_lib/html";
import { getParticipantById, getTeamMembers } from "../_lib/db";
import { joinTeamByToken, leaveTeam } from "../_lib/team";

async function loadTeam(db: Env["CATALYST_DB"], token: string) {
  return db
    .prepare("SELECT * FROM teams WHERE invite_token = ?1")
    .bind(token)
    .first<{ id: number; name: string; leader_id: number; locked: number }>();
}

export const onRequestGet: PagesFunction<Env, "token"> = async ({ request, env, params }) => {
  const token = String(params.token);
  const team = await loadTeam(env.CATALYST_DB, token);
  if (!team) {
    return htmlResponse(
      page({
        title: "Invite link — CATALYST",
        body: `<div class="card">${banner("This invite link isn't valid anymore. Ask your teammate for a fresh one.")}</div>`,
      }),
      { status: 404 },
    );
  }

  const leader = await getParticipantById(env.CATALYST_DB, team.leader_id);
  const members = await getTeamMembers(env.CATALYST_DB, team.id);
  const session = await getParticipantSession(request, env.SESSION_SECRET);

  const intro = `
    <div class="card" style="text-align:center">
      <h1>Join <span class="doodle-underline">${esc(team.name)}</span></h1>
      <p>Invited by ${esc(leader?.name ?? "a teammate")} &middot; ${members.length}/4 members so far</p>
  `;

  if (!session) {
    return htmlResponse(
      page({
        title: `Join ${team.name} — CATALYST`,
        body:
          intro +
          `<a class="cat-btn cat-btn-primary cat-btn-block" href="/catalyst/signup?invite=${esc(token)}">Join this team</a>
           <p class="cat-muted" style="margin-top:12px">Already registered? <a href="/catalyst/login?invite=${esc(token)}">Log in</a> to join.</p>
         </div>`,
      }),
    );
  }

  const participant = await getParticipantById(env.CATALYST_DB, session.participantId);
  if (!participant) return redirect("/catalyst/login");

  if (participant.team_id === team.id) {
    return redirect("/catalyst/dashboard/team");
  }

  if (team.locked) {
    return htmlResponse(
      page({
        title: `Join ${team.name} — CATALYST`,
        body: intro + banner("Team changes are closed for CATALYST now. Ask an organizer for help.") + "</div>",
      }),
    );
  }

  if (members.length >= 4) {
    return htmlResponse(
      page({ title: `Join ${team.name} — CATALYST`, body: intro + banner("This team is full.") + "</div>" }),
    );
  }

  if (participant.team_id) {
    return htmlResponse(
      page({
        title: `Join ${team.name} — CATALYST`,
        body:
          intro +
          `<p>You're already on another team. Joining this one will remove you from your current team.</p>
           <form method="post" action="/catalyst/join/${esc(token)}">
             <input type="hidden" name="confirm_switch" value="1" />
             ${button("Leave my team and join this one", { type: "submit", variant: "danger" })}
           </form>
           <p style="margin-top:10px"><a href="/catalyst/dashboard/team">Cancel, keep my current team</a></p>
         </div>`,
      }),
    );
  }

  return htmlResponse(
    page({
      title: `Join ${team.name} — CATALYST`,
      body:
        intro +
        `<form method="post" action="/catalyst/join/${esc(token)}">
           ${button("Join this team", { type: "submit" })}
         </form>
       </div>`,
    }),
  );
};

export const onRequestPost: PagesFunction<Env, "token"> = async ({ request, env, params }) => {
  if (!isSameOrigin(request)) return new Response("Bad request", { status: 400 });
  const token = String(params.token);

  const session = await getParticipantSession(request, env.SESSION_SECRET);
  if (!session) return redirect(`/catalyst/login?invite=${encodeURIComponent(token)}`);

  const form = await request.formData();
  if (form.get("confirm_switch") === "1") {
    const leave = await leaveTeam(env.CATALYST_DB, session.participantId);
    if (!leave.ok) {
      return htmlResponse(
        page({ title: "Join team — CATALYST", body: `<div class="card">${banner(leave.error)}</div>` }),
        { status: 400 },
      );
    }
  }

  const result = await joinTeamByToken(env.CATALYST_DB, token, session.participantId);
  if (!result.ok) {
    return htmlResponse(
      page({ title: "Join team — CATALYST", body: `<div class="card">${banner(result.error)}</div>` }),
      { status: 400 },
    );
  }

  return redirect("/catalyst/dashboard/team");
};
