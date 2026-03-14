import { RoleGuard } from '@/components/role-guard';

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['SCHOOL_MANAGER']}>{children}</RoleGuard>;
}
