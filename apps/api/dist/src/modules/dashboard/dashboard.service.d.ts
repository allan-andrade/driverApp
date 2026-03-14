import { PrismaService } from '../../prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    candidateDashboard(userId: string): Promise<{
        upcoming: {
            id: string;
            status: import(".prisma/client").$Enums.BookingStatus;
            createdAt: Date;
            updatedAt: Date;
            instructorProfileId: string | null;
            schoolId: string | null;
            candidateProfileId: string;
            scheduledStart: Date;
            scheduledEnd: Date;
            priceTotal: import("@prisma/client/runtime/library").Decimal;
            platformFee: import("@prisma/client/runtime/library").Decimal;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            packageId: string | null;
        }[];
        history: {
            id: string;
            status: import(".prisma/client").$Enums.BookingStatus;
            createdAt: Date;
            updatedAt: Date;
            instructorProfileId: string | null;
            schoolId: string | null;
            candidateProfileId: string;
            scheduledStart: Date;
            scheduledEnd: Date;
            priceTotal: import("@prisma/client/runtime/library").Decimal;
            platformFee: import("@prisma/client/runtime/library").Decimal;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            packageId: string | null;
        }[];
    }>;
    instructorDashboard(userId: string): Promise<{
        agenda: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            instructorProfileId: string;
            weekday: number;
            startTime: string;
            endTime: string;
        }[];
        bookings: {
            id: string;
            status: import(".prisma/client").$Enums.BookingStatus;
            createdAt: Date;
            updatedAt: Date;
            instructorProfileId: string | null;
            schoolId: string | null;
            candidateProfileId: string;
            scheduledStart: Date;
            scheduledEnd: Date;
            priceTotal: import("@prisma/client/runtime/library").Decimal;
            platformFee: import("@prisma/client/runtime/library").Decimal;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            packageId: string | null;
        }[];
    }>;
    schoolDashboard(userId: string): Promise<{
        school: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            state: string | null;
            city: string | null;
            verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
            legalName: string;
            tradeName: string;
            cnpj: string;
            address: string | null;
            managerUserId: string | null;
        };
        instructors: {
            id: string;
            status: import(".prisma/client").$Enums.LinkStatus;
            createdAt: Date;
            instructorProfileId: string;
            schoolId: string;
        }[];
        bookings: {
            id: string;
            status: import(".prisma/client").$Enums.BookingStatus;
            createdAt: Date;
            updatedAt: Date;
            instructorProfileId: string | null;
            schoolId: string | null;
            candidateProfileId: string;
            scheduledStart: Date;
            scheduledEnd: Date;
            priceTotal: import("@prisma/client/runtime/library").Decimal;
            platformFee: import("@prisma/client/runtime/library").Decimal;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            packageId: string | null;
        }[];
    }>;
    adminDashboard(): Promise<{
        users: number;
        instructors: number;
        schools: number;
        bookings: number;
    }>;
}
