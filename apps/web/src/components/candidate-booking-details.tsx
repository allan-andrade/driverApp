'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApiRequest } from '@/lib/client-api';

type BookingDetail = {
  id: string;
  status: string;
  scheduledStart: string;
  scheduledEnd: string;
  priceTotal: number;
  platformFee: number;
  package: {
    id: string;
    title: string;
    lessonCount: number;
    durationMinutes: number;
    category: string;
  } | null;
  candidateProfile: {
    id: string;
    fullName: string;
  };
  instructorProfile: {
    id: string;
    user: {
      email: string;
    };
  } | null;
  lessons: Array<{
    id: string;
    status: string;
    pinCode?: string;
    startedAt?: string | null;
    finishedAt?: string | null;
  }>;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CandidateBookingDetails({ bookingId }: { bookingId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['candidate-booking-detail', bookingId],
    queryFn: () => clientApiRequest<BookingDetail>(`/bookings/${bookingId}`),
  });

  if (isLoading) {
    return <div className="panel text-sm text-slate-500">Carregando detalhes da reserva...</div>;
  }

  if (isError || !data) {
    return <div className="panel text-sm text-red-600">Nao foi possivel carregar esta reserva.</div>;
  }

  return (
    <div className="space-y-4">
      <article className="panel">
        <p className="text-xs uppercase tracking-wide text-slate-500">{data.status}</p>
        <h2 className="mt-1 text-xl font-semibold">{data.package?.title ?? 'Aula avulsa'}</h2>
        <p className="mt-2 text-sm text-slate-600">Instrutor: {data.instructorProfile?.user.email ?? 'Nao definido'}</p>
        <p className="text-sm text-slate-600">Inicio: {formatDate(data.scheduledStart)}</p>
        <p className="text-sm text-slate-600">Fim: {formatDate(data.scheduledEnd)}</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Valor total</p>
            <p className="text-lg font-semibold">R$ {Number(data.priceTotal).toFixed(2)}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Taxa plataforma</p>
            <p className="text-lg font-semibold">R$ {Number(data.platformFee).toFixed(2)}</p>
          </div>
        </div>
      </article>

      <article className="panel">
        <h3 className="text-lg font-semibold">Licoes vinculadas</h3>
        <div className="mt-3 space-y-2">
          {data.lessons.map((lesson) => (
            <div key={lesson.id} className="rounded-xl border border-slate-200 p-3 text-sm">
              <p>Status: {lesson.status}</p>
              <p>PIN: {lesson.pinCode ?? 'Aguardando'}</p>
            </div>
          ))}
          {data.lessons.length === 0 && <p className="text-sm text-slate-500">Nenhuma licao criada para esta reserva.</p>}
        </div>
      </article>
    </div>
  );
}
