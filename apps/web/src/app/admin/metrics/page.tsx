'use client';

import { useQuery } from '@tanstack/react-query';
import { InstructorMetrics } from '@driver-school/types';
import { InstructorMetricsPanel } from '@/components/instructor-metrics-panel';
import { clientApiRequest } from '@/lib/client-api';

export default function AdminMetricsPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['admin-instructor-metrics'],
    queryFn: () => clientApiRequest<Array<InstructorMetrics & { instructorProfile: { id: string; user: { email: string } } }>>('/admin/instructor-metrics'),
  });

  return (
    <main className="shell space-y-4 py-10">
      <h1 className="text-2xl font-bold">Metrics de instrutores</h1>
      {isLoading && <p className="text-sm text-slate-500">Carregando...</p>}
      <div className="grid gap-3">
        {data.map((item) => (
          <div key={item.id} className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold">{item.instructorProfile?.user?.email ?? item.instructorProfileId}</p>
            <InstructorMetricsPanel metrics={item} />
          </div>
        ))}
      </div>
    </main>
  );
}
