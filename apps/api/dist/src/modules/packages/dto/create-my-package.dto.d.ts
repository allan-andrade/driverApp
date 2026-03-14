import { CnhCategory } from '@prisma/client';
export declare class CreateMyPackageDto {
    title: string;
    lessonCount: number;
    durationMinutes: number;
    category: CnhCategory;
    price: number;
    usesInstructorVehicle: boolean;
}
