import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(dto: CreateReviewDto): import(".prisma/client").Prisma.Prisma__ReviewClient<{
        id: string;
        instructorProfileId: string;
        createdAt: Date;
        candidateProfileId: string;
        bookingId: string;
        punctuality: number;
        didactics: number;
        professionalism: number;
        safety: number;
        examReadiness: number;
        comment: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    list(instructorProfileId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        instructorProfileId: string;
        createdAt: Date;
        candidateProfileId: string;
        bookingId: string;
        punctuality: number;
        didactics: number;
        professionalism: number;
        safety: number;
        examReadiness: number;
        comment: string | null;
    }[]>;
}
