import { DashboardShell } from '@/components/dashboard-shell';
import { QueryPanel } from '@/components/query-panel';

const nav = [
  { href: '/instructor/dashboard', label: 'Dashboard' },
  { href: '/instructor/profile', label: 'Meu perfil' },
  { href: '/instructor/vehicles', label: 'Veiculos' },
  { href: '/instructor/agenda', label: 'Agenda' },
  { href: '/instructor/bookings', label: 'Reservas' },
];

export default function InstructorBookingsPage() {
  return (
    <DashboardShell title="Reservas do Instrutor" nav={nav}>
      <QueryPanel title="Reservas" path="/bookings/me" />
      <QueryPanel title="Aulas" path="/lessons/me" />
    </DashboardShell>
  );
}
