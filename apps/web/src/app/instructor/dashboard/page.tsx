import { DashboardShell } from '@/components/dashboard-shell';
import { InstructorDashboardSummary } from '@/components/instructor-dashboard-summary';

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
      <InstructorDashboardSummary />
    </DashboardShell>
  );
}
