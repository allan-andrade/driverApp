import { CandidateBookingForm } from '@/components/candidate-booking-form';
import { DashboardShell } from '@/components/dashboard-shell';

const nav = [
  { href: '/candidate/dashboard', label: 'Dashboard' },
  { href: '/candidate/profile', label: 'Perfil' },
  { href: '/candidate/bookings', label: 'Minhas reservas' },
  { href: '/candidate/bookings/new', label: 'Nova reserva' },
  { href: '/candidate/search', label: 'Buscar instrutores' },
];

export default function CandidateNewBookingPage({
  searchParams,
}: {
  searchParams: { instructorId?: string; packageId?: string };
}) {
  return (
    <DashboardShell title="Criar Reserva" nav={nav}>
      <CandidateBookingForm
        initialInstructorProfileId={searchParams.instructorId}
        initialPackageId={searchParams.packageId}
      />
    </DashboardShell>
  );
}
