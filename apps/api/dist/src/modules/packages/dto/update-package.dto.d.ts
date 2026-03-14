import { CnhCategory } from '@prisma/client';
export declare class UpdatePackageDto {
    title?: string;
    lessonCount?: number;
    durationMinutes?: number;
    category?: CnhCategory;
    price?: number;
    usesInstructorVehicle?: boolean;
}
