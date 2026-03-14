import { DashboardShell } from '@/components/dashboard-shell';
import { CandidateDashboardSummary } from '@/components/candidate-dashboard-summary';

const nav = [
  { href: '/candidate/dashboard', label: 'Dashboard' },
  { href: '/candidate/notifications', label: 'Notificacoes' },
  { href: '/candidate/preferences', label: 'Preferencias' },
  { href: '/candidate/profile', label: 'Perfil' },
  { href: '/candidate/bookings', label: 'Minhas reservas' },
  { href: '/candidate/bookings/new', label: 'Nova reserva' },
  { href: '/candidate/search', label: 'Buscar instrutores' },
];

export default function CandidateDashboardPage() {
  return (
    <DashboardShell title="Area do Candidato" nav={nav}>
      <CandidateDashboardSummary />
    </DashboardShell>
  );
}
