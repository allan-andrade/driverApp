import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  createPending(bookingId: string, amount: number) {
    return this.prisma.payment.create({
      data: {
        bookingId,
        amount,
        status: PaymentStatus.PENDING,
        provider: 'stub',
        splitMetadataJson: { providerHint: 'stripe|pagarme|asaas' },
      },
    });
  }

  // Placeholder for future gateway integration.
  async markAsPaid(paymentId: string) {
    return this.prisma.payment.update({ where: { id: paymentId }, data: { status: PaymentStatus.PAID } });
  }
}
