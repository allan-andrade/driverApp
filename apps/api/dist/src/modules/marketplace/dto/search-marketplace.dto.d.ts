import { CnhCategory, InstructorType, TransmissionType } from '@prisma/client';
export declare class SearchMarketplaceDto {
    city?: string;
    state?: string;
    category?: CnhCategory;
    instructorType?: InstructorType;
    minPrice?: number;
    maxPrice?: number;
    transmissionType?: TransmissionType;
    sortBy?: 'relevance' | 'price' | 'rating' | 'experience';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
}
