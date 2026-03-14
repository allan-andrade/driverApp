import { VerificationStatus } from '@prisma/client';
export declare class UpsertSchoolDto {
    legalName: string;
    tradeName: string;
    cnpj: string;
    verificationStatus?: VerificationStatus;
    address?: string;
    city?: string;
    state?: string;
}
