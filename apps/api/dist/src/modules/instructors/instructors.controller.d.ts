import { SearchInstructorDto } from './dto/search-instructor.dto';
import { UpsertInstructorDto } from './dto/upsert-instructor.dto';
import { InstructorsService } from './instructors.service';
export declare class InstructorsController {
    private readonly instructorsService;
    constructor(instructorsService: InstructorsService);
    upsertMe(userId: string, dto: UpsertInstructorDto): import(".prisma/client").Prisma.Prisma__InstructorProfileClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        state: string;
        city: string;
        userId: string;
        instructorType: import(".prisma/client").$Enums.InstructorType;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        bio: string;
        yearsExperience: number;
        serviceRadiusKm: number;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
        categories: import(".prisma/client").$Enums.CnhCategory[];
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    me(userId: string): import(".prisma/client").Prisma.Prisma__InstructorProfileClient<({
        user: {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            refreshTokenHash: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        vehicles: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
            instructorProfileId: string | null;
            schoolId: string | null;
            plate: string;
            brand: string;
            model: string;
            year: number;
            transmissionType: import(".prisma/client").$Enums.TransmissionType;
            categorySupported: import(".prisma/client").$Enums.CnhCategory;
        }[];
        availabilitySlots: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            instructorProfileId: string;
            weekday: number;
            startTime: string;
            endTime: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        state: string;
        city: string;
        userId: string;
        instructorType: import(".prisma/client").$Enums.InstructorType;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        bio: string;
        yearsExperience: number;
        serviceRadiusKm: number;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
        categories: import(".prisma/client").$Enums.CnhCategory[];
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    search(query: SearchInstructorDto): Promise<{
        id: string;
        fullName: string;
        city: string;
        state: string;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        rating: number;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        instructorType: import(".prisma/client").$Enums.InstructorType;
        categories: import(".prisma/client").$Enums.CnhCategory[];
        hasAvailability: boolean;
        score: number;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__InstructorProfileClient<({
        user: {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            refreshTokenHash: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        reviews: {
            id: string;
            createdAt: Date;
            bookingId: string;
            candidateProfileId: string;
            instructorProfileId: string;
            punctuality: number;
            didactics: number;
            professionalism: number;
            safety: number;
            examReadiness: number;
            comment: string | null;
        }[];
        schoolLinks: ({
            school: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                state: string;
                city: string;
                verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
                legalName: string;
                tradeName: string;
                cnpj: string;
                address: string;
                managerUserId: string | null;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.LinkStatus;
            createdAt: Date;
            instructorProfileId: string;
            schoolId: string;
        })[];
        vehicles: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
            instructorProfileId: string | null;
            schoolId: string | null;
            plate: string;
            brand: string;
            model: string;
            year: number;
            transmissionType: import(".prisma/client").$Enums.TransmissionType;
            categorySupported: import(".prisma/client").$Enums.CnhCategory;
        }[];
        availabilitySlots: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            instructorProfileId: string;
            weekday: number;
            startTime: string;
            endTime: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        state: string;
        city: string;
        userId: string;
        instructorType: import(".prisma/client").$Enums.InstructorType;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        bio: string;
        yearsExperience: number;
        serviceRadiusKm: number;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
        categories: import(".prisma/client").$Enums.CnhCategory[];
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    list(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            refreshTokenHash: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        state: string;
        city: string;
        userId: string;
        instructorType: import(".prisma/client").$Enums.InstructorType;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        bio: string;
        yearsExperience: number;
        serviceRadiusKm: number;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
        categories: import(".prisma/client").$Enums.CnhCategory[];
    })[]>;
}
