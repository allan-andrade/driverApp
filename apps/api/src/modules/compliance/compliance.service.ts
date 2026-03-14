import { Injectable } from '@nestjs/common';
import { DocumentReviewDecision, EntityType, NotificationType, Prisma, UserRole, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { AuditService } from '../audit/audit.service';
import { MetricsService } from '../metrics/metrics.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateDocumentSubmissionDto } from './dto/create-document-submission.dto';
import { CreateDocumentRequirementDto } from './dto/create-document-requirement.dto';
import { ReviewDocumentSubmissionDto } from './dto/review-document-submission.dto';
import { UpsertStatePolicyDto } from './dto/upsert-state-policy.dto';

@Injectable()
export class ComplianceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly notificationsService: NotificationsService,
    private readonly metricsService: MetricsService,
  ) {}

  upsertStatePolicy(dto: UpsertStatePolicyDto) {
    return this.prisma.statePolicy.upsert({
      where: { stateCode: dto.stateCode },
      create: {
        stateCode: dto.stateCode,
        isActive: dto.isActive,
        rulesJson: dto.rulesJson as Prisma.InputJsonValue,
        examFlowJson: dto.examFlowJson as Prisma.InputJsonValue,
        docsJson: dto.docsJson as Prisma.InputJsonValue,
        notes: dto.notes,
      },
      update: {
        isActive: dto.isActive,
        rulesJson: dto.rulesJson as Prisma.InputJsonValue,
        examFlowJson: dto.examFlowJson as Prisma.InputJsonValue,
        docsJson: dto.docsJson as Prisma.InputJsonValue,
        notes: dto.notes,
      },
    });
  }

  listPolicies() {
    return this.prisma.statePolicy.findMany({ orderBy: { stateCode: 'asc' } });
  }

  findPolicyByStateCode(stateCode: string) {
    return this.prisma.statePolicy.findUnique({ where: { stateCode } });
  }

  createDocumentRequirement(dto: CreateDocumentRequirementDto) {
    return this.prisma.documentRequirement.create({
      data: {
        entityType: dto.entityType,
        stateCode: dto.stateCode,
        name: dto.name,
        required: dto.required,
        metadataJson: dto.metadataJson as Prisma.InputJsonValue,
      },
    });
  }

  listDocumentRequirements(stateCode?: string) {
    return this.prisma.documentRequirement.findMany({
      where: stateCode ? { stateCode } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createDocumentSubmission(userId: string, dto: CreateDocumentSubmissionDto) {
    const [candidate, instructor, school] = await Promise.all([
      this.prisma.candidateProfile.findUnique({ where: { userId } }),
      this.prisma.instructorProfile.findUnique({ where: { userId } }),
      this.prisma.school.findUnique({ where: { managerUserId: userId } }),
    ]);

    const stateCode =
      dto.stateCode?.toUpperCase() ||
      candidate?.state ||
      instructor?.state ||
      school?.state ||
      'BR';

    const submission = await this.prisma.documentSubmission.create({
      data: {
        userId,
        instructorProfileId: instructor?.id,
        schoolId: school?.id,
        stateCode,
        documentType: dto.documentType,
        fileUrl: dto.fileUrl,
        metadataJson: dto.metadataJson as Prisma.InputJsonValue,
      },
    });

    await this.auditService.log({
      actorUserId: userId,
      entityType: EntityType.DOCUMENT_SUBMISSION,
      entityId: submission.id,
      action: 'DOCUMENT_SUBMISSION_CREATED',
      metadataJson: {
        stateCode,
        documentType: dto.documentType,
      },
    });

    return submission;
  }

  async listDocumentSubmissions(userId: string, role: UserRole) {
    if (role === UserRole.ADMIN) {
      return this.prisma.documentSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, role: true } },
          reviewedByUser: { select: { id: true, email: true } },
          reviews: {
            orderBy: { createdAt: 'desc' },
            include: {
              reviewedByUser: { select: { id: true, email: true } },
            },
          },
        },
        take: 300,
      });
    }

    const [instructor, school] = await Promise.all([
      role === UserRole.INSTRUCTOR ? this.prisma.instructorProfile.findUnique({ where: { userId } }) : null,
      role === UserRole.SCHOOL_MANAGER ? this.prisma.school.findUnique({ where: { managerUserId: userId } }) : null,
    ]);

    return this.prisma.documentSubmission.findMany({
      where: {
        OR: [
          { userId },
          instructor ? { instructorProfileId: instructor.id } : undefined,
          school ? { schoolId: school.id } : undefined,
        ].filter(Boolean) as Prisma.DocumentSubmissionWhereInput[],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            reviewedByUser: { select: { id: true, email: true } },
          },
        },
      },
      take: 200,
    });
  }

  async reviewDocumentSubmission(id: string, dto: ReviewDocumentSubmissionDto, actorUserId: string) {
    const current = await this.prisma.documentSubmission.findUnique({
      where: { id },
      select: { metadataJson: true, userId: true, instructorProfileId: true },
    });

    const mappedStatus =
      dto.decision === DocumentReviewDecision.APPROVED
        ? VerificationStatus.APPROVED
        : dto.decision === DocumentReviewDecision.REJECTED
          ? VerificationStatus.REJECTED
          : VerificationStatus.PENDING;

    const submission = await this.prisma.documentSubmission.update({
      where: { id },
      data: {
        verificationStatus: mappedStatus,
        reviewedByUserId: actorUserId,
        reviewedAt: new Date(),
        metadataJson: {
          ...(typeof current?.metadataJson === 'object' && current?.metadataJson ? (current.metadataJson as Prisma.InputJsonObject) : {}),
          review: {
            decision: dto.decision,
            reason: dto.reason,
          },
        } as Prisma.InputJsonValue,
      },
    });

    const review = await this.prisma.documentReview.create({
      data: {
        documentSubmissionId: id,
        reviewedByUserId: actorUserId,
        decision: dto.decision,
        reason: dto.reason,
      },
    });

    await this.auditService.log({
      actorUserId,
      entityType: EntityType.DOCUMENT_REVIEW,
      entityId: review.id,
      action: 'DOCUMENT_REVIEW_CREATED',
      metadataJson: {
        submissionId: id,
        decision: dto.decision,
      },
    });

    await this.auditService.log({
      actorUserId,
      entityType: EntityType.DOCUMENT_SUBMISSION,
      entityId: id,
      action: 'DOCUMENT_SUBMISSION_REVIEWED',
      metadataJson: {
        verificationStatus: mappedStatus,
        decision: dto.decision,
      },
    });

    if (current?.userId) {
      await this.notificationsService.notifyUsers({
        userIds: [current.userId],
        type: NotificationType.DOCUMENT_REVIEWED,
        title: 'Documento revisado',
        message: `Sua submissao documental recebeu decisao: ${dto.decision}.`,
        payloadJson: { submissionId: id, decision: dto.decision },
        actorUserId,
      });
    }

    if (current?.instructorProfileId) {
      await this.metricsService.recalculateForInstructor(current.instructorProfileId, actorUserId, 'DOCUMENT_REVIEWED');
    }

    return submission;
  }
}
