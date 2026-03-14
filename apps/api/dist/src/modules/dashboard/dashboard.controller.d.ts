import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    candidate(userId: string): Promise<{
        upcoming: {
            id: string;
            instructorProfileId: string | null;
            schoolId: string | null;
            createdAt: Date;
            updatedAt: Date;
            priceTotal: import("@prisma/client/runtime/library").Decimal;
            platformFee: import("@prisma/client/runtime/library").Decimal;
            candidateProfileId: string;
            packageId: string | null;
            scheduledStart: Date;
            scheduledEnd: Date;
            status: import(".prisma/client").$Enums.BookingStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            cancelReason: string | null;
            rescheduleReason: string | null;
        }[];
        history: {
            id: string;
            instructorProfileId: string | null;
            schoolId: string | null;
            createdAt: Date;
            updatedAt: Date;
            priceTotal: import("@prisma/client/runtime/library").Decimal;
            platformFee: import("@prisma/client/runtime/library").Decimal;
            candidateProfileId: string;
            packageId: string | null;
            scheduledStart: Date;
            scheduledEnd: Date;
            status: import(".prisma/client").$Enums.BookingStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            cancelReason: string | null;
            rescheduleReason: string | null;
        }[];
    }>;
    instructor(userId: string): Promise<{
        agenda: {
            id: string;
            instructorProfileId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            weekday: number;
            startTime: string;
            endTime: string;
        }[];
        bookings: {
            id: string;
            instructorProfileId: string | null;
            schoolId: string | null;
            createdAt: Date;
            updatedAt: Date;
            priceTotal: import("@prisma/client/runtime/library").Decimal;
            platformFee: import("@prisma/client/runtime/library").Decimal;
            candidateProfileId: string;
            packageId: string | null;
            scheduledStart: Date;
            scheduledEnd: Date;
            status: import(".prisma/client").$Enums.BookingStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            cancelReason: string | null;
            rescheduleReason: string | null;
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
            cnpj: string;
            managerUserId: string | null;
            legalName: string;
            tradeName: string;
            address: string | null;
        };
        instructors: {
            id: string;
            instructorProfileId: string;
            schoolId: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.LinkStatus;
        }[];
        bookings: {
            id: string;
            instructorProfileId: string | null;
            schoolId: string | null;
            createdAt: Date;
            updatedAt: Date;
            priceTotal: import("@prisma/client/runtime/library").Decimal;
            platformFee: import("@prisma/client/runtime/library").Decimal;
            candidateProfileId: string;
            packageId: string | null;
            scheduledStart: Date;
            scheduledEnd: Date;
            status: import(".prisma/client").$Enums.BookingStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            cancelReason: string | null;
            rescheduleReason: string | null;
        }[];
    }>;
    admin(): Promise<{
        users: number;
        instructors: number;
        schools: number;
        bookings: number;
    }>;
}
