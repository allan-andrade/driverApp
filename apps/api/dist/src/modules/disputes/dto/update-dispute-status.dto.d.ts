import { DisputeStatus } from '@prisma/client';
export declare class UpdateDisputeStatusDto {
    status: DisputeStatus;
    resolution?: string;
}
