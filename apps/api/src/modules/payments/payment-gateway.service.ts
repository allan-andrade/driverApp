import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PaymentStatus, WebhookProvider } from '@prisma/client';

type ParsedWebhookEvent = {
  eventType: string;
  providerReference?: string;
  paymentReference?: string;
  status?: PaymentStatus;
};

@Injectable()
export class PaymentGatewayService {
  private mapToWebhookProvider(provider: string): WebhookProvider {
    const normalized = provider.toLowerCase();

    if (normalized === 'stripe') return WebhookProvider.STRIPE;
    if (normalized === 'pagarme') return WebhookProvider.PAGARME;
    if (normalized === 'asaas') return WebhookProvider.ASAAS;

    throw new BadRequestException('Unsupported payment provider. Use stripe, pagarme or asaas.');
  }

  toWebhookProvider(provider: string) {
    return this.mapToWebhookProvider(provider);
  }

  async createCheckout(params: {
    provider: string;
    amount: number;
    currency: string;
    paymentId: string;
    bookingId: string;
    returnUrl?: string;
  }) {
    const provider = params.provider.toLowerCase();

    if (provider === 'stripe') {
      return this.createStripeCheckout(params);
    }

    if (provider === 'pagarme') {
      return this.createPagarmeCheckout(params);
    }

    if (provider === 'asaas') {
      return this.createAsaasCheckout(params);
    }

    throw new BadRequestException('Unsupported payment provider. Use stripe, pagarme or asaas.');
  }

  validateWebhook(provider: string, payload: Record<string, unknown>, headers: Record<string, string | string[] | undefined>) {
    const normalizedProvider = this.mapToWebhookProvider(provider);

    if (normalizedProvider === WebhookProvider.STRIPE) {
      const configuredSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (configuredSecret) {
        const signature = this.header(headers, 'stripe-signature');
        if (!signature) {
          throw new UnauthorizedException('Missing Stripe signature header.');
        }
      }
      return;
    }

    if (normalizedProvider === WebhookProvider.PAGARME) {
      const configuredSecret = process.env.PAGARME_WEBHOOK_SECRET;
      if (configuredSecret) {
        const signature = this.header(headers, 'x-hub-signature');
        if (!signature || signature !== configuredSecret) {
          throw new UnauthorizedException('Invalid Pagar.me webhook signature.');
        }
      }
      return;
    }

    const configuredSecret = process.env.ASAAS_WEBHOOK_SECRET;
    if (configuredSecret) {
      const token = this.header(headers, 'asaas-access-token');
      if (!token || token !== configuredSecret) {
        throw new UnauthorizedException('Invalid Asaas webhook token.');
      }
    }
  }

  parseWebhook(provider: string, payload: Record<string, unknown>): ParsedWebhookEvent {
    const normalizedProvider = this.mapToWebhookProvider(provider);

    if (normalizedProvider === WebhookProvider.STRIPE) {
      const eventType = this.stringValue(payload.type) ?? 'stripe.unknown';
      const data = this.objectValue(payload.data);
      const objectData = this.objectValue(data?.object);
      const paymentReference = this.stringValue(objectData?.id);

      return {
        eventType,
        providerReference: this.stringValue(payload.id),
        paymentReference,
        status: this.mapStripeStatus(eventType),
      };
    }

    if (normalizedProvider === WebhookProvider.PAGARME) {
      const eventType = this.stringValue(payload.type) ?? 'pagarme.unknown';
      const data = this.objectValue(payload.data);
      const paymentReference = this.stringValue(data?.id) ?? this.stringValue(payload.id);

      return {
        eventType,
        providerReference: this.stringValue(payload.id),
        paymentReference,
        status: this.mapPagarmeStatus(eventType),
      };
    }

    const eventType = this.stringValue(payload.event) ?? this.stringValue(payload.type) ?? 'asaas.unknown';
    const payment = this.objectValue(payload.payment);
    const paymentReference = this.stringValue(payment?.id) ?? this.stringValue(payload.id);

    return {
      eventType,
      providerReference: this.stringValue(payload.id),
      paymentReference,
      status: this.mapAsaasStatus(eventType),
    };
  }

