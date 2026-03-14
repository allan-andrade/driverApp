import { PayoutStatus } from '@prisma/client';
export declare class UpdatePayoutStatusDto {
    status: PayoutStatus;
    provider?: string;
    providerReference?: string;
}
