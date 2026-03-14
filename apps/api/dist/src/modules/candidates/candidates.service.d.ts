import { PrismaService } from '../../prisma.service';
import { UpsertCandidateDto } from './dto/upsert-candidate.dto';
export declare class CandidatesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    upsertByUser(userId: string, dto: UpsertCandidateDto): import(".prisma/client").Prisma.Prisma__CandidateProfileClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string;
        cpf: string | null;
        birthDate: Date | null;
        state: string | null;
        city: string | null;
        targetCategory: import(".prisma/client").$Enums.CnhCategory | null;
        learningStage: import(".prisma/client").$Enums.LearningStage | null;
        hasVehicle: boolean;
        preferredLanguage: string | null;
        preferredInstructorGender: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findMe(userId: string): import(".prisma/client").Prisma.Prisma__CandidateProfileClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string;
        cpf: string | null;
        birthDate: Date | null;
        state: string | null;
        city: string | null;
        targetCategory: import(".prisma/client").$Enums.CnhCategory | null;
        learningStage: import(".prisma/client").$Enums.LearningStage | null;
        hasVehicle: boolean;
        preferredLanguage: string | null;
        preferredInstructorGender: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    list(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string;
        cpf: string | null;
        birthDate: Date | null;
        state: string | null;
        city: string | null;
        targetCategory: import(".prisma/client").$Enums.CnhCategory | null;
        learningStage: import(".prisma/client").$Enums.LearningStage | null;
        hasVehicle: boolean;
        preferredLanguage: string | null;
        preferredInstructorGender: string | null;
    }[]>;
}
