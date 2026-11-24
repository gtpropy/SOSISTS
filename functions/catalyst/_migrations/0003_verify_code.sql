-- CATALYST schema update: a short verification code shown alongside the
-- Reg.No and encoded into the ticket QR, so a ticket can't be impersonated
-- by just knowing someone's Reg.No. Run via:
--   wrangler d1 execute catalyst-db --local  --file=./functions/catalyst/_migrations/0003_verify_code.sql
--   wrangler d1 execute catalyst-db --remote --file=./functions/catalyst/_migrations/0003_verify_code.sql

ALTER TABLE participants ADD COLUMN verify_code TEXT;
