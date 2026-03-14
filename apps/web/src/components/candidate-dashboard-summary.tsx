'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { CandidateAnalytics, NotificationItem } from '@driver-school/types';
import { AnalyticsOverviewCards } from './analytics-overview-cards';
import { NotificationBell } from './notification-bell';
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

export function CandidateDashboardSummary() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['candidate-analytics'],
    queryFn: () => clientApiRequest<CandidateAnalytics>('/analytics/candidate/me'),
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['candidate-notifications'],
    queryFn: () => clientApiRequest<NotificationItem[]>('/notifications/me'),
  });

  if (isLoading) {
    return <div className="panel text-sm text-slate-500">Carregando painel...</div>;
  }

  if (isError || !data) {
    return <div className="panel text-sm text-red-600">Nao foi possivel carregar seu dashboard.</div>;
  }

  const unreadCount = notifications.filter((item) => !item.readAt).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <NotificationBell unreadCount={unreadCount} />
      </div>

      <AnalyticsOverviewCards
        items={[
          { title: 'Proximas aulas', value: data.summary.upcomingLessons, tone: 'emerald' },
          { title: 'Aulas concluidas', value: data.summary.completedLessons },
          { title: 'Cancelamentos', value: data.summary.cancelledBookings, tone: 'amber' },
          { title: 'Progresso', value: `${data.summary.progress.toFixed(1)}%` },
        ]}
      />

      <article className="panel">
        <h2 className="text-lg font-semibold">Reservas recentes</h2>
        <div className="mt-3 space-y-2">
          {data.recentBookings.map((item) => (
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
          {data.recentBookings.length === 0 && <p className="text-sm text-slate-500">Sem aulas agendadas no momento.</p>}
        </div>
      </article>
    </div>
  );
}
