'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { CheckoutResponse } from '@driver-school/types';
import { clientApiRequest } from '@/lib/client-api';

type Provider = 'stripe' | 'pagarme' | 'asaas';

export function CheckoutWorkbench({ paymentId }: { paymentId: string }) {
  const [provider, setProvider] = useState<Provider>('stripe');
  const queryClient = useQueryClient();

  const checkout = useMutation({
    mutationFn: () =>
      clientApiRequest<CheckoutResponse>(`/payments/${paymentId}/checkout`, {
        method: 'POST',
        body: JSON.stringify({ provider, method: 'PIX' }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-booking-detail'] });
      queryClient.invalidateQueries({ queryKey: ['candidate-bookings'] });
    },
  });

  return (
    <article className="panel space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Checkout</p>
        <h3 className="mt-1 text-lg font-semibold text-ink">Pagamento integrado</h3>
        <p className="mt-1 text-sm text-slate-600">Inicie o fluxo de pagamento com provider real/foundation e receba atualizacoes por webhook.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {(['stripe', 'pagarme', 'asaas'] as Provider[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setProvider(item)}
            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
              provider === item
                ? 'border-ink bg-ink text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => checkout.mutate()}
        disabled={checkout.isPending}
        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {checkout.isPending ? 'Iniciando checkout...' : 'Iniciar checkout'}
      </button>

      {checkout.data && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          <p className="font-semibold">Checkout criado com sucesso</p>
          <p className="mt-1">Provider: {checkout.data.provider}</p>
          <p>Referencia: {checkout.data.providerReference}</p>
          <p>Status atual: {checkout.data.status}</p>
          {checkout.data.checkoutUrl && <p className="break-all">Token/URL: {checkout.data.checkoutUrl}</p>}
        </div>
      )}

      {checkout.isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          Falha ao iniciar checkout. Verifique permissao e estado do pagamento.
        </div>
      )}
    </article>
  );
}
