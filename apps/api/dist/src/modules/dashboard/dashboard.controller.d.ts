import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    candidate(userId: string): Promise<{
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
    instructor(userId: string): Promise<{
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
    school(userId: string): Promise<{
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
    admin(): Promise<{
        users: number;
        instructors: number;
        schools: number;
        bookings: number;
    }>;
}
