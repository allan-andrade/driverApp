import { DashboardShell } from '@/components/dashboard-shell';
import { QueryPanel } from '@/components/query-panel';

const nav = [
  { href: '/candidate/dashboard', label: 'Dashboard' },
  { href: '/candidate/profile', label: 'Perfil' },
  { href: '/candidate/bookings', label: 'Minhas reservas' },
  { href: '/candidate/search', label: 'Buscar instrutores' },
];

export default function CandidateBookingDetailsPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell title="Detalhe da Reserva" nav={nav}>
      <QueryPanel title="Detalhe" path={`/bookings/${params.id}`} />
    </DashboardShell>
  );
}
