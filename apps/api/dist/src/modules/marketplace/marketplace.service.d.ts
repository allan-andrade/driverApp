import { PrismaService } from '../../prisma.service';
import { SearchMarketplaceDto } from './dto/search-marketplace.dto';
export declare class MarketplaceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private formatDisplayName;
    private getReviewAverage;
    private buildWhere;
    private calculateScore;
    listInstructors(filters: SearchMarketplaceDto): Promise<{
        items: {
            id: string;
            fullName: string;
            bio: string | null;
            city: string | null;
            state: string | null;
            yearsExperience: number | null;
            instructorType: import(".prisma/client").$Enums.InstructorType;
            categories: import(".prisma/client").$Enums.CnhCategory[];
            verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
            basePrice: number | null;
            minPackagePrice: number | null;
            rating: number;
            reviewCount: number;
            hasAvailability: boolean;
            vehicleCount: number;
            relevanceScore: number;
        }[];
        meta: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    getInstructorDetail(id: string): Promise<{
        id: string;
        fullName: string;
        bio: string | null;
        city: string | null;
        state: string | null;
        yearsExperience: number | null;
        serviceRadiusKm: number | null;
        basePrice: number | null;
        instructorType: import(".prisma/client").$Enums.InstructorType;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        categories: import(".prisma/client").$Enums.CnhCategory[];
        stats: {
            rating: number;
            reviewCount: number;
            packageCount: number;
            vehicleCount: number;
            hasAvailability: boolean;
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
        packages: {
            price: number;
            id: string;
            instructorProfileId: string | null;
            schoolId: string | null;
            title: string;
            lessonCount: number;
            durationMinutes: number;
            category: import(".prisma/client").$Enums.CnhCategory;
            usesInstructorVehicle: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        availability: {
            id: string;
            instructorProfileId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            weekday: number;
            startTime: string;
            endTime: string;
        }[];
    }>;
    getInstructorAvailability(id: string): Promise<{
        id: string;
        instructorProfileId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        weekday: number;
        startTime: string;
        endTime: string;
    }[]>;
    getInstructorReviews(id: string): Promise<{
        average: number;
        candidateName: string;
        candidateProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            cpf: string | null;
            fullName: string;
            birthDate: Date | null;
            state: string | null;
            city: string | null;
            targetCategory: import(".prisma/client").$Enums.CnhCategory | null;
            learningStage: import(".prisma/client").$Enums.LearningStage | null;
            hasVehicle: boolean;
            preferredLanguage: string | null;
            preferredInstructorGender: string | null;
        };
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
    }[]>;
    getInstructorPackages(id: string): Promise<{
        price: number;
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        title: string;
        lessonCount: number;
        durationMinutes: number;
        category: import(".prisma/client").$Enums.CnhCategory;
        usesInstructorVehicle: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
