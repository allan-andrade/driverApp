import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  BookingStatus,
  EntityType,
  NotificationType,
  PaymentAttemptStatus,
  PaymentMethod,
  PaymentSplitStatus,
  PaymentStatus,
  Prisma,
  PayoutStatus,
  RecipientType,
  UserRole,
} from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { AuditService } from '../audit/audit.service';
import { FraudService } from '../fraud/fraud.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PayoutsService } from '../payouts/payouts.service';
import { WalletsService } from '../wallets/wallets.service';
import { CreatePaymentCheckoutDto } from './dto/create-payment-checkout.dto';
import { PaymentGatewayService } from './payment-gateway.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly payoutsService: PayoutsService,
    private readonly walletsService: WalletsService,
    private readonly notificationsService: NotificationsService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly fraudService: FraudService,
  ) {}

  private normalizeProvider(provider: string) {
    return this.paymentGatewayService.toWebhookProvider(provider);
  }

  private toJsonValue(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue;
  }

  private async ensureSplitsForPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        splits: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found for split creation.');
    }

    if (payment.splits.length > 0) {
      return payment.splits;
    }

    const platformAmount = Number(payment.platformFee ?? 0);
    const netAmount = Number(Number(payment.amount) - platformAmount);

    const splitData = [];

    if (platformAmount > 0) {
      splitData.push({
        paymentId: payment.id,
        recipientType: RecipientType.PLATFORM,
        recipientId: 'platform',
        amount: platformAmount,
        status: PaymentSplitStatus.PROCESSING,
      });
    }

    if (netAmount > 0 && payment.instructorProfileId) {
      splitData.push({
        paymentId: payment.id,
        recipientType: RecipientType.INSTRUCTOR,
        recipientId: payment.instructorProfileId,
        amount: netAmount,
        status: PaymentSplitStatus.PROCESSING,
      });
    }

    if (netAmount > 0 && !payment.instructorProfileId && payment.schoolId) {
      splitData.push({
        paymentId: payment.id,
        recipientType: RecipientType.SCHOOL,
        recipientId: payment.schoolId,
        amount: netAmount,
        status: PaymentSplitStatus.PROCESSING,
      });
    }

    if (splitData.length === 0) {
      return [];
    }

    await this.prisma.paymentSplit.createMany({
      data: splitData,
    });

    return this.prisma.paymentSplit.findMany({
      where: { paymentId: payment.id },
      orderBy: { createdAt: 'asc' },
    });
  }

  private async markSplitStatus(paymentId: string, status: PaymentSplitStatus) {
    await this.prisma.paymentSplit.updateMany({
      where: { paymentId },
      data: { status },
    });
  }

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
      await this.ensureSplitsForPayment(payment.id);
      await this.markSplitStatus(payment.id, PaymentSplitStatus.PAID);
      await this.payoutsService.createHoldForPayment(payment.id);
      await this.walletsService.registerPendingFromPayment(payment.id, actorUserId);

      if (payment.booking.status === BookingStatus.COMPLETED) {
        await this.payoutsService.releaseByBooking(payment.booking.id);
        await this.walletsService.movePendingToAvailable(payment.id, actorUserId);
      }
    }

    if (status === PaymentStatus.CANCELLED || status === PaymentStatus.REFUNDED) {
      await this.markSplitStatus(payment.id, PaymentSplitStatus.ON_HOLD);
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

      await this.walletsService.refundByPayment(payment.id, actorUserId);
    }

    await this.notificationsService.notifyBookingParticipants(
      payment.bookingId,
      NotificationType.PAYMENT_UPDATED,
      'Pagamento atualizado',
      `O pagamento da reserva foi atualizado para ${status}.`,
      actorUserId,
    );

    return payment;
  }

  async startCheckout(paymentId: string, dto: CreatePaymentCheckoutDto, actorUserId?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found.');
    }

    if (payment.status === PaymentStatus.PAID || payment.status === PaymentStatus.CAPTURED) {
      throw new BadRequestException('Payment is already captured/paid.');
    }

    const checkout = await this.paymentGatewayService.createCheckout({
      provider: dto.provider,
      amount: Number(payment.amount),
      currency: payment.currency,
      paymentId: payment.id,
      bookingId: payment.bookingId,
      returnUrl: dto.returnUrl,
    });

    const webhookProvider = this.normalizeProvider(dto.provider);

    await this.prisma.$transaction(async (tx) => {
      await tx.paymentAttempt.create({
        data: {
          paymentId: payment.id,
          provider: webhookProvider,
          providerReference: checkout.providerReference,
          status: PaymentAttemptStatus.PENDING,
          requestJson: {
            amount: Number(payment.amount),
            currency: payment.currency,
            method: dto.method ?? PaymentMethod.PIX,
            returnUrl: dto.returnUrl,
          },
          responseJson: this.toJsonValue(checkout.rawResponse ?? {}),
        },
      });

      await tx.payment.update({
        where: { id: payment.id },
        data: {
          method: dto.method ?? PaymentMethod.PIX,
          provider: checkout.provider,
          providerPaymentId: checkout.providerPaymentId,
          providerReference: checkout.providerReference,
          splitMetadataJson: {
            ...(payment.splitMetadataJson && typeof payment.splitMetadataJson === 'object' ? payment.splitMetadataJson : {}),
            checkoutResponse: this.toJsonValue(checkout.rawResponse ?? {}),
          },
        },
      });
    });

    await this.auditService.log({
      actorUserId,
      entityType: EntityType.PAYMENT,
      entityId: payment.id,
      action: 'PAYMENT_CHECKOUT_STARTED',
      metadataJson: {
        provider: checkout.provider,
        providerReference: checkout.providerReference,
      },
    });

    await this.fraudService.evaluatePayment(payment.id);

    return {
      paymentId: payment.id,
      provider: checkout.provider,
      providerPaymentId: checkout.providerPaymentId,
      providerReference: checkout.providerReference,
      checkoutUrl: checkout.checkoutUrl,
      status: payment.status,
    };
  }

  async processWebhook(provider: string, payload: Record<string, unknown>, headers: Record<string, string | string[] | undefined>) {
    const webhookProvider = this.normalizeProvider(provider);
    this.paymentGatewayService.validateWebhook(provider, payload, headers);

    const parsed = this.paymentGatewayService.parseWebhook(provider, payload);
    const providerReference =
      parsed.providerReference ||
      (typeof payload.id === 'string' ? payload.id : undefined) ||
      (typeof payload.eventId === 'string' ? payload.eventId : undefined);

    const existing = providerReference
      ? await this.prisma.webhookEvent.findFirst({
          where: {
            provider: webhookProvider,
            providerReference,
          },
          orderBy: { createdAt: 'desc' },
        })
      : null;

    if (existing?.processed) {
      return {
        accepted: true,
        deduplicated: true,
        webhookEventId: existing.id,
      };
    }

    const webhookEvent = existing
      ? existing
      : await this.prisma.webhookEvent.create({
          data: {
            provider: webhookProvider,
            eventType: parsed.eventType,
            providerReference,
            payloadJson: this.toJsonValue(payload),
            processed: false,
          },
        });

    try {
      const payment = parsed.paymentReference
        ? await this.prisma.payment.findFirst({
            where: {
              OR: [
                { providerPaymentId: parsed.paymentReference },
                { providerReference: parsed.paymentReference },
              ],
            },
          })
        : null;

      if (payment) {
        await this.prisma.paymentAttempt.create({
          data: {
            paymentId: payment.id,
            provider: webhookProvider,
            providerReference: providerReference ?? parsed.paymentReference,
            status: parsed.status ? PaymentAttemptStatus.SUCCESS : PaymentAttemptStatus.PENDING,
            requestJson: {
              eventType: parsed.eventType,
            },
            responseJson: this.toJsonValue(payload),
          },
        });

        if (parsed.status && payment.status !== parsed.status) {
          await this.updateStatus(payment.id, parsed.status, undefined, providerReference ?? parsed.paymentReference);
        }

        await this.fraudService.evaluatePayment(payment.id);
      }

      await this.prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          processed: true,
          processedAt: new Date(),
          errorMessage: null,
        },
      });

      return {
        accepted: true,
        deduplicated: false,
        webhookEventId: webhookEvent.id,
      };
    } catch (error) {
      await this.prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          processed: false,
          processedAt: new Date(),
          errorMessage: error instanceof Error ? error.message : 'Unknown webhook processing error',
        },
      });

      throw error;
    }
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
