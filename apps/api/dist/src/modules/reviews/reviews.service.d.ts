import { PrismaService } from '../../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateReviewDto): import(".prisma/client").Prisma.Prisma__ReviewClient<{
        id: string;
        createdAt: Date;
        instructorProfileId: string;
        bookingId: string;
        candidateProfileId: string;
        punctuality: number;
        didactics: number;
        professionalism: number;
        safety: number;
        examReadiness: number;
        comment: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listByInstructor(instructorProfileId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        instructorProfileId: string;
        bookingId: string;
        candidateProfileId: string;
        punctuality: number;
        didactics: number;
        professionalism: number;
        safety: number;
        examReadiness: number;
        comment: string | null;
    }[]>;
}
