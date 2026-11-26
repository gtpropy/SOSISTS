-- CATALYST schema update: proof of eligibility uploaded during the
-- application step — a student ID card for Class 10/11/12, or a Class 12
-- pass certificate for gap-year participants (who have no current ID).
-- Run via:
--   wrangler d1 execute catalyst-db --local  --file=./functions/catalyst/_migrations/0006_eligibility_doc.sql
--   wrangler d1 execute catalyst-db --remote --file=./functions/catalyst/_migrations/0006_eligibility_doc.sql

ALTER TABLE participants ADD COLUMN eligibility_doc_key TEXT;
