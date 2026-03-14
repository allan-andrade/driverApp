import { LinkInstructorDto } from './dto/link-instructor.dto';
import { UpsertSchoolDto } from './dto/upsert-school.dto';
import { SchoolsService } from './schools.service';
export declare class SchoolsController {
    private readonly schoolsService;
    constructor(schoolsService: SchoolsService);
    upsert(userId: string, dto: UpsertSchoolDto): import(".prisma/client").Prisma.Prisma__SchoolClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    mySchool(userId: string): import(".prisma/client").Prisma.Prisma__SchoolClient<({
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
        instructorLinks: ({
            instructorProfile: {
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
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.LinkStatus;
            createdAt: Date;
            instructorProfileId: string;
            schoolId: string;
        })[];
    } & {
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    linkInstructor(userId: string, dto: LinkInstructorDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.LinkStatus;
        createdAt: Date;
        instructorProfileId: string;
        schoolId: string;
    }>;
    list(): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
}
