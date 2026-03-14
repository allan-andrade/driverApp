import { DashboardShell } from '@/components/dashboard-shell';
import { QueryPanel } from '@/components/query-panel';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/users', label: 'Usuarios' },
  { href: '/admin/instructors', label: 'Instrutores' },
  { href: '/admin/schools', label: 'Autoescolas' },
  { href: '/admin/state-policies', label: 'State policies' },
];

export default function AdminUsersPage() {
  return (
    <DashboardShell title="Usuarios" nav={nav}>
      <QueryPanel title="Lista de usuarios" path="/admin/users" />
    </DashboardShell>
  );
}
