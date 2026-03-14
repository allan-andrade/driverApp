import { CnhCategory, InstructorType } from '@prisma/client';
export declare class SearchInstructorDto {
    city?: string;
    state?: string;
    category?: CnhCategory;
    instructorType?: InstructorType;
    minPrice?: string;
    maxPrice?: string;
}
