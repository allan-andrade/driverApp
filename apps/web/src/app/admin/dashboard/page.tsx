import { DashboardShell } from '@/components/dashboard-shell';
import { QueryPanel } from '@/components/query-panel';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/users', label: 'Usuarios' },
  { href: '/admin/instructors', label: 'Instrutores' },
  { href: '/admin/schools', label: 'Autoescolas' },
  { href: '/admin/state-policies', label: 'State policies' },
];

export default function AdminDashboardPage() {
  return (
    <DashboardShell title="Painel Admin" nav={nav}>
      <QueryPanel title="Indicadores principais" path="/dashboard/admin" />
    </DashboardShell>
  );
}
