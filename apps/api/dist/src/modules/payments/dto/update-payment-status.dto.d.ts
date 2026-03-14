import { PaymentStatus } from '@prisma/client';
export declare class UpdatePaymentStatusDto {
    status: PaymentStatus;
    providerReference?: string;
}
