import { UserRole } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    listMine(user: {
        userId: string;
        role: UserRole;
    }): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        platformFee: import("@prisma/client/runtime/library").Decimal;
        candidateProfileId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        bookingId: string;
        providerReference: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        capturedAt: Date | null;
        refundedAt: Date | null;
        provider: string | null;
        providerPaymentId: string | null;
        splitMetadataJson: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    listAll(): import(".prisma/client").Prisma.PrismaPromise<({
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
        } | null;
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
        } | null;
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
        };
    } & {
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        platformFee: import("@prisma/client/runtime/library").Decimal;
        candidateProfileId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        bookingId: string;
        providerReference: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        capturedAt: Date | null;
        refundedAt: Date | null;
        provider: string | null;
        providerPaymentId: string | null;
        splitMetadataJson: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    updateStatus(id: string, dto: UpdatePaymentStatusDto, actorUserId: string): Promise<{
        booking: {
            id: string;
            status: import(".prisma/client").$Enums.BookingStatus;
        };
    } & {
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        platformFee: import("@prisma/client/runtime/library").Decimal;
        candidateProfileId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        bookingId: string;
        providerReference: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        capturedAt: Date | null;
        refundedAt: Date | null;
        provider: string | null;
        providerPaymentId: string | null;
        splitMetadataJson: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
