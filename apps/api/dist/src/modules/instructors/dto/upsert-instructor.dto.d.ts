import { CnhCategory, InstructorType, VerificationStatus } from '@prisma/client';
export declare class UpsertInstructorDto {
    instructorType: InstructorType;
    verificationStatus?: VerificationStatus;
    bio: string;
    yearsExperience: number;
    serviceRadiusKm: number;
    basePrice: number;
    isActive: boolean;
    categories: CnhCategory[];
    city: string;
    state: string;
}
