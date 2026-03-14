import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { AuditService } from '../audit/audit.service';
import { PackagesService } from '../packages/packages.service';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';
export declare class BookingsService {
    private readonly prisma;
    private readonly auditService;
    private readonly packagesService;
    constructor(prisma: PrismaService, auditService: AuditService, packagesService: PackagesService);
    private toMinutes;
    private validateWindow;
    private getWeekdayUtc;
    private getMinutesUtc;
    private validateInstructorAvailability;
    private validateInstructorConflict;
    private calculateAmounts;
    private buildPinCode;
    private normalizeBooking;
    private resolveActorScope;
    private assertBookingAccess;
    create(dto: CreateBookingDto, actorUserId?: string): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        priceTotal: Prisma.Decimal;
        platformFee: Prisma.Decimal;
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
    createForCandidate(userId: string, dto: CreateBookingDto): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        priceTotal: Prisma.Decimal;
        platformFee: Prisma.Decimal;
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
    list(filters: {
        candidateProfileId?: string;
        instructorProfileId?: string;
        schoolId?: string;
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
            title: string;
        } | null;
    } & {
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        priceTotal: Prisma.Decimal;
        platformFee: Prisma.Decimal;
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
    listMine(userId: string, role: UserRole): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        priceTotal: Prisma.Decimal;
        platformFee: Prisma.Decimal;
        scheduledStart: Date;
        scheduledEnd: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        cancelReason: string | null;
        rescheduleReason: string | null;
        candidateProfileId: string;
        packageId: string | null;
    }[]>;
    cancel(id: string, dto: CancelBookingDto, actorUser?: {
        userId: string;
        role: UserRole;
    }): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        priceTotal: Prisma.Decimal;
        platformFee: Prisma.Decimal;
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
    reschedule(id: string, dto: RescheduleBookingDto, actorUser?: {
        userId: string;
        role: UserRole;
    }): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        priceTotal: Prisma.Decimal;
        platformFee: Prisma.Decimal;
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
    listMineAsInstructor(userId: string): Promise<({
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
        priceTotal: Prisma.Decimal;
        platformFee: Prisma.Decimal;
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
    findOne(id: string, userId: string, role: UserRole): Promise<({
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
            price: Prisma.Decimal;
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
        priceTotal: Prisma.Decimal;
        platformFee: Prisma.Decimal;
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
}
