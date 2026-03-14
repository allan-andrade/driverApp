import { UpdatePayoutStatusDto } from './dto/update-payout-status.dto';
import { PayoutsService } from './payouts.service';
export declare class PayoutsController {
    private readonly payoutsService;
    constructor(payoutsService: PayoutsService);
    listMine(userId: string): Promise<({
        payment: {
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
        };
    } & {
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PayoutStatus;
        providerReference: string | null;
        provider: string | null;
        paymentId: string;
        amountNet: import("@prisma/client/runtime/library").Decimal;
        scheduledAt: Date | null;
        paidAt: Date | null;
    })[]>;
    listAll(): import(".prisma/client").Prisma.PrismaPromise<({
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
        payment: {
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
        };
    } & {
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PayoutStatus;
        providerReference: string | null;
        provider: string | null;
        paymentId: string;
        amountNet: import("@prisma/client/runtime/library").Decimal;
        scheduledAt: Date | null;
        paidAt: Date | null;
    })[]>;
    updateStatus(id: string, dto: UpdatePayoutStatusDto): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PayoutStatus;
        providerReference: string | null;
        provider: string | null;
        paymentId: string;
        amountNet: import("@prisma/client/runtime/library").Decimal;
        scheduledAt: Date | null;
        paidAt: Date | null;
    }>;
}
