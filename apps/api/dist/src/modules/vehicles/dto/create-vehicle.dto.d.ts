import { CnhCategory, TransmissionType, VerificationStatus } from '@prisma/client';
export declare class CreateVehicleDto {
    instructorProfileId?: string;
    schoolId?: string;
    plate: string;
    brand: string;
    model: string;
    year: number;
    transmissionType: TransmissionType;
    categorySupported: CnhCategory;
    verificationStatus?: VerificationStatus;
}
