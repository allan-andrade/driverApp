import { RoleGuard } from '@/components/role-guard';

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['INSTRUCTOR']}>{children}</RoleGuard>;
}
