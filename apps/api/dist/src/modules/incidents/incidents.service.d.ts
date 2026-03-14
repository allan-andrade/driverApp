import { IncidentStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
export declare class IncidentsService {
    private readonly prisma;
    private readonly auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    private assertReporterCanOpen;
    create(user: {
        userId: string;
        role: UserRole;
    }, dto: CreateIncidentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.IncidentStatus;
        bookingId: string | null;
        description: string;
        lessonId: string | null;
        type: import(".prisma/client").$Enums.IncidentType;
        severity: import(".prisma/client").$Enums.IncidentSeverity;
        evidenceUrl: string | null;
        reporterUserId: string;
        reportedUserId: string | null;
    }>;
    listMine(userId: string, role: UserRole): Promise<({
        booking: {
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
        } | null;
        lesson: {
            id: string;
            instructorProfileId: string;
            createdAt: Date;
            updatedAt: Date;
            candidateProfileId: string;
            status: import(".prisma/client").$Enums.LessonStatus;
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.IncidentStatus;
        bookingId: string | null;
        description: string;
        lessonId: string | null;
        type: import(".prisma/client").$Enums.IncidentType;
        severity: import(".prisma/client").$Enums.IncidentSeverity;
        evidenceUrl: string | null;
        reporterUserId: string;
        reportedUserId: string | null;
    })[]>;
    listAll(): import(".prisma/client").Prisma.PrismaPromise<({
        booking: {
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
        } | null;
        lesson: {
            id: string;
            instructorProfileId: string;
            createdAt: Date;
            updatedAt: Date;
            candidateProfileId: string;
            status: import(".prisma/client").$Enums.LessonStatus;
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
        } | null;
        reporterUser: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
        reportedUser: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.IncidentStatus;
        bookingId: string | null;
        description: string;
        lessonId: string | null;
        type: import(".prisma/client").$Enums.IncidentType;
        severity: import(".prisma/client").$Enums.IncidentSeverity;
        evidenceUrl: string | null;
        reporterUserId: string;
        reportedUserId: string | null;
    })[]>;
    updateStatus(id: string, status: IncidentStatus, actorUserId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.IncidentStatus;
        bookingId: string | null;
        description: string;
        lessonId: string | null;
        type: import(".prisma/client").$Enums.IncidentType;
        severity: import(".prisma/client").$Enums.IncidentSeverity;
        evidenceUrl: string | null;
        reporterUserId: string;
        reportedUserId: string | null;
    }>;
}
