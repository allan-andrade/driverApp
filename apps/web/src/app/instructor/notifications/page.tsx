'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationItem } from '@driver-school/types';
import { NotificationList } from '@/components/notification-list';
import { clientApiRequest } from '@/lib/client-api';

export default function InstructorNotificationsPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ['instructor-notifications-me'],
    queryFn: () => clientApiRequest<NotificationItem[]>('/notifications/me'),
  });

  const readAll = useMutation({
    mutationFn: () => clientApiRequest('/notifications/read-all', { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['instructor-notifications-me'] }),
  });

  return (
    <main className="shell py-10">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notificacoes do instrutor</h1>
        <button
          onClick={() => readAll.mutate()}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold"
        >
          Marcar todas como lidas
        </button>
      </div>
      {isLoading ? <p className="text-sm text-slate-500">Carregando...</p> : <NotificationList items={data} />}
    </main>
  );
}
