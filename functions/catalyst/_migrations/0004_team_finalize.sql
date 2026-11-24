-- CATALYST schema update: lets a team leader explicitly confirm "these are
-- all my members" once everyone on the team has finished their own
-- registration (profile + application) — distinct from the admin-only
-- global team lock. Run via:
--   wrangler d1 execute catalyst-db --local  --file=./functions/catalyst/_migrations/0004_team_finalize.sql
--   wrangler d1 execute catalyst-db --remote --file=./functions/catalyst/_migrations/0004_team_finalize.sql

ALTER TABLE teams ADD COLUMN finalized_at TEXT;
