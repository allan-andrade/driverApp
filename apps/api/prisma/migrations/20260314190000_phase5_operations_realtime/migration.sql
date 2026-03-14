-- CreateEnum
CREATE TYPE "PaymentAttemptStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentSplitStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "RecipientType" AS ENUM ('PLATFORM', 'INSTRUCTOR', 'SCHOOL');

-- CreateEnum
CREATE TYPE "ChatMessageType" AS ENUM ('TEXT', 'SYSTEM', 'BOOKING_UPDATE');

-- CreateEnum
CREATE TYPE "LessonLocationEventType" AS ENUM ('CHECK_IN', 'START', 'FINISH', 'MANUAL_MARK');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('BOOKING_REMINDER', 'LESSON_REMINDER', 'PAYMENT_CONFIRMATION', 'DOCUMENT_REMINDER');

-- CreateEnum
CREATE TYPE "ReminderChannel" AS ENUM ('IN_APP', 'EMAIL', 'SMS', 'PUSH');

-- CreateEnum
CREATE TYPE "FraudSignalType" AS ENUM ('MULTIPLE_CANCELS', 'HIGH_RISK_PAYMENT', 'DEVICE_MISMATCH', 'GEO_MISMATCH', 'DUPLICATE_ACCOUNT', 'ABNORMAL_BOOKING_PATTERN', 'OTHER');

-- CreateEnum
CREATE TYPE "FraudSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "WebhookProvider" AS ENUM ('STRIPE', 'PAGARME', 'ASAAS');

-- AlterEnum
ALTER TYPE "EntityType" ADD VALUE 'PAYMENT_ATTEMPT';
ALTER TYPE "EntityType" ADD VALUE 'PAYMENT_SPLIT';
ALTER TYPE "EntityType" ADD VALUE 'CHAT_CONVERSATION';
ALTER TYPE "EntityType" ADD VALUE 'CHAT_MESSAGE';
ALTER TYPE "EntityType" ADD VALUE 'LESSON_LOCATION_EVENT';
ALTER TYPE "EntityType" ADD VALUE 'REMINDER_JOB_LOG';
ALTER TYPE "EntityType" ADD VALUE 'FRAUD_SIGNAL';
ALTER TYPE "EntityType" ADD VALUE 'WEBHOOK_EVENT';

-- CreateTable
CREATE TABLE "PaymentAttempt" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "provider" "WebhookProvider" NOT NULL,
    "providerReference" TEXT,
    "status" "PaymentAttemptStatus" NOT NULL DEFAULT 'PENDING',
    "requestJson" JSONB,
    "responseJson" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentSplit" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "recipientType" "RecipientType" NOT NULL,
    "recipientId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "feeAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "PaymentSplitStatus" NOT NULL DEFAULT 'PENDING',
    "providerReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentSplit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatConversation" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT,
    "candidateProfileId" TEXT,
    "instructorProfileId" TEXT,
    "schoolId" TEXT,
    "lastMessageAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderUserId" TEXT NOT NULL,
    "type" "ChatMessageType" NOT NULL DEFAULT 'TEXT',
    "content" TEXT NOT NULL,
    "metadataJson" JSONB,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonLocationEvent" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "eventType" "LessonLocationEventType" NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "address" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonLocationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReminderJobLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "bookingId" TEXT,
    "lessonId" TEXT,
    "type" "ReminderType" NOT NULL,
    "channel" "ReminderChannel" NOT NULL,
    "status" TEXT NOT NULL,
    "payloadJson" JSONB,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReminderJobLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraudSignal" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "paymentId" TEXT,
    "bookingId" TEXT,
    "lessonId" TEXT,
    "signalType" "FraudSignalType" NOT NULL,
    "severity" "FraudSeverity" NOT NULL,
    "score" INTEGER NOT NULL,
    "description" TEXT,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FraudSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" "WebhookProvider" NOT NULL,
    "eventType" TEXT NOT NULL,
    "providerReference" TEXT,
    "payloadJson" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentAttempt_paymentId_createdAt_idx" ON "PaymentAttempt"("paymentId", "createdAt");

-- CreateIndex
CREATE INDEX "PaymentAttempt_provider_providerReference_idx" ON "PaymentAttempt"("provider", "providerReference");

-- CreateIndex
CREATE INDEX "PaymentSplit_paymentId_idx" ON "PaymentSplit"("paymentId");

-- CreateIndex
CREATE INDEX "PaymentSplit_recipientType_recipientId_idx" ON "PaymentSplit"("recipientType", "recipientId");

-- CreateIndex
CREATE INDEX "PaymentSplit_status_createdAt_idx" ON "PaymentSplit"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ChatConversation_bookingId_idx" ON "ChatConversation"("bookingId");

-- CreateIndex
CREATE INDEX "ChatConversation_candidateProfileId_instructorProfileId_idx" ON "ChatConversation"("candidateProfileId", "instructorProfileId");

-- CreateIndex
CREATE INDEX "ChatMessage_conversationId_createdAt_idx" ON "ChatMessage"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "ChatMessage_senderUserId_createdAt_idx" ON "ChatMessage"("senderUserId", "createdAt");

-- CreateIndex
CREATE INDEX "LessonLocationEvent_lessonId_recordedAt_idx" ON "LessonLocationEvent"("lessonId", "recordedAt");

-- CreateIndex
CREATE INDEX "ReminderJobLog_type_channel_createdAt_idx" ON "ReminderJobLog"("type", "channel", "createdAt");

-- CreateIndex
CREATE INDEX "ReminderJobLog_bookingId_lessonId_idx" ON "ReminderJobLog"("bookingId", "lessonId");

-- CreateIndex
CREATE INDEX "FraudSignal_signalType_severity_createdAt_idx" ON "FraudSignal"("signalType", "severity", "createdAt");

-- CreateIndex
CREATE INDEX "FraudSignal_paymentId_bookingId_lessonId_idx" ON "FraudSignal"("paymentId", "bookingId", "lessonId");

-- CreateIndex
CREATE INDEX "WebhookEvent_provider_createdAt_idx" ON "WebhookEvent"("provider", "createdAt");

-- CreateIndex
CREATE INDEX "WebhookEvent_provider_providerReference_idx" ON "WebhookEvent"("provider", "providerReference");

-- CreateIndex
CREATE INDEX "WebhookEvent_processed_createdAt_idx" ON "WebhookEvent"("processed", "createdAt");

-- AddForeignKey
ALTER TABLE "PaymentAttempt" ADD CONSTRAINT "PaymentAttempt_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSplit" ADD CONSTRAINT "PaymentSplit_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatConversation" ADD CONSTRAINT "ChatConversation_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatConversation" ADD CONSTRAINT "ChatConversation_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatConversation" ADD CONSTRAINT "ChatConversation_instructorProfileId_fkey" FOREIGN KEY ("instructorProfileId") REFERENCES "InstructorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatConversation" ADD CONSTRAINT "ChatConversation_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ChatConversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLocationEvent" ADD CONSTRAINT "LessonLocationEvent_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderJobLog" ADD CONSTRAINT "ReminderJobLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderJobLog" ADD CONSTRAINT "ReminderJobLog_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderJobLog" ADD CONSTRAINT "ReminderJobLog_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudSignal" ADD CONSTRAINT "FraudSignal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudSignal" ADD CONSTRAINT "FraudSignal_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudSignal" ADD CONSTRAINT "FraudSignal_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudSignal" ADD CONSTRAINT "FraudSignal_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
