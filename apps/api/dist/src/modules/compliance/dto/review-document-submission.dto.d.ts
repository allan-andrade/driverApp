import { VerificationStatus } from '@prisma/client';
export declare class ReviewDocumentSubmissionDto {
    verificationStatus: VerificationStatus;
    notes?: string;
}
