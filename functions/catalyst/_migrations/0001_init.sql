-- CATALYST schema (D1 / SQLite). Run via:
--   wrangler d1 execute catalyst-db --local  --file=./functions/catalyst/_migrations/0001_init.sql
--   wrangler d1 execute catalyst-db --remote --file=./functions/catalyst/_migrations/0001_init.sql

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS participants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reg_no TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  school TEXT NOT NULL,
  class TEXT NOT NULL CHECK (class IN ('10', '11', '12', 'gap')),
  pin_hash TEXT NOT NULL,
  guardian_name TEXT,
  guardian_phone TEXT,
  diet TEXT,
  photo_consent INTEGER NOT NULL DEFAULT 0,
  guardian_permission INTEGER NOT NULL DEFAULT 0,
  rules_agreed_at TEXT,
  team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  solo_mode TEXT NOT NULL DEFAULT 'none' CHECK (solo_mode IN ('own', 'match', 'none')),
  failed_logins INTEGER NOT NULL DEFAULT 0,
  first_failed_at TEXT,
  locked_until TEXT,
  pin_reset_requested INTEGER NOT NULL DEFAULT 0,
  removed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  invite_token TEXT NOT NULL UNIQUE,
  leader_id INTEGER NOT NULL REFERENCES participants(id),
  locked INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id INTEGER NOT NULL REFERENCES participants(id),
  method TEXT NOT NULL CHECK (method IN ('esewa', 'khalti', 'bank', 'cash')),
  amount INTEGER NOT NULL,
  -- Intentionally NOT unique: a leader paying for N teammates in one
  -- transaction legitimately creates N payment rows sharing one
  -- transaction_id. True duplicate/reused transaction IDs (a different
  -- *payer group*) are instead soft-flagged via flag_note for an admin to
  -- review, per the spec's edge-case note — not hard-rejected at the DB.
  transaction_id TEXT,
  payer_phone TEXT,
  screenshot_key TEXT,
  status TEXT NOT NULL DEFAULT 'unpaid' CHECK (
    status IN ('unpaid', 'submitted', 'cash_pending', 'verified', 'rejected', 'refunded')
  ),
  reject_reason TEXT,
  flag_note TEXT,
  paid_for_by_id INTEGER REFERENCES participants(id),
  receipt_no TEXT UNIQUE,
  verified_by INTEGER REFERENCES admins(id),
  verified_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS scans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id INTEGER NOT NULL REFERENCES participants(id),
  kind TEXT NOT NULL CHECK (kind IN ('checkin_d1', 'checkin_d2', 'food_1', 'food_2', 'food_3')),
  scanned_by INTEGER REFERENCES admins(id),
  scanned_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (participant_id, kind)
);

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'volunteer')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id INTEGER REFERENCES admins(id),
  action TEXT NOT NULL,
  target TEXT,
  detail TEXT,
  at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Generic rate limiter: one row per (scope, key), e.g. scope='invite_join',
-- key=<ip address>. Used for actions that aren't tied to a participant row
-- (login attempts use participants.failed_logins/locked_until instead,
-- since those are naturally per-account).
CREATE TABLE IF NOT EXISTS rate_limits (
  scope TEXT NOT NULL,
  key TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  window_start TEXT NOT NULL,
  locked_until TEXT,
  PRIMARY KEY (scope, key)
);

CREATE TABLE IF NOT EXISTS waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_participants_team ON participants(team_id);
CREATE INDEX IF NOT EXISTS idx_payments_participant ON payments(participant_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_txn ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_scans_participant ON scans(participant_id);

-- Seed default config values. Real payment account details are intentionally
-- left blank here — fill them in from /catalyst/admin/config after the
-- organizer logs in, not by editing this file (keeps real account numbers
-- out of version control).
INSERT OR IGNORE INTO config (key, value) VALUES
  ('event_name', 'ISTS CATALYST'),
  ('event_tagline', 'Build Saturday. Show Sunday.'),
  ('day1_date', '2026-12-12'),
  ('day1_label', 'Saturday 12 December 2026 (26 Mangsir 2083)'),
  ('day1_start', '07:30'),
  ('day2_date', '2026-12-13'),
  ('day2_label', 'Sunday 13 December 2026 (27 Mangsir 2083)'),
  ('build_end_time', '20:00'),
  ('registration_deadline', '2026-12-10T23:59:00'),
  ('team_lock_date', '2026-12-10T23:59:00'),
  ('participant_cap', '300'),
  ('fee_amount', '700'),
  ('fee_currency', 'NPR'),
  ('payment_esewa_id', ''),
  ('payment_khalti_id', ''),
  ('payment_bank_name', ''),
  ('payment_bank_account_name', ''),
  ('payment_bank_account_number', ''),
  ('refund_policy_text', 'Refunds are decided case by case by the organizing team. Ask at the registration desk or message ISTSOS.');
