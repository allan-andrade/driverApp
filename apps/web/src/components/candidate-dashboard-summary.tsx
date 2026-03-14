'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { BookingListItem } from '@driver-school/types';
import { clientApiRequest } from '@/lib/client-api';

type CandidateDashboardResponse = {
  upcoming: Array<{ id: string; status: string; scheduledStart: string; priceTotal: number }>;
  history: Array<{ id: string; status: string; scheduledStart: string }>;
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

export function CandidateDashboardSummary() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['candidate-dashboard'],
    queryFn: () => clientApiRequest<CandidateDashboardResponse>('/dashboard/candidate'),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['candidate-dashboard-bookings-count'],
    queryFn: () => clientApiRequest<BookingListItem[]>('/bookings/me'),
  });

  if (isLoading) {
    return <div className="panel text-sm text-slate-500">Carregando painel...</div>;
  }

  if (isError || !data) {
    return <div className="panel text-sm text-red-600">Nao foi possivel carregar seu dashboard.</div>;
  }

  const activeCount = bookings.filter((item) => ['PENDING', 'CONFIRMED', 'RESCHEDULED'].includes(item.status)).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <article className="panel">
          <p className="text-xs text-slate-500">Reservas ativas</p>
          <p className="mt-2 text-2xl font-bold">{activeCount}</p>
        </article>
        <article className="panel">
          <p className="text-xs text-slate-500">Proximas aulas</p>
          <p className="mt-2 text-2xl font-bold">{data.upcoming.length}</p>
        </article>
        <article className="panel">
          <p className="text-xs text-slate-500">Historico recente</p>
          <p className="mt-2 text-2xl font-bold">{data.history.length}</p>
        </article>
      </div>

      <article className="panel">
        <h2 className="text-lg font-semibold">Proximas aulas</h2>
        <div className="mt-3 space-y-2">
          {data.upcoming.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3 text-sm">
              <div>
                <p className="font-medium">{formatDate(item.scheduledStart)}</p>
                <p className="text-slate-500">Status: {item.status}</p>
              </div>
              <Link href={`/candidate/bookings/${item.id}`} className="rounded-lg bg-slate-100 px-3 py-1.5 font-medium text-slate-800">
                Abrir reserva
              </Link>
            </div>
          ))}
          {data.upcoming.length === 0 && <p className="text-sm text-slate-500">Sem aulas agendadas no momento.</p>}
        </div>
      </article>
    </div>
  );
}
