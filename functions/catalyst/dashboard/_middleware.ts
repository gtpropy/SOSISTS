import type { Env, PagesFunction } from "../_lib/env";
import { getParticipantSession } from "../_lib/auth";
import { getParticipantById } from "../_lib/db";
import { redirect } from "../_lib/html";

// Guards every route under /catalyst/dashboard/*. On success it stashes the
// loaded participant row on context.data so handlers don't each re-query it.
export const onRequest: PagesFunction<Env> = async ({ request, env, next, data }) => {
  const session = await getParticipantSession(request, env.SESSION_SECRET);
  if (!session) return redirect("/catalyst/login");

  const participant = await getParticipantById(env.CATALYST_DB, session.participantId);
  if (!participant) return redirect("/catalyst/login");

  data.participant = participant;
  return next();
};
