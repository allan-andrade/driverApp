'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { BookingListItem } from '@driver-school/types';
import { clientApiRequest } from '@/lib/client-api';

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CandidateBookingsList() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading, isError } = useQuery({
    queryKey: ['candidate-bookings'],
    queryFn: () => clientApiRequest<BookingListItem[]>('/bookings/me'),
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) =>
      clientApiRequest(`/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['candidate-bookings'] });
    },
  });

  if (isLoading) {
    return <div className="panel text-sm text-slate-500">Carregando reservas...</div>;
  }

  if (isError) {
    return <div className="panel text-sm text-red-600">Nao foi possivel carregar as reservas.</div>;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <article key={booking.id} className="panel">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">{booking.status}</p>
              <h3 className="mt-1 text-lg font-semibold">{booking.package?.title ?? 'Aula avulsa'}</h3>
              <p className="mt-1 text-sm text-slate-600">
                Instrutor: {booking.instructorProfile?.user?.email ?? 'Nao definido'}
              </p>
              <p className="text-sm text-slate-600">
                Inicio: {formatDate(booking.scheduledStart)} | Fim: {formatDate(booking.scheduledEnd)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Valor</p>
              <p className="text-xl font-semibold">R$ {Number(booking.priceTotal).toFixed(2)}</p>
              <p className="text-xs text-slate-500">Taxa: R$ {Number(booking.platformFee).toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/candidate/bookings/${booking.id}`} className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">
              Ver detalhes
            </Link>
            {(booking.status === 'PENDING' || booking.status === 'CONFIRMED' || booking.status === 'RESCHEDULED') && (
              <button
                type="button"
                onClick={() => cancelMutation.mutate(booking.id)}
                disabled={cancelMutation.isPending}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Cancelar reserva
              </button>
            )}
          </div>
        </article>
      ))}

      {bookings.length === 0 && <div className="panel text-sm text-slate-500">Voce ainda nao possui reservas.</div>}
    </div>
  );
}
