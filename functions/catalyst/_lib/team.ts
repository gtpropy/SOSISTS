import type { D1Database } from "./env";
import { generateTeamCode, randomToken } from "./regno";
import { getParticipantById, getTeamById, getTeamMembers } from "./db";

export const MAX_TEAM_SIZE = 4;

export type TeamOpResult = { ok: true } | { ok: false; error: string };

export async function createTeam(
  db: D1Database,
  leaderId: number,
  name: string,
): Promise<TeamOpResult & { teamId?: number }> {
  const leader = await getParticipantById(db, leaderId);
  if (!leader) return { ok: false, error: "Account not found." };
  if (leader.team_id) return { ok: false, error: "You're already in a team." };

  const existingName = await db.prepare("SELECT id FROM teams WHERE name = ?1").bind(name).first();
  if (existingName) return { ok: false, error: "That team name is taken — try another." };

  const code = await generateTeamCode(db);
  const token = randomToken();

  const insert = await db
    .prepare("INSERT INTO teams (name, code, invite_token, leader_id) VALUES (?1, ?2, ?3, ?4)")
    .bind(name, code, token, leaderId)
    .run();
  const teamId = insert.meta.last_row_id;
  if (!teamId) return { ok: false, error: "Could not create the team. Please try again." };

  await db
    .prepare("UPDATE participants SET team_id = ?1, solo_mode = 'none' WHERE id = ?2")
    .bind(teamId, leaderId)
    .run();

  return { ok: true, teamId };
}

export async function joinTeamByToken(
  db: D1Database,
  token: string,
  participantId: number,
): Promise<TeamOpResult> {
  const team = await db.prepare("SELECT * FROM teams WHERE invite_token = ?1").bind(token).first<{
    id: number;
    locked: number;
  }>();
  return joinTeamCore(db, team, participantId, "That invite link isn't valid anymore.");
}

export async function joinTeamByCode(
  db: D1Database,
  code: string,
  participantId: number,
): Promise<TeamOpResult> {
  const team = await db
    .prepare("SELECT * FROM teams WHERE code = ?1")
    .bind(code.trim().toUpperCase())
    .first<{ id: number; locked: number }>();
  return joinTeamCore(db, team, participantId, "No team found with that code.");
}

async function joinTeamCore(
  db: D1Database,
  team: { id: number; locked: number } | null,
  participantId: number,
  notFoundMessage: string,
): Promise<TeamOpResult> {
  if (!team) return { ok: false, error: notFoundMessage };
  if (team.locked) return { ok: false, error: "Team changes are closed — ask an organizer for help." };

  const participant = await getParticipantById(db, participantId);
  if (!participant) return { ok: false, error: "Account not found." };
  if (participant.team_id === team.id) return { ok: false, error: "You're already on this team." };

  const members = await getTeamMembers(db, team.id);
  if (members.length >= MAX_TEAM_SIZE) return { ok: false, error: "This team is full." };

  await db
    .prepare("UPDATE participants SET team_id = ?1, solo_mode = 'none' WHERE id = ?2")
    .bind(team.id, participantId)
    .run();

  return { ok: true };
}

export async function leaveTeam(db: D1Database, participantId: number): Promise<TeamOpResult> {
  const participant = await getParticipantById(db, participantId);
  if (!participant?.team_id) return { ok: false, error: "You're not in a team." };

  const team = await getTeamById(db, participant.team_id);
  if (!team) return { ok: false, error: "Team not found." };
  if (team.locked) return { ok: false, error: "Team changes are closed — ask an organizer for help." };

  const members = await getTeamMembers(db, team.id);

  if (team.leader_id === participantId) {
    const others = members.filter((m) => m.id !== participantId);
    if (others.length === 0) {
      // Last person leaving a team they lead: delete the team.
      await db.prepare("UPDATE participants SET team_id = NULL WHERE id = ?1").bind(participantId).run();
      await db.prepare("DELETE FROM teams WHERE id = ?1").bind(team.id).run();
      return { ok: true };
    }
    return {
      ok: false,
      error: "Pass leadership to another member before you leave (use 'Make leader' next to their name).",
    };
  }

  await db.prepare("UPDATE participants SET team_id = NULL WHERE id = ?1").bind(participantId).run();
  return { ok: true };
}

export async function removeMember(
  db: D1Database,
  leaderId: number,
  memberId: number,
): Promise<TeamOpResult> {
  const leader = await getParticipantById(db, leaderId);
  if (!leader?.team_id) return { ok: false, error: "Team not found." };
  const team = await getTeamById(db, leader.team_id);
  if (!team || team.leader_id !== leaderId) return { ok: false, error: "Only the team leader can do that." };
  if (team.locked) return { ok: false, error: "Team changes are closed — ask an organizer for help." };
  if (memberId === leaderId) return { ok: false, error: "Use 'Leave' instead of removing yourself." };

  const member = await getParticipantById(db, memberId);
  if (!member || member.team_id !== team.id) return { ok: false, error: "That person isn't on your team." };

  await db.prepare("UPDATE participants SET team_id = NULL WHERE id = ?1").bind(memberId).run();
  return { ok: true };
}

export async function transferLeadership(
  db: D1Database,
  leaderId: number,
  newLeaderId: number,
): Promise<TeamOpResult> {
  const leader = await getParticipantById(db, leaderId);
  if (!leader?.team_id) return { ok: false, error: "Team not found." };
  const team = await getTeamById(db, leader.team_id);
  if (!team || team.leader_id !== leaderId) return { ok: false, error: "Only the team leader can do that." };

  const newLeader = await getParticipantById(db, newLeaderId);
  if (!newLeader || newLeader.team_id !== team.id) return { ok: false, error: "That person isn't on your team." };

  await db.prepare("UPDATE teams SET leader_id = ?1 WHERE id = ?2").bind(newLeaderId, team.id).run();
  return { ok: true };
}

export async function regenerateInvite(db: D1Database, leaderId: number): Promise<TeamOpResult & { token?: string }> {
  const leader = await getParticipantById(db, leaderId);
  if (!leader?.team_id) return { ok: false, error: "Team not found." };
  const team = await getTeamById(db, leader.team_id);
  if (!team || team.leader_id !== leaderId) return { ok: false, error: "Only the team leader can do that." };

  const token = randomToken();
  await db.prepare("UPDATE teams SET invite_token = ?1 WHERE id = ?2").bind(token, team.id).run();
  return { ok: true, token };
}

export async function setSoloMode(
  db: D1Database,
  participantId: number,
  mode: "own" | "match",
): Promise<TeamOpResult> {
  const participant = await getParticipantById(db, participantId);
  if (!participant) return { ok: false, error: "Account not found." };
  if (participant.team_id) return { ok: false, error: "Leave your current team first." };

  await db.prepare("UPDATE participants SET solo_mode = ?1 WHERE id = ?2").bind(mode, participantId).run();
  return { ok: true };
}
