import { UserRole } from '@prisma/client';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(user: {
        userId: string;
        role: UserRole;
    }, dto: CreateBookingDto): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        priceTotal: import("@prisma/client/runtime/library").Decimal;
        platformFee: import("@prisma/client/runtime/library").Decimal;
        scheduledStart: Date;
        scheduledEnd: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        candidateProfileId: string;
        packageId: string | null;
    } & {
        priceTotal: number;
        platformFee: number;
    }>;
    listMine(user: {
        userId: string;
        role: UserRole;
    }): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        priceTotal: import("@prisma/client/runtime/library").Decimal;
        platformFee: import("@prisma/client/runtime/library").Decimal;
        scheduledStart: Date;
        scheduledEnd: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        candidateProfileId: string;
        packageId: string | null;
    }[]>;
    list(candidateProfileId?: string, instructorProfileId?: string, schoolId?: string): Promise<({
        instructorProfile: {
            id: string;
            user: {
                email: string;
            };
        } | null;
        package: {
            id: string;
            title: string;
        } | null;
        candidateProfile: {
            id: string;
            fullName: string;
        };
    } & {
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        priceTotal: import("@prisma/client/runtime/library").Decimal;
        platformFee: import("@prisma/client/runtime/library").Decimal;
        scheduledStart: Date;
        scheduledEnd: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        candidateProfileId: string;
        packageId: string | null;
    } & {
        priceTotal: number;
        platformFee: number;
    })[]>;
    findOne(id: string): Promise<({
        instructorProfile: {
            id: string;
            user: {
                email: string;
            };
        } | null;
        package: {
            id: string;
            instructorProfileId: string | null;
            schoolId: string | null;
            title: string;
            lessonCount: number;
            durationMinutes: number;
            category: import(".prisma/client").$Enums.CnhCategory;
            price: import("@prisma/client/runtime/library").Decimal;
            usesInstructorVehicle: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        candidateProfile: {
            id: string;
            fullName: string;
        };
        lessons: {
            id: string;
            instructorProfileId: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.LessonStatus;
            candidateProfileId: string;
            bookingId: string;
            vehicleId: string | null;
            pinCode: string;
            pinVerified: boolean;
            startedAt: Date | null;
            finishedAt: Date | null;
            startLat: number | null;
            startLng: number | null;
            endLat: number | null;
            endLng: number | null;
        }[];
    } & {
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        priceTotal: import("@prisma/client/runtime/library").Decimal;
        platformFee: import("@prisma/client/runtime/library").Decimal;
        scheduledStart: Date;
        scheduledEnd: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        candidateProfileId: string;
        packageId: string | null;
    } & {
        priceTotal: number;
        platformFee: number;
    }) | null>;
    cancel(id: string, actorUserId: string): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        priceTotal: import("@prisma/client/runtime/library").Decimal;
        platformFee: import("@prisma/client/runtime/library").Decimal;
        scheduledStart: Date;
        scheduledEnd: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        candidateProfileId: string;
        packageId: string | null;
    } & {
        priceTotal: number;
        platformFee: number;
    }>;
    reschedule(id: string, dto: RescheduleBookingDto, actorUserId: string): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        priceTotal: import("@prisma/client/runtime/library").Decimal;
        platformFee: import("@prisma/client/runtime/library").Decimal;
        scheduledStart: Date;
        scheduledEnd: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        candidateProfileId: string;
        packageId: string | null;
    } & {
        priceTotal: number;
        platformFee: number;
    }>;
}
