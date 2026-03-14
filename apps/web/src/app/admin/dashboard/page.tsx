"use client";

import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@/components/dashboard-shell';
import { AnalyticsOverviewCards } from '@/components/analytics-overview-cards';
import { clientApiRequest } from '@/lib/client-api';

type AdminOverview = {
  totals: {
    totalUsers: number;
    totalInstructors: number;
    totalSchools: number;
    totalBookings: number;
    totalLessons: number;
    incidentsOpen: number;
    disputesOpen: number;
    documentsPending: number;
  };
  paymentsByStatus: Array<{ status: string; _count: { status: number } }>;
};

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/metrics', label: 'Metrics instrutores' },
  { href: '/admin/compliance', label: 'Revisao documental' },
  { href: '/admin/users', label: 'Usuarios' },
  { href: '/admin/instructors', label: 'Instrutores' },
  { href: '/admin/schools', label: 'Autoescolas' },
  { href: '/admin/state-policies', label: 'State policies' },
];

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-overview-dashboard'],
    queryFn: () => clientApiRequest<AdminOverview>('/analytics/admin/overview'),
  });

  const payments = (data?.paymentsByStatus ?? [])
    .map((item) => `${item.status}: ${item._count.status}`)
    .join(' • ');

  return (
    <DashboardShell title="Painel Admin" nav={nav}>
      {isLoading || !data ? (
        <div className="panel text-sm text-slate-500">Carregando analytics executivos...</div>
      ) : (
        <>
          <AnalyticsOverviewCards
            items={[
              { title: 'Usuarios', value: data.totals.totalUsers },
              { title: 'Instrutores', value: data.totals.totalInstructors, tone: 'emerald' },
              { title: 'Autoescolas', value: data.totals.totalSchools },
              { title: 'Reservas', value: data.totals.totalBookings },
              { title: 'Aulas', value: data.totals.totalLessons },
              { title: 'Incidentes em aberto', value: data.totals.incidentsOpen, tone: 'amber' },
              { title: 'Disputas em aberto', value: data.totals.disputesOpen, tone: 'amber' },
              { title: 'Docs pendentes', value: data.totals.documentsPending },
            ]}
          />
          <article className="panel">
            <h2 className="text-lg font-semibold">Distribuicao de pagamentos</h2>
            <p className="mt-2 text-sm text-slate-600">
              {payments || 'Nenhum pagamento consolidado no periodo.'}
            </p>
          </article>
        </>
      )}
    </DashboardShell>
  );
}
