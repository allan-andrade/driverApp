import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UpsertCandidateDto } from './dto/upsert-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(private readonly prisma: PrismaService) {}

  upsertByUser(userId: string, dto: UpsertCandidateDto) {
    return this.prisma.candidateProfile.upsert({
      where: { userId },
      create: { ...dto, birthDate: new Date(dto.birthDate), userId },
      update: { ...dto, birthDate: new Date(dto.birthDate) },
    });
  }

  findMe(userId: string) {
    return this.prisma.candidateProfile.findUnique({ where: { userId } });
  }

  list() {
    return this.prisma.candidateProfile.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
