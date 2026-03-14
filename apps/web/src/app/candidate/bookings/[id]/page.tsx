import { DashboardShell } from '@/components/dashboard-shell';
import { CandidateBookingDetails } from '@/components/candidate-booking-details';

const nav = [
  { href: '/candidate/dashboard', label: 'Dashboard' },
  { href: '/candidate/profile', label: 'Perfil' },
  { href: '/candidate/bookings', label: 'Minhas reservas' },
  { href: '/candidate/search', label: 'Buscar instrutores' },
];

export default function CandidateBookingDetailsPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell title="Detalhe da Reserva" nav={nav}>
      <CandidateBookingDetails bookingId={params.id} />
    </DashboardShell>
  );
}
