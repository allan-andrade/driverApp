'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { BookingListItem } from '@driver-school/types';
import { clientApiRequest } from '@/lib/client-api';

type InstructorDashboardResponse = {
  agenda: Array<{ id: string; weekday: number; startTime: string; endTime: string; isActive: boolean }>;
  bookings: Array<{ id: string; status: string; scheduledStart: string; scheduledEnd: string }>;
};

const weekdayLabel: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terca',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sabado',
};

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function InstructorDashboardSummary() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['instructor-dashboard'],
    queryFn: () => clientApiRequest<InstructorDashboardResponse>('/dashboard/instructor'),
  });

  const { data: myBookings = [] } = useQuery({
    queryKey: ['instructor-bookings-counter'],
    queryFn: () => clientApiRequest<BookingListItem[]>('/instructors/me/bookings'),
  });

  if (isLoading) {
    return <div className="panel text-sm text-slate-500">Carregando dashboard...</div>;
  }

  if (isError || !data) {
    return <div className="panel text-sm text-red-600">Nao foi possivel carregar o dashboard do instrutor.</div>;
  }

  const activeBookings = myBookings.filter((item) => ['PENDING', 'CONFIRMED', 'RESCHEDULED'].includes(item.status)).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <article className="panel">
          <p className="text-xs text-slate-500">Reservas ativas</p>
          <p className="mt-2 text-2xl font-bold">{activeBookings}</p>
        </article>
        <article className="panel">
          <p className="text-xs text-slate-500">Slots de agenda</p>
          <p className="mt-2 text-2xl font-bold">{data.agenda.length}</p>
        </article>
        <article className="panel">
          <p className="text-xs text-slate-500">Proximas reservas</p>
          <p className="mt-2 text-2xl font-bold">{data.bookings.length}</p>
        </article>
      </div>

      <article className="panel">
        <h2 className="text-lg font-semibold">Agenda ativa</h2>
        <div className="mt-3 space-y-2">
          {data.agenda.map((slot) => (
            <div key={slot.id} className="rounded-xl border border-slate-200 p-3 text-sm">
              {weekdayLabel[slot.weekday]} • {slot.startTime} - {slot.endTime} • {slot.isActive ? 'Ativo' : 'Inativo'}
            </div>
          ))}
          {data.agenda.length === 0 && <p className="text-sm text-slate-500">Nenhum slot ativo cadastrado.</p>}
        </div>
      </article>

      <article className="panel">
        <h2 className="text-lg font-semibold">Reservas recentes</h2>
        <div className="mt-3 space-y-2">
          {data.bookings.slice(0, 5).map((booking) => (
            <div key={booking.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 text-sm">
              <p>
                {formatDate(booking.scheduledStart)} • {booking.status}
              </p>
              <Link href="/instructor/bookings" className="rounded-lg bg-slate-100 px-3 py-1.5 font-medium">
                Ver reservas
              </Link>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
