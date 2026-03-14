import { Injectable, NotFoundException } from '@nestjs/common';
import { FraudSeverity, FraudSignalType } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { CreateFraudSignalDto } from './dto/create-fraud-signal.dto';

@Injectable()
export class FraudService {
  constructor(private readonly prisma: PrismaService) {}

  async listSignals(limit = 300) {
    return this.prisma.fraudSignal.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        payment: true,
        booking: true,
        lesson: true,
        user: { select: { id: true, email: true } },
      },
    });
  }

  async createSignal(dto: CreateFraudSignalDto) {
    return this.prisma.fraudSignal.create({
      data: {
        userId: dto.userId,
        paymentId: dto.paymentId,
        bookingId: dto.bookingId,
        lessonId: dto.lessonId,
        signalType: dto.signalType,
        severity: dto.severity,
        score: dto.score,
        description: dto.description,
      },
    });
  }

  async evaluatePayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true, candidateProfile: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found.');
    }

    const [cancelledCount, pendingAttempts] = await Promise.all([
      this.prisma.booking.count({
        where: {
          candidateProfileId: payment.candidateProfileId,
          status: 'CANCELLED',
        },
      }),
      this.prisma.paymentAttempt.count({
        where: {
          paymentId,
          status: 'FAILED',
        },
      }),
    ]);

    const createdSignals = [];

    if (cancelledCount >= 3) {
      createdSignals.push(
        await this.prisma.fraudSignal.create({
          data: {
            userId: payment.candidateProfile.userId,
            paymentId: payment.id,
            bookingId: payment.bookingId,
            signalType: FraudSignalType.MULTIPLE_CANCELS,
            severity: FraudSeverity.MEDIUM,
            score: 55,
            description: 'Candidate has recurrent cancelled bookings.',
            metadataJson: { cancelledCount },
          },
        }),
      );
    }

    if (pendingAttempts >= 2) {
      createdSignals.push(
        await this.prisma.fraudSignal.create({
          data: {
            userId: payment.candidateProfile.userId,
            paymentId: payment.id,
            bookingId: payment.bookingId,
            signalType: FraudSignalType.HIGH_RISK_PAYMENT,
            severity: FraudSeverity.HIGH,
            score: 75,
            description: 'Multiple failed attempts before payment completion.',
            metadataJson: { failedAttempts: pendingAttempts },
          },
        }),
      );
    }

    return {
      paymentId,
      createdSignals,
      riskScore: createdSignals.reduce((acc, item) => acc + item.score, 0),
    };
  }
}
