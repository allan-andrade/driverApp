import { CnhCategory, TransmissionType, VerificationStatus } from '@prisma/client';
export declare class UpdateVehicleDto {
    plate?: string;
    brand?: string;
    model?: string;
    year?: number;
    transmissionType?: TransmissionType;
    categorySupported?: CnhCategory;
    verificationStatus?: VerificationStatus;
}
