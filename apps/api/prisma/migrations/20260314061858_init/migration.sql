-- AlterTable
ALTER TABLE "AuditLog" ALTER COLUMN "metadataJson" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CandidateProfile" ALTER COLUMN "cpf" DROP NOT NULL,
ALTER COLUMN "birthDate" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "targetCategory" DROP NOT NULL,
ALTER COLUMN "learningStage" DROP NOT NULL;

-- AlterTable
ALTER TABLE "InstructorProfile" ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "yearsExperience" DROP NOT NULL,
ALTER COLUMN "yearsExperience" DROP DEFAULT,
ALTER COLUMN "serviceRadiusKm" DROP NOT NULL,
ALTER COLUMN "serviceRadiusKm" DROP DEFAULT,
ALTER COLUMN "basePrice" DROP NOT NULL,
ALTER COLUMN "categories" SET DEFAULT ARRAY[]::"CnhCategory"[],
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL;

-- AlterTable
ALTER TABLE "School" ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "CandidateProfile_state_city_idx" ON "CandidateProfile"("state", "city");

-- CreateIndex
CREATE INDEX "InstructorProfile_verificationStatus_isActive_idx" ON "InstructorProfile"("verificationStatus", "isActive");

-- CreateIndex
CREATE INDEX "InstructorProfile_city_state_idx" ON "InstructorProfile"("city", "state");

-- CreateIndex
CREATE INDEX "School_state_city_idx" ON "School"("state", "city");

-- CreateIndex
CREATE INDEX "StatePolicy_isActive_idx" ON "StatePolicy"("isActive");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");
