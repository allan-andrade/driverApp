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
        state: string | null;
        city: string | null;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        cnpj: string;
        managerUserId: string | null;
        legalName: string;
        tradeName: string;
        address: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    mySchool(userId: string): import(".prisma/client").Prisma.Prisma__SchoolClient<({
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
        instructorLinks: ({
            instructorProfile: {
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
            };
        } & {
            id: string;
            instructorProfileId: string;
            schoolId: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.LinkStatus;
        })[];
    } & {
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    linkInstructor(userId: string, dto: LinkInstructorDto): Promise<{
        id: string;
        instructorProfileId: string;
        schoolId: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.LinkStatus;
    }>;
    list(): import(".prisma/client").Prisma.PrismaPromise<{
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
