import { UserRole } from '@prisma/client';
import { BookingsService } from './bookings.service';
import { CancelBookingDto } from './dto/cancel-booking.dto';
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
        cancelReason: string | null;
        rescheduleReason: string | null;
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
        cancelReason: string | null;
        rescheduleReason: string | null;
        candidateProfileId: string;
        packageId: string | null;
    }[]>;
    list(candidateProfileId?: string, instructorProfileId?: string, schoolId?: string): Promise<({
        candidateProfile: {
            id: string;
            fullName: string;
        };
        instructorProfile: {
            user: {
                email: string;
            };
            id: string;
        } | null;
        package: {
            id: string;
            title: string;
        } | null;
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
        cancelReason: string | null;
        rescheduleReason: string | null;
        candidateProfileId: string;
        packageId: string | null;
    } & {
        priceTotal: number;
        platformFee: number;
    })[]>;
    findOne(id: string, user: {
        userId: string;
        role: UserRole;
    }): Promise<({
        candidateProfile: {
            id: string;
            fullName: string;
        };
        instructorProfile: {
            user: {
                email: string;
            };
            id: string;
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
            startAddress: string | null;
            endAddress: string | null;
            notes: string | null;
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
        cancelReason: string | null;
        rescheduleReason: string | null;
        candidateProfileId: string;
        packageId: string | null;
    } & {
        priceTotal: number;
        platformFee: number;
    }) | null>;
    cancel(id: string, dto: CancelBookingDto, user: {
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
        cancelReason: string | null;
        rescheduleReason: string | null;
        candidateProfileId: string;
        packageId: string | null;
    } & {
        priceTotal: number;
        platformFee: number;
    }>;
    reschedule(id: string, dto: RescheduleBookingDto, user: {
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
        cancelReason: string | null;
        rescheduleReason: string | null;
        candidateProfileId: string;
        packageId: string | null;
    } & {
        priceTotal: number;
        platformFee: number;
    }>;
}
