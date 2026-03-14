import { PrismaService } from '../../prisma.service';
import { UpsertCandidateDto } from './dto/upsert-candidate.dto';
export declare class CandidatesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    upsertByUser(userId: string, dto: UpsertCandidateDto): import(".prisma/client").Prisma.Prisma__CandidateProfileClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        cpf: string;
        birthDate: Date;
        state: string;
        city: string;
        targetCategory: import(".prisma/client").$Enums.CnhCategory;
        learningStage: import(".prisma/client").$Enums.LearningStage;
        hasVehicle: boolean;
        preferredLanguage: string | null;
        preferredInstructorGender: string | null;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findMe(userId: string): import(".prisma/client").Prisma.Prisma__CandidateProfileClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        cpf: string;
        birthDate: Date;
        state: string;
        city: string;
        targetCategory: import(".prisma/client").$Enums.CnhCategory;
        learningStage: import(".prisma/client").$Enums.LearningStage;
        hasVehicle: boolean;
        preferredLanguage: string | null;
        preferredInstructorGender: string | null;
        userId: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    list(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        cpf: string;
        birthDate: Date;
        state: string;
        city: string;
        targetCategory: import(".prisma/client").$Enums.CnhCategory;
        learningStage: import(".prisma/client").$Enums.LearningStage;
        hasVehicle: boolean;
        preferredLanguage: string | null;
        preferredInstructorGender: string | null;
        userId: string;
    }[]>;
}
