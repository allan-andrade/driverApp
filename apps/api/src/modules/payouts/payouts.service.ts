import { Injectable, NotFoundException } from '@nestjs/common';
import { PayoutStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class PayoutsService {
  constructor(private readonly prisma: PrismaService) {}

  async createHoldForPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException('Payment not found.');
    }

    if (!payment.instructorProfileId && !payment.schoolId) {
      return null;
    }

    const alreadyExists = await this.prisma.payout.findFirst({ where: { paymentId } });
    if (alreadyExists) {
      return alreadyExists;
    }

    const amountNet = Number(payment.amount) - Number(payment.platformFee);

    return this.prisma.payout.create({
      data: {
        paymentId,
        instructorProfileId: payment.instructorProfileId,
        schoolId: payment.schoolId,
        amountNet,
        status: PayoutStatus.ON_HOLD,
      },
    });
  }

  async releaseByBooking(bookingId: string) {
    const payout = await this.prisma.payout.findFirst({
      where: {
        payment: {
          bookingId,
        },
      },
    });

    if (!payout) {
      return null;
    }

    return this.prisma.payout.update({
      where: { id: payout.id },
      data: {
        status: PayoutStatus.SCHEDULED,
        scheduledAt: new Date(),
      },
    });
  }

  listAll() {
    return this.prisma.payout.findMany({
      include: {
        payment: true,
        instructorProfile: true,
        school: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async listMine(userId: string) {
    const [instructor, school] = await Promise.all([
      this.prisma.instructorProfile.findUnique({ where: { userId } }),
      this.prisma.school.findUnique({ where: { managerUserId: userId } }),
    ]);

    const where: Prisma.PayoutWhereInput = {
      OR: [
        instructor ? { instructorProfileId: instructor.id } : undefined,
        school ? { schoolId: school.id } : undefined,
      ].filter(Boolean) as Prisma.PayoutWhereInput[],
    };

    if (!where.OR || where.OR.length === 0) {
      return [];
    }

    return this.prisma.payout.findMany({
      where,
      include: { payment: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: PayoutStatus, provider?: string, providerReference?: string) {
    return this.prisma.payout.update({
      where: { id },
      data: {
        status,
        provider,
        providerReference,
        paidAt: status === PayoutStatus.PAID ? new Date() : null,
      },
    });
  }
}
