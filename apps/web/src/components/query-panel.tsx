'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApiRequest } from '@/lib/client-api';

export function QueryPanel({ title, path }: { title: string; path: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: [path],
    queryFn: () => clientApiRequest<unknown>(path),
  });

  return (
    <div className="panel">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {isLoading && <p className="text-sm text-slate-500">Carregando...</p>}
      {error && <p className="text-sm text-red-600">Falha ao carregar. Verifique login/token.</p>}
      {!isLoading && !error && (
        <pre className="max-h-96 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-200">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
