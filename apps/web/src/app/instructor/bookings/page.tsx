import { DashboardShell } from '@/components/dashboard-shell';
import { InstructorBookingsList } from '@/components/instructor-bookings-list';

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
      <InstructorBookingsList />
    </DashboardShell>
  );
}
