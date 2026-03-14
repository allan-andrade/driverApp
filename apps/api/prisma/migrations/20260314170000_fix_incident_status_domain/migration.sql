DO $$
BEGIN
  CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "IncidentReport"
ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "IncidentReport"
ALTER COLUMN "status" TYPE "IncidentStatus"
USING (
  CASE
    WHEN "status"::text = 'PENDING' THEN 'OPEN'
    WHEN "status"::text = 'VERIFIED' THEN 'RESOLVED'
    WHEN "status"::text = 'APPROVED' THEN 'RESOLVED'
    WHEN "status"::text = 'REJECTED' THEN 'REJECTED'
    ELSE 'OPEN'
  END
)::"IncidentStatus";

ALTER TABLE "IncidentReport"
ALTER COLUMN "status" SET DEFAULT 'OPEN';
