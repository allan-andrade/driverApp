import { AdminOperationsPanel } from '@/components/admin-operations-panel';
import { DashboardShell } from '@/components/dashboard-shell';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/users', label: 'Usuarios' },
  { href: '/admin/instructors', label: 'Instrutores' },
  { href: '/admin/schools', label: 'Autoescolas' },
  { href: '/admin/state-policies', label: 'State policies' },
  { href: '/admin/operations', label: 'Operacoes Fase 3' },
];

export default function AdminOperationsPage() {
  return (
    <DashboardShell title="Operacoes Financeiras e Compliance" nav={nav}>
      <AdminOperationsPanel />
    </DashboardShell>
  );
}
