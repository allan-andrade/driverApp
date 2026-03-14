import { CnhCategory, LearningStage } from '@prisma/client';
export declare class UpsertCandidateDto {
    fullName: string;
    cpf: string;
    birthDate: string;
    state: string;
    city: string;
    targetCategory: CnhCategory;
    learningStage: LearningStage;
    hasVehicle: boolean;
    preferredLanguage?: string;
    preferredInstructorGender?: string;
}