  private async createStripeCheckout(params: {
    amount: number;
    currency: string;
    paymentId: string;
    bookingId: string;
    returnUrl?: string;
  }) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return {
        provider: 'stripe',
        providerPaymentId: `stripe_mock_${params.paymentId}`,
        providerReference: `stripe_mock_${params.paymentId}`,
        checkoutUrl: params.returnUrl ?? null,
        rawResponse: { mocked: true, reason: 'STRIPE_SECRET_KEY missing' },
      };
    }

    const body = new URLSearchParams();
    body.append('amount', String(Math.round(params.amount * 100)));
    body.append('currency', params.currency.toLowerCase());
    body.append('metadata[paymentId]', params.paymentId);
    body.append('metadata[bookingId]', params.bookingId);
    body.append('automatic_payment_methods[enabled]', 'true');

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const json = (await response.json()) as Record<string, unknown>;
    if (!response.ok) {
      throw new BadRequestException(`Stripe checkout creation failed: ${JSON.stringify(json)}`);
    }

    const id = this.stringValue(json.id);
    if (!id) {
      throw new BadRequestException('Stripe response missing payment id.');
    }

    return {
      provider: 'stripe',
      providerPaymentId: id,
      providerReference: id,
      checkoutUrl: this.stringValue(json.client_secret) ?? null,
      rawResponse: json,
    };
  }

  private async createPagarmeCheckout(params: {
    amount: number;
    currency: string;
    paymentId: string;
    bookingId: string;
    returnUrl?: string;
  }) {
    const key = process.env.PAGARME_API_KEY;
    if (!key) {
      return {
        provider: 'pagarme',
        providerPaymentId: `pagarme_mock_${params.paymentId}`,
        providerReference: `pagarme_mock_${params.paymentId}`,
        checkoutUrl: params.returnUrl ?? null,
        rawResponse: { mocked: true, reason: 'PAGARME_API_KEY missing' },
      };
    }

    return {
      provider: 'pagarme',
      providerPaymentId: `pagarme_${params.paymentId}`,
      providerReference: `pagarme_${params.paymentId}`,
      checkoutUrl: params.returnUrl ?? null,
      rawResponse: {
        mocked: true,
        reason: 'Pagar.me integration skeleton enabled; wire official API payloads for production.',
      },
    };
  }

  private async createAsaasCheckout(params: {
    amount: number;
    currency: string;
    paymentId: string;
    bookingId: string;
    returnUrl?: string;
  }) {
    const key = process.env.ASAAS_API_KEY;
    if (!key) {
      return {
        provider: 'asaas',
        providerPaymentId: `asaas_mock_${params.paymentId}`,
        providerReference: `asaas_mock_${params.paymentId}`,
        checkoutUrl: params.returnUrl ?? null,
        rawResponse: { mocked: true, reason: 'ASAAS_API_KEY missing' },
      };
    }

    return {
      provider: 'asaas',
      providerPaymentId: `asaas_${params.paymentId}`,
      providerReference: `asaas_${params.paymentId}`,
      checkoutUrl: params.returnUrl ?? null,
      rawResponse: {
        mocked: true,
        reason: 'Asaas integration skeleton enabled; wire official API payloads for production.',
      },
    };
  }

  private mapStripeStatus(eventType: string) {
    if (eventType === 'payment_intent.succeeded') return PaymentStatus.PAID;
    if (eventType === 'payment_intent.payment_failed') return PaymentStatus.FAILED;
    if (eventType === 'payment_intent.canceled') return PaymentStatus.CANCELLED;
    if (eventType === 'payment_intent.processing') return PaymentStatus.AUTHORIZED;
    return undefined;
  }

  private mapPagarmeStatus(eventType: string) {
    if (eventType.includes('paid')) return PaymentStatus.PAID;
    if (eventType.includes('failed')) return PaymentStatus.FAILED;
    if (eventType.includes('canceled') || eventType.includes('cancelled')) return PaymentStatus.CANCELLED;
    if (eventType.includes('authorized')) return PaymentStatus.AUTHORIZED;
    return undefined;
  }

  private mapAsaasStatus(eventType: string) {
    if (eventType.includes('RECEIVED') || eventType.includes('CONFIRMED')) return PaymentStatus.PAID;
    if (eventType.includes('REFUNDED')) return PaymentStatus.REFUNDED;
    if (eventType.includes('OVERDUE') || eventType.includes('DELETED')) return PaymentStatus.CANCELLED;
    return undefined;
  }

  private header(headers: Record<string, string | string[] | undefined>, key: string) {
    const direct = headers[key];
    if (typeof direct === 'string') return direct;
    if (Array.isArray(direct)) return direct[0];

    const lowerKey = key.toLowerCase();
    for (const [headerKey, value] of Object.entries(headers)) {
      if (headerKey.toLowerCase() !== lowerKey) continue;
      if (typeof value === 'string') return value;
      if (Array.isArray(value)) return value[0];
    }

    return undefined;
  }

  private objectValue(value: unknown): Record<string, unknown> | undefined {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return undefined;
    }

    return value as Record<string, unknown>;
  }

  private stringValue(value: unknown): string | undefined {
    return typeof value === 'string' ? value : undefined;
  }
}
