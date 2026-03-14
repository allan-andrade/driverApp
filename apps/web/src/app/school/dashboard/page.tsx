import { DashboardShell } from '@/components/dashboard-shell';
import { QueryPanel } from '@/components/query-panel';

const nav = [
  { href: '/school/dashboard', label: 'Dashboard' },
  { href: '/school/profile', label: 'Perfil da escola' },
  { href: '/school/instructors', label: 'Instrutores vinculados' },
  { href: '/school/bookings', label: 'Reservas' },
];

export default function SchoolDashboardPage() {
  return (
    <DashboardShell title="Area da Autoescola" nav={nav}>
      <QueryPanel title="Visao operacional" path="/dashboard/school" />
    </DashboardShell>
  );
}
