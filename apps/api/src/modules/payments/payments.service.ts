import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus, EntityType, PaymentMethod, PaymentStatus, PayoutStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { AuditService } from '../audit/audit.service';
import { PayoutsService } from '../payouts/payouts.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly payoutsService: PayoutsService,
  ) {}

  async createPending(bookingId: string, amount: number, platformFee = 0) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      throw new NotFoundException('Booking not found for payment creation.');
    }

    return this.prisma.payment.create({
      data: {
        bookingId,
        candidateProfileId: booking.candidateProfileId,
        instructorProfileId: booking.instructorProfileId,
        schoolId: booking.schoolId,
        amount,
        platformFee,
        method: PaymentMethod.MANUAL,
        currency: 'BRL',
        status: PaymentStatus.PENDING,
        provider: 'stub',
        splitMetadataJson: { providerHint: 'stripe|pagarme|asaas' },
      },
    });
  }

  listAll() {
    return this.prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        booking: true,
        candidateProfile: true,
        instructorProfile: true,
        school: true,
      },
      take: 300,
    });
  }

  async listMine(userId: string, role: UserRole) {
    if (role === UserRole.ADMIN) {
      return this.listAll();
    }

    if (role === UserRole.CANDIDATE) {
      const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
      if (!candidate) return [];
      return this.prisma.payment.findMany({
        where: { candidateProfileId: candidate.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (role === UserRole.INSTRUCTOR) {
      const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
      if (!instructor) return [];
      return this.prisma.payment.findMany({
        where: { instructorProfileId: instructor.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    const school = await this.prisma.school.findUnique({ where: { managerUserId: userId } });
    if (!school) return [];
    return this.prisma.payment.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(paymentId: string, status: PaymentStatus, actorUserId?: string, providerReference?: string) {
    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        providerReference,
        capturedAt: status === PaymentStatus.CAPTURED || status === PaymentStatus.PAID ? new Date() : null,
        refundedAt: status === PaymentStatus.REFUNDED ? new Date() : null,
      },
      include: {
        booking: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    await this.prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        paymentStatus: status,
      },
    });

    await this.auditService.log({
      actorUserId,
      entityType: EntityType.PAYMENT,
      entityId: payment.id,
      action: 'PAYMENT_STATUS_UPDATED',
      metadataJson: {
        status,
        providerReference,
      },
    });

    if (status === PaymentStatus.CAPTURED || status === PaymentStatus.PAID) {
      await this.payoutsService.createHoldForPayment(payment.id);

      if (payment.booking.status === BookingStatus.COMPLETED) {
        await this.payoutsService.releaseByBooking(payment.booking.id);
      }
    }

    if (status === PaymentStatus.CANCELLED || status === PaymentStatus.REFUNDED) {
      await this.prisma.payout.updateMany({
        where: {
          paymentId: payment.id,
          status: {
            not: PayoutStatus.PAID,
          },
        },
        data: {
          status: PayoutStatus.ON_HOLD,
        },
      });
    }

    return payment;
  }

  async capture(paymentId: string, actorUserId?: string, providerReference?: string) {
    return this.updateStatus(paymentId, PaymentStatus.CAPTURED, actorUserId, providerReference);
  }

  async cancel(paymentId: string, actorUserId?: string) {
    return this.updateStatus(paymentId, PaymentStatus.CANCELLED, actorUserId);
  }

  async refund(paymentId: string, actorUserId?: string) {
    return this.updateStatus(paymentId, PaymentStatus.REFUNDED, actorUserId);
  }
}
