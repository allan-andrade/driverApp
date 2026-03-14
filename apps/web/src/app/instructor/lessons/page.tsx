import { DashboardShell } from '@/components/dashboard-shell';
import { InstructorLessonsOps } from '@/components/instructor-lessons-ops';

const nav = [
  { href: '/instructor/dashboard', label: 'Dashboard' },
  { href: '/instructor/profile', label: 'Meu perfil' },
  { href: '/instructor/vehicles', label: 'Veiculos' },
  { href: '/instructor/agenda', label: 'Agenda' },
  { href: '/instructor/bookings', label: 'Reservas' },
  { href: '/instructor/lessons', label: 'Execucao de aulas' },
];

export default function InstructorLessonsPage() {
  return (
    <DashboardShell title="Execucao de Aulas" nav={nav}>
      <InstructorLessonsOps />
    </DashboardShell>
  );
}
