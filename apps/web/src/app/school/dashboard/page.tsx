import { DashboardShell } from '@/components/dashboard-shell';
import { QueryPanel } from '@/components/query-panel';

const nav = [
  { href: '/school/dashboard', label: 'Dashboard' },
  { href: '/school/compliance', label: 'Compliance' },
  { href: '/school/notifications', label: 'Notificacoes' },
  { href: '/school/profile', label: 'Perfil da escola' },
  { href: '/school/instructors', label: 'Instrutores vinculados' },
  { href: '/school/bookings', label: 'Reservas' },
];

export default function SchoolDashboardPage() {
  return (
    <DashboardShell title="Area da Autoescola" nav={nav}>
      <QueryPanel title="Analytics da autoescola" path="/analytics/school/me" />
    </DashboardShell>
  );
}
