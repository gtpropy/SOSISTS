-- CATALYST schema update: participant email, used to send the
-- payment-verified notification. Run via:
--   wrangler d1 execute catalyst-db --local  --file=./functions/catalyst/_migrations/0005_email.sql
--   wrangler d1 execute catalyst-db --remote --file=./functions/catalyst/_migrations/0005_email.sql

ALTER TABLE participants ADD COLUMN email TEXT;
