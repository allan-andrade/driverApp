'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { clientApiRequest } from '@/lib/client-api';

type Role = 'ADMIN' | 'CANDIDATE' | 'INSTRUCTOR' | 'SCHOOL_MANAGER';

export function RoleGuard({ allowedRoles, children }: { allowedRoles: Role[]; children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const validate = async () => {
      try {
        const session = await clientApiRequest<{ role: Role }>('/auth/me');
        if (!allowedRoles.includes(session.role)) {
          router.replace('/login');
          return;
        }

        if (mounted) {
          setLoading(false);
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.replace('/login');
      }
    };

    void validate();

    return () => {
      mounted = false;
    };
  }, [allowedRoles, router]);

  if (loading) {
    return (
      <div className="shell py-20">
        <div className="panel text-center text-sm text-slate-500">Validando sessao...</div>
      </div>
    );
  }

  return <>{children}</>;
}
