-- CATALYST schema update: application essay + CV, used to help organizers
-- choose fairly if registration is oversubscribed. Run via:
--   wrangler d1 execute catalyst-db --local  --file=./functions/catalyst/_migrations/0002_application.sql
--   wrangler d1 execute catalyst-db --remote --file=./functions/catalyst/_migrations/0002_application.sql

ALTER TABLE participants ADD COLUMN why_join TEXT;
ALTER TABLE participants ADD COLUMN cv_key TEXT;
