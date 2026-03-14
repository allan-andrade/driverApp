import { CandidateOperationsPanel } from '@/components/candidate-operations-panel';
import { DashboardShell } from '@/components/dashboard-shell';

const nav = [
  { href: '/candidate/dashboard', label: 'Dashboard' },
  { href: '/candidate/profile', label: 'Perfil' },
  { href: '/candidate/bookings', label: 'Minhas reservas' },
  { href: '/candidate/bookings/new', label: 'Nova reserva' },
  { href: '/candidate/search', label: 'Buscar instrutores' },
  { href: '/candidate/operations', label: 'Operacoes Fase 3' },
];

export default function CandidateOperationsPage() {
  return (
    <DashboardShell title="Operacoes do Candidato" nav={nav}>
      <CandidateOperationsPanel />
    </DashboardShell>
  );
}
