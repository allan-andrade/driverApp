import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateReviewDto) {
    return this.prisma.review.create({ data: dto });
  }

  listByInstructor(instructorProfileId: string) {
    return this.prisma.review.findMany({ where: { instructorProfileId }, orderBy: { createdAt: 'desc' } });
  }
}
