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
            candidateProfileId: string;
            instructorProfileId: string | null;
            schoolId: string | null;
            packageId: string | null;
            scheduledStart: Date;
            scheduledEnd: Date;
            priceTotal: import("@prisma/client/runtime/library").Decimal;
            platformFee: import("@prisma/client/runtime/library").Decimal;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        }[];
        history: {
            id: string;
            status: import(".prisma/client").$Enums.BookingStatus;
            createdAt: Date;
            updatedAt: Date;
            candidateProfileId: string;
            instructorProfileId: string | null;
            schoolId: string | null;
            packageId: string | null;
            scheduledStart: Date;
            scheduledEnd: Date;
            priceTotal: import("@prisma/client/runtime/library").Decimal;
            platformFee: import("@prisma/client/runtime/library").Decimal;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
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
            candidateProfileId: string;
            instructorProfileId: string | null;
            schoolId: string | null;
            packageId: string | null;
            scheduledStart: Date;
            scheduledEnd: Date;
            priceTotal: import("@prisma/client/runtime/library").Decimal;
            platformFee: import("@prisma/client/runtime/library").Decimal;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        }[];
    }>;
    school(userId: string): Promise<{
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
            candidateProfileId: string;
            instructorProfileId: string | null;
            schoolId: string | null;
            packageId: string | null;
            scheduledStart: Date;
            scheduledEnd: Date;
            priceTotal: import("@prisma/client/runtime/library").Decimal;
            platformFee: import("@prisma/client/runtime/library").Decimal;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        }[];
    }>;
    admin(): Promise<{
        users: number;
        instructors: number;
        schools: number;
        bookings: number;
    }>;
}
