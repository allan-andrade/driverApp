import { DashboardShell } from '@/components/dashboard-shell';
import { QueryPanel } from '@/components/query-panel';

const nav = [
  { href: '/instructor/dashboard', label: 'Dashboard' },
  { href: '/instructor/profile', label: 'Meu perfil' },
  { href: '/instructor/vehicles', label: 'Veiculos' },
  { href: '/instructor/agenda', label: 'Agenda' },
  { href: '/instructor/bookings', label: 'Reservas' },
];

export default function InstructorAgendaPage() {
  return (
    <DashboardShell title="Agenda do Instrutor" nav={nav}>
      <QueryPanel title="Slots ativos" path="/availability/slots" />
    </DashboardShell>
  );
}
