import { DashboardShell } from '@/components/dashboard-shell';
import { CandidateBookingsList } from '@/components/candidate-bookings-list';

const nav = [
  { href: '/candidate/dashboard', label: 'Dashboard' },
  { href: '/candidate/profile', label: 'Perfil' },
  { href: '/candidate/bookings', label: 'Minhas reservas' },
  { href: '/candidate/bookings/new', label: 'Nova reserva' },
  { href: '/candidate/search', label: 'Buscar instrutores' },
];

export default function CandidateBookingsPage() {
  return (
    <DashboardShell title="Reservas" nav={nav}>
      <CandidateBookingsList />
    </DashboardShell>
  );
}
