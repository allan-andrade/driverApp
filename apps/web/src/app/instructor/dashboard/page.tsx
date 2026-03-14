import { DashboardShell } from '@/components/dashboard-shell';
import { QueryPanel } from '@/components/query-panel';

const nav = [
  { href: '/instructor/dashboard', label: 'Dashboard' },
  { href: '/instructor/profile', label: 'Meu perfil' },
  { href: '/instructor/vehicles', label: 'Veiculos' },
  { href: '/instructor/agenda', label: 'Agenda' },
  { href: '/instructor/bookings', label: 'Reservas' },
];

export default function InstructorDashboardPage() {
  return (
    <DashboardShell title="Area do Instrutor" nav={nav}>
      <QueryPanel title="Agenda e reservas" path="/dashboard/instructor" />
    </DashboardShell>
  );
}
