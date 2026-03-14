'use client';

import { useQuery } from '@tanstack/react-query';
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

export function InstructorBookingsList() {
  const { data: bookings = [], isLoading, isError } = useQuery({
    queryKey: ['instructor-bookings-list'],
    queryFn: () => clientApiRequest<BookingListItem[]>('/instructors/me/bookings'),
  });

  if (isLoading) {
    return <div className="panel text-sm text-slate-500">Carregando reservas...</div>;
  }

  if (isError) {
    return <div className="panel text-sm text-red-600">Nao foi possivel carregar as reservas.</div>;
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <article key={booking.id} className="panel">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">{booking.status}</p>
              <h3 className="mt-1 text-lg font-semibold">{booking.package?.title ?? 'Aula avulsa'}</h3>
              <p className="text-sm text-slate-600">Candidato: {booking.candidateProfile.fullName}</p>
              <p className="text-sm text-slate-600">
                {formatDate(booking.scheduledStart)} ate {formatDate(booking.scheduledEnd)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Valor</p>
              <p className="text-xl font-semibold">R$ {Number(booking.priceTotal).toFixed(2)}</p>
            </div>
          </div>
        </article>
      ))}

      {bookings.length === 0 && <div className="panel text-sm text-slate-500">Nenhuma reserva recebida ainda.</div>}
    </div>
  );
}
