'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { NotificationPreference } from '@driver-school/types';
import { clientApiRequest } from '@/lib/client-api';

type PreferenceKey = keyof Pick<
  NotificationPreference,
  'inAppEnabled' | 'bookingUpdates' | 'lessonUpdates' | 'paymentUpdates' | 'safetyAlerts' | 'marketingEnabled'
>;

const toggles: Array<{ key: PreferenceKey; label: string }> = [
  { key: 'inAppEnabled', label: 'Notificacoes in-app' },
  { key: 'bookingUpdates', label: 'Atualizacoes de reserva' },
  { key: 'lessonUpdates', label: 'Atualizacoes de aula' },
  { key: 'paymentUpdates', label: 'Atualizacoes de pagamento' },
  { key: 'safetyAlerts', label: 'Alertas de seguranca/compliance' },
  { key: 'marketingEnabled', label: 'Mensagens promocionais' },
];

export default function CandidatePreferencesPage() {
  const { data, refetch } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: () => clientApiRequest<NotificationPreference>('/notification-preferences/me'),
  });

  const mutation = useMutation({
    mutationFn: (payload: Partial<NotificationPreference>) =>
      clientApiRequest('/notification-preferences/me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => refetch(),
  });

  return (
    <main className="shell py-10">
      <h1 className="text-2xl font-bold">Preferencias de notificacao</h1>
      <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
        {toggles.map((toggle) => (
          <label key={toggle.key} className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 p-3">
            <span className="text-sm">{toggle.label}</span>
            <input
              type="checkbox"
              checked={Boolean(data?.[toggle.key])}
              onChange={(event) => mutation.mutate({ [toggle.key]: event.target.checked })}
            />
          </label>
        ))}
      </div>
    </main>
  );
}
