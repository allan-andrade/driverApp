import { PrismaService } from '../../prisma.service';
export declare class PaymentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createPending(bookingId: string, amount: number): import(".prisma/client").Prisma.Prisma__PaymentClient<{
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        bookingId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        provider: string | null;
        providerPaymentId: string | null;
        splitMetadataJson: import("@prisma/client/runtime/library").JsonValue | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    markAsPaid(paymentId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        bookingId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        provider: string | null;
        providerPaymentId: string | null;
        splitMetadataJson: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
