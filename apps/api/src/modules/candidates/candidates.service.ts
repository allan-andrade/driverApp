import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UpsertCandidateDto } from './dto/upsert-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(private readonly prisma: PrismaService) {}

  upsertByUser(userId: string, dto: UpsertCandidateDto) {
    const payload = {
      fullName: dto.fullName,
      cpf: dto.cpf,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
      state: dto.state,
      city: dto.city,
      targetCategory: dto.targetCategory,
      learningStage: dto.learningStage,
      hasVehicle: dto.hasVehicle ?? false,
      preferredLanguage: dto.preferredLanguage,
      preferredInstructorGender: dto.preferredInstructorGender,
    };

    return this.prisma.candidateProfile.upsert({
      where: { userId },
      create: { ...payload, userId },
      update: payload,
    });
  }

  findMe(userId: string) {
    return this.prisma.candidateProfile.findUnique({ where: { userId } });
  }

  list() {
    return this.prisma.candidateProfile.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
