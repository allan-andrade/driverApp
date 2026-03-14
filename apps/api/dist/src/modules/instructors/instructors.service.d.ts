import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { SearchInstructorDto } from './dto/search-instructor.dto';
import { UpsertInstructorDto } from './dto/upsert-instructor.dto';
export declare class InstructorsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    upsertByUser(userId: string, dto: UpsertInstructorDto): Prisma.Prisma__InstructorProfileClient<{
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
        basePrice: Prisma.Decimal | null;
        isActive: boolean;
        categories: import(".prisma/client").$Enums.CnhCategory[];
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findMe(userId: string): Prisma.Prisma__InstructorProfileClient<({
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
        vehicles: {
            id: string;
            instructorProfileId: string | null;
            schoolId: string | null;
            createdAt: Date;
            updatedAt: Date;
            verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
            plate: string;
            brand: string;
            model: string;
            year: number;
            transmissionType: import(".prisma/client").$Enums.TransmissionType;
            categorySupported: import(".prisma/client").$Enums.CnhCategory;
        }[];
        availabilitySlots: {
            id: string;
            instructorProfileId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            weekday: number;
            startTime: string;
            endTime: string;
        }[];
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
        basePrice: Prisma.Decimal | null;
        isActive: boolean;
        categories: import(".prisma/client").$Enums.CnhCategory[];
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    publicSearch(filters: SearchInstructorDto): Promise<{
        id: string;
        fullName: string;
        city: string | null;
        state: string | null;
        basePrice: Prisma.Decimal | null;
        rating: number;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        instructorType: import(".prisma/client").$Enums.InstructorType;
        categories: import(".prisma/client").$Enums.CnhCategory[];
        hasAvailability: boolean;
        score: number;
    }[]>;
    findOne(id: string): Prisma.Prisma__InstructorProfileClient<({
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
        reviews: {
            id: string;
            instructorProfileId: string;
            createdAt: Date;
            candidateProfileId: string;
            bookingId: string;
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
                state: string | null;
                city: string | null;
                verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
                cnpj: string;
                managerUserId: string | null;
                legalName: string;
                tradeName: string;
                address: string | null;
            };
        } & {
            id: string;
            instructorProfileId: string;
            schoolId: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.LinkStatus;
        })[];
        vehicles: {
            id: string;
            instructorProfileId: string | null;
            schoolId: string | null;
            createdAt: Date;
            updatedAt: Date;
            verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
            plate: string;
            brand: string;
            model: string;
            year: number;
            transmissionType: import(".prisma/client").$Enums.TransmissionType;
            categorySupported: import(".prisma/client").$Enums.CnhCategory;
        }[];
        availabilitySlots: {
            id: string;
            instructorProfileId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            weekday: number;
            startTime: string;
            endTime: string;
        }[];
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
        basePrice: Prisma.Decimal | null;
        isActive: boolean;
        categories: import(".prisma/client").$Enums.CnhCategory[];
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    listAll(): Prisma.PrismaPromise<({
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
        basePrice: Prisma.Decimal | null;
        isActive: boolean;
        categories: import(".prisma/client").$Enums.CnhCategory[];
    })[]>;
}
