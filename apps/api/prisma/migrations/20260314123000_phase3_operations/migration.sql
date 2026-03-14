-- Enum extensions
ALTER TYPE "VerificationStatus" ADD VALUE IF NOT EXISTS 'VERIFIED';
ALTER TYPE "LessonStatus" ADD VALUE IF NOT EXISTS 'CHECK_IN_PENDING';
ALTER TYPE "LessonStatus" ADD VALUE IF NOT EXISTS 'NO_SHOW';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'CAPTURED';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';
ALTER TYPE "EntityType" ADD VALUE IF NOT EXISTS 'PAYMENT';
ALTER TYPE "EntityType" ADD VALUE IF NOT EXISTS 'PAYOUT';
ALTER TYPE "EntityType" ADD VALUE IF NOT EXISTS 'DISPUTE';
ALTER TYPE "EntityType" ADD VALUE IF NOT EXISTS 'INCIDENT_REPORT';
ALTER TYPE "EntityType" ADD VALUE IF NOT EXISTS 'DOCUMENT_SUBMISSION';

-- New enums
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'CARD', 'CASH', 'MANUAL');
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'SCHEDULED', 'PAID', 'FAILED', 'ON_HOLD');
CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'CANCELLED');
CREATE TYPE "IncidentType" AS ENUM ('SAFETY', 'HARASSMENT', 'NO_SHOW', 'FRAUD', 'VEHICLE_ISSUE', 'OTHER');
CREATE TYPE "IncidentSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- Booking operational metadata
ALTER TABLE "Booking"
ADD COLUMN "cancelReason" TEXT,
ADD COLUMN "rescheduleReason" TEXT;

-- Lesson operational metadata
ALTER TABLE "Lesson"
ADD COLUMN "startAddress" TEXT,
ADD COLUMN "endAddress" TEXT,
ADD COLUMN "notes" TEXT;

-- Payment foundation expansion
ALTER TABLE "Payment"
ADD COLUMN "candidateProfileId" TEXT,
ADD COLUMN "instructorProfileId" TEXT,
ADD COLUMN "schoolId" TEXT,
ADD COLUMN "providerReference" TEXT,
ADD COLUMN "platformFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'BRL',
ADD COLUMN "method" "PaymentMethod" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN "capturedAt" TIMESTAMP(3),
ADD COLUMN "refundedAt" TIMESTAMP(3);

UPDATE "Payment" p
SET
  "candidateProfileId" = b."candidateProfileId",
  "instructorProfileId" = b."instructorProfileId",
  "schoolId" = b."schoolId",
  "platformFee" = b."platformFee"
FROM "Booking" b
WHERE p."bookingId" = b."id";

ALTER TABLE "Payment"
ALTER COLUMN "candidateProfileId" SET NOT NULL;

-- New operational tables
CREATE TABLE "Payout" (
  "id" TEXT NOT NULL,
  "paymentId" TEXT NOT NULL,
  "instructorProfileId" TEXT,
  "schoolId" TEXT,
  "amountNet" DECIMAL(10,2) NOT NULL,
  "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
  "scheduledAt" TIMESTAMP(3),
  "paidAt" TIMESTAMP(3),
  "provider" TEXT,
  "providerReference" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Dispute" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT,
  "lessonId" TEXT,
  "paymentId" TEXT,
  "openedByUserId" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "description" TEXT,
  "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
  "resolution" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "IncidentReport" (
  "id" TEXT NOT NULL,
  "lessonId" TEXT,
  "bookingId" TEXT,
  "reporterUserId" TEXT NOT NULL,
  "reportedUserId" TEXT,
  "type" "IncidentType" NOT NULL,
  "severity" "IncidentSeverity" NOT NULL,
  "description" TEXT NOT NULL,
  "evidenceUrl" TEXT,
  "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "IncidentReport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DocumentSubmission" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "instructorProfileId" TEXT,
  "schoolId" TEXT,
  "stateCode" TEXT NOT NULL,
  "documentType" TEXT NOT NULL,
  "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
  "fileUrl" TEXT NOT NULL,
  "metadataJson" JSONB,
  "reviewedByUserId" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DocumentSubmission_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "Payout_status_idx" ON "Payout"("status");
CREATE INDEX "Dispute_status_idx" ON "Dispute"("status");
CREATE INDEX "IncidentReport_type_severity_idx" ON "IncidentReport"("type", "severity");
CREATE INDEX "DocumentSubmission_stateCode_verificationStatus_idx" ON "DocumentSubmission"("stateCode", "verificationStatus");

-- Foreign keys
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_instructorProfileId_fkey" FOREIGN KEY ("instructorProfileId") REFERENCES "InstructorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Payout" ADD CONSTRAINT "Payout_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_instructorProfileId_fkey" FOREIGN KEY ("instructorProfileId") REFERENCES "InstructorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_openedByUserId_fkey" FOREIGN KEY ("openedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "IncidentReport" ADD CONSTRAINT "IncidentReport_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "IncidentReport" ADD CONSTRAINT "IncidentReport_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "IncidentReport" ADD CONSTRAINT "IncidentReport_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "IncidentReport" ADD CONSTRAINT "IncidentReport_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DocumentSubmission" ADD CONSTRAINT "DocumentSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DocumentSubmission" ADD CONSTRAINT "DocumentSubmission_instructorProfileId_fkey" FOREIGN KEY ("instructorProfileId") REFERENCES "InstructorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DocumentSubmission" ADD CONSTRAINT "DocumentSubmission_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DocumentSubmission" ADD CONSTRAINT "DocumentSubmission_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
