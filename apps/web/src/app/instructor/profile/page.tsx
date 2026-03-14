import { DashboardShell } from '@/components/dashboard-shell';
import { InstructorProfileManager } from '@/components/instructor-profile-manager';

const nav = [
  { href: '/instructor/dashboard', label: 'Dashboard' },
  { href: '/instructor/profile', label: 'Meu perfil' },
  { href: '/instructor/vehicles', label: 'Veiculos' },
  { href: '/instructor/agenda', label: 'Agenda' },
  { href: '/instructor/bookings', label: 'Reservas' },
];

export default function InstructorProfilePage() {
  return (
    <DashboardShell title="Perfil do Instrutor" nav={nav}>
      <InstructorProfileManager />
    </DashboardShell>
  );
}
