import { InstructorsService } from '../instructors/instructors.service';
import { SchoolsService } from '../schools/schools.service';
import { UsersService } from '../users/users.service';
export declare class AdminController {
    private readonly usersService;
    private readonly instructorsService;
    private readonly schoolsService;
    constructor(usersService: UsersService, instructorsService: InstructorsService, schoolsService: SchoolsService);
    users(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.UserStatus;
        email: string;
        phone: string | null;
        passwordHash: string;
        role: import(".prisma/client").$Enums.UserRole;
        refreshTokenHash: string | null;
    }[]>;
    instructors(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.UserStatus;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            refreshTokenHash: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        state: string | null;
        city: string | null;
        instructorType: import(".prisma/client").$Enums.InstructorType;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        bio: string | null;
        yearsExperience: number | null;
        serviceRadiusKm: number | null;
        basePrice: import("@prisma/client/runtime/library").Decimal | null;
        isActive: boolean;
        categories: import(".prisma/client").$Enums.CnhCategory[];
    })[]>;
    schools(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        state: string | null;
        city: string | null;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        cnpj: string;
        managerUserId: string | null;
        legalName: string;
        tradeName: string;
        address: string | null;
    }[]>;
}
