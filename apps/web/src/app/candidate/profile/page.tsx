import { DashboardShell } from '@/components/dashboard-shell';
import { QueryPanel } from '@/components/query-panel';

const nav = [
  { href: '/candidate/dashboard', label: 'Dashboard' },
  { href: '/candidate/profile', label: 'Perfil' },
  { href: '/candidate/bookings', label: 'Minhas reservas' },
  { href: '/candidate/bookings/new', label: 'Nova reserva' },
  { href: '/candidate/search', label: 'Buscar instrutores' },
];

export default function CandidateProfilePage() {
  return (
    <DashboardShell title="Perfil do Candidato" nav={nav}>
      <QueryPanel title="Dados do perfil" path="/candidates/me" />
    </DashboardShell>
  );
}
