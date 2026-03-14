import { RoleGuard } from '@/components/role-guard';

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['CANDIDATE']}>{children}</RoleGuard>;
}
