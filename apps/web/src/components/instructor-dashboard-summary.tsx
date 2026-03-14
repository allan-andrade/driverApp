'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { InstructorAnalytics, Wallet } from '@driver-school/types';
import { AnalyticsOverviewCards } from './analytics-overview-cards';
import { TeachingScoreBadge } from './teaching-score-badge';
import { TrustScoreBadge } from './trust-score-badge';
import { WalletSummaryCard } from './wallet-summary-card';
import { clientApiRequest } from '@/lib/client-api';

type LessonsResponse = Array<{ id: string; status: string; bookingId: string; createdAt: string }>;

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
    queryKey: ['instructor-analytics'],
    queryFn: () => clientApiRequest<InstructorAnalytics>('/analytics/instructor/me'),
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ['instructor-lessons-recent'],
    queryFn: () => clientApiRequest<LessonsResponse>('/lessons/me'),
  });

  const { data: wallet } = useQuery({
    queryKey: ['instructor-wallet'],
    queryFn: () => clientApiRequest<Wallet>('/wallets/me'),
  });

  if (isLoading) {
    return <div className="panel text-sm text-slate-500">Carregando dashboard...</div>;
  }

  if (isError || !data) {
    return <div className="panel text-sm text-red-600">Nao foi possivel carregar o dashboard do instrutor.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <TrustScoreBadge score={data.summary.trustScore} />
        <TeachingScoreBadge score={data.summary.teachingScore} />
      </div>

      <AnalyticsOverviewCards
        items={[
          { title: 'Reservas', value: data.summary.bookingsTotal },
          { title: 'Aulas concluidas', value: data.summary.completedLessons, tone: 'emerald' },
          { title: 'No-show', value: data.summary.noShows, tone: 'amber' },
          { title: 'Ocupacao', value: `${data.summary.agendaOccupancy.toFixed(1)}%` },
        ]}
      />

      {wallet && <WalletSummaryCard wallet={wallet} />}

      <article className="panel">
        <h2 className="text-lg font-semibold">Aulas recentes</h2>
        <div className="mt-3 space-y-2">
          {lessons.slice(0, 5).map((lesson) => (
            <div key={lesson.id} className="rounded-xl border border-slate-200 p-3 text-sm">
              {formatDate(lesson.createdAt)} • {lesson.status}
            </div>
          ))}
          {lessons.length === 0 && <p className="text-sm text-slate-500">Nenhuma aula encontrada.</p>}
        </div>
      </article>

      <article className="panel">
        <h2 className="text-lg font-semibold">Operacao financeira</h2>
        <p className="mt-2 text-sm text-slate-600">
          Receita bruta estimada: R$ {data.revenue.gross.toFixed(2)} • pendente: R$ {data.revenue.pending.toFixed(2)} • disponivel: R$ {data.revenue.available.toFixed(2)}
        </p>
        <Link href="/instructor/wallet" className="mt-3 inline-flex rounded-lg bg-slate-100 px-3 py-1.5 font-medium">
          Ver wallet completa
        </Link>
      </article>
    </div>
  );
}
