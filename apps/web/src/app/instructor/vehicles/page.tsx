import { DashboardShell } from '@/components/dashboard-shell';
import { InstructorVehiclesManager } from '@/components/instructor-vehicles-manager';

const nav = [
  { href: '/instructor/dashboard', label: 'Dashboard' },
  { href: '/instructor/profile', label: 'Meu perfil' },
  { href: '/instructor/vehicles', label: 'Veiculos' },
  { href: '/instructor/agenda', label: 'Agenda' },
  { href: '/instructor/bookings', label: 'Reservas' },
];

export default function InstructorVehiclesPage() {
  return (
    <DashboardShell title="Meus Veiculos" nav={nav}>
      <InstructorVehiclesManager />
    </DashboardShell>
  );
}
