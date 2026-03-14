-- CreateEnum
CREATE TYPE "WalletOwnerType" AS ENUM ('USER', 'INSTRUCTOR', 'SCHOOL');

-- CreateEnum
CREATE TYPE "WalletTransactionType" AS ENUM ('CREDIT', 'DEBIT', 'HOLD', 'RELEASE', 'REFUND', 'PAYOUT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BOOKING_CREATED', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'BOOKING_RESCHEDULED', 'LESSON_REMINDER', 'LESSON_STARTED', 'LESSON_COMPLETED', 'PAYMENT_UPDATED', 'PAYOUT_UPDATED', 'DOCUMENT_REVIEWED', 'INCIDENT_UPDATED', 'DISPUTE_UPDATED', 'SYSTEM');

-- CreateEnum
CREATE TYPE "DocumentReviewDecision" AS ENUM ('APPROVED', 'REJECTED', 'REQUEST_CHANGES');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EntityType" ADD VALUE 'INSTRUCTOR_METRICS';
ALTER TYPE "EntityType" ADD VALUE 'WALLET';
ALTER TYPE "EntityType" ADD VALUE 'WALLET_TRANSACTION';
ALTER TYPE "EntityType" ADD VALUE 'NOTIFICATION';
ALTER TYPE "EntityType" ADD VALUE 'NOTIFICATION_PREFERENCE';
ALTER TYPE "EntityType" ADD VALUE 'DOCUMENT_REVIEW';
ALTER TYPE "EntityType" ADD VALUE 'MATCHING_SNAPSHOT';

-- DropIndex
DROP INDEX "Dispute_status_idx";

-- DropIndex
DROP INDEX "DocumentSubmission_stateCode_verificationStatus_idx";

-- DropIndex
DROP INDEX "IncidentReport_type_severity_idx";

-- DropIndex
DROP INDEX "Payout_status_idx";

-- CreateTable
CREATE TABLE "InstructorMetrics" (
    "id" TEXT NOT NULL,
    "instructorProfileId" TEXT NOT NULL,
    "averageRating" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "punctualityAvg" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "didacticsAvg" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "professionalismAvg" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "safetyAvg" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "examReadinessAvg" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "completedLessons" INTEGER NOT NULL DEFAULT 0,
    "cancelledBookings" INTEGER NOT NULL DEFAULT 0,
    "noShowCount" INTEGER NOT NULL DEFAULT 0,
    "attendanceRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "completionRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "trustScore" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "teachingScore" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "marketplaceScore" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstructorMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "ownerType" "WalletOwnerType" NOT NULL,
    "ownerUserId" TEXT,
    "instructorProfileId" TEXT,
    "schoolId" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "balanceAvailable" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "balancePending" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "balanceOnHold" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "WalletTransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "referenceType" "EntityType" NOT NULL,
    "referenceId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "payloadJson" JSONB,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "bookingUpdates" BOOLEAN NOT NULL DEFAULT true,
    "lessonUpdates" BOOLEAN NOT NULL DEFAULT true,
    "paymentUpdates" BOOLEAN NOT NULL DEFAULT true,
    "safetyAlerts" BOOLEAN NOT NULL DEFAULT true,
    "marketingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentReview" (
    "id" TEXT NOT NULL,
    "documentSubmissionId" TEXT NOT NULL,
    "reviewedByUserId" TEXT NOT NULL,
    "decision" "DocumentReviewDecision" NOT NULL,
    "reason" TEXT,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchingSnapshot" (
    "id" TEXT NOT NULL,
    "candidateProfileId" TEXT,
    "instructorProfileId" TEXT NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "factorsJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchingSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstructorMetrics_instructorProfileId_key" ON "InstructorMetrics"("instructorProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_instructorProfileId_key" ON "Wallet"("instructorProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_schoolId_key" ON "Wallet"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_ownerType_ownerUserId_key" ON "Wallet"("ownerType", "ownerUserId");

-- CreateIndex
CREATE INDEX "WalletTransaction_walletId_createdAt_idx" ON "WalletTransaction"("walletId", "createdAt");

-- CreateIndex
CREATE INDEX "WalletTransaction_referenceType_referenceId_idx" ON "WalletTransaction"("referenceType", "referenceId");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "NotificationPreference"("userId");

-- CreateIndex
CREATE INDEX "DocumentReview_documentSubmissionId_createdAt_idx" ON "DocumentReview"("documentSubmissionId", "createdAt");

-- CreateIndex
CREATE INDEX "MatchingSnapshot_candidateProfileId_createdAt_idx" ON "MatchingSnapshot"("candidateProfileId", "createdAt");

-- CreateIndex
CREATE INDEX "MatchingSnapshot_instructorProfileId_createdAt_idx" ON "MatchingSnapshot"("instructorProfileId", "createdAt");

-- AddForeignKey
ALTER TABLE "InstructorMetrics" ADD CONSTRAINT "InstructorMetrics_instructorProfileId_fkey" FOREIGN KEY ("instructorProfileId") REFERENCES "InstructorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_instructorProfileId_fkey" FOREIGN KEY ("instructorProfileId") REFERENCES "InstructorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentReview" ADD CONSTRAINT "DocumentReview_documentSubmissionId_fkey" FOREIGN KEY ("documentSubmissionId") REFERENCES "DocumentSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentReview" ADD CONSTRAINT "DocumentReview_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchingSnapshot" ADD CONSTRAINT "MatchingSnapshot_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchingSnapshot" ADD CONSTRAINT "MatchingSnapshot_instructorProfileId_fkey" FOREIGN KEY ("instructorProfileId") REFERENCES "InstructorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
