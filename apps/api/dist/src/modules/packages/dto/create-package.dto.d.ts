import { CnhCategory } from '@prisma/client';
export declare class CreatePackageDto {
    instructorProfileId?: string;
    schoolId?: string;
    title: string;
    lessonCount: number;
    durationMinutes: number;
    category: CnhCategory;
    price: number;
    usesInstructorVehicle: boolean;
}
