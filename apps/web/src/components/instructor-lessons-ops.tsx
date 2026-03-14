'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { clientApiRequest } from '@/lib/client-api';

type LessonItem = {
  id: string;
  bookingId: string;
  status: string;
  pinVerified: boolean;
  startedAt?: string | null;
  finishedAt?: string | null;
  startAddress?: string | null;
  endAddress?: string | null;
  notes?: string | null;
};

type LessonStatus = 'SCHEDULED' | 'CHECK_IN_PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

const statusLabel: Record<LessonStatus, string> = {
  SCHEDULED: 'Agendada',
  CHECK_IN_PENDING: 'Check-in confirmado',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluida',
  CANCELLED: 'Cancelada',
  NO_SHOW: 'No-show',
};

const statusTone: Record<LessonStatus, string> = {
  SCHEDULED: 'bg-slate-100 text-slate-700',
  CHECK_IN_PENDING: 'bg-sky-100 text-sky-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
  NO_SHOW: 'bg-orange-100 text-orange-700',
};

export function InstructorLessonsOps() {
  const queryClient = useQueryClient();
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [operationNote, setOperationNote] = useState('');

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['instructor-lessons-me'],
    queryFn: () => clientApiRequest<LessonItem[]>('/lessons/me'),
  });

  const selectedLesson = lessons.find((item) => item.id === selectedLessonId);
  const selectedStatus = (selectedLesson?.status ?? 'SCHEDULED') as LessonStatus;

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['instructor-lessons-me'] });
  };

  const checkIn = useMutation({
    mutationFn: () => clientApiRequest(`/lessons/${selectedLessonId}/check-in`, { method: 'PATCH', body: JSON.stringify({ pinCode }) }),
    onSuccess: refresh,
  });

  const start = useMutation({
    mutationFn: () => clientApiRequest(`/lessons/${selectedLessonId}/start`, { method: 'PATCH', body: JSON.stringify({}) }),
    onSuccess: refresh,
  });

  const finish = useMutation({
    mutationFn: () => clientApiRequest(`/lessons/${selectedLessonId}/finish`, { method: 'PATCH', body: JSON.stringify({}) }),
    onSuccess: refresh,
  });

  const noShow = useMutation({
    mutationFn: () =>
      clientApiRequest(`/lessons/${selectedLessonId}/no-show`, {
        method: 'PATCH',
        body: JSON.stringify({ reason: operationNote || 'Aluno ausente.' }),
      }),
    onSuccess: refresh,
  });

  const cancel = useMutation({
    mutationFn: () =>
      clientApiRequest(`/lessons/${selectedLessonId}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({ reason: operationNote || 'Cancelamento operacional.' }),
      }),
    onSuccess: refresh,
  });

  const canCheckIn = selectedStatus === 'SCHEDULED' || selectedStatus === 'CHECK_IN_PENDING';
  const canStart = selectedStatus === 'SCHEDULED' || selectedStatus === 'CHECK_IN_PENDING';
  const canFinish = selectedStatus === 'IN_PROGRESS';
  const canMarkNoShow = selectedStatus === 'SCHEDULED' || selectedStatus === 'CHECK_IN_PENDING';
  const canCancel = selectedStatus === 'SCHEDULED' || selectedStatus === 'CHECK_IN_PENDING';

  return (
    <div className="space-y-6">
      <section className="panel space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Fila operacional de aulas</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{lessons.length} aulas</span>
        </div>
        {isLoading ? (
          <p className="text-sm text-slate-500">Carregando aulas...</p>
        ) : (
          <div className="space-y-2">
            {lessons.map((lesson) => (
              <button
                type="button"
                key={lesson.id}
                onClick={() => setSelectedLessonId(lesson.id)}
                className={`w-full rounded-lg border p-3 text-left text-sm transition ${selectedLessonId === lesson.id ? 'border-ink bg-slate-50 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold">Aula {lesson.id.slice(0, 8)}</p>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusTone[lesson.status as LessonStatus] ?? 'bg-slate-100 text-slate-700'}`}>
                    {statusLabel[lesson.status as LessonStatus] ?? lesson.status}
                  </span>
                </div>
                <p className="text-slate-600">Booking: {lesson.bookingId.slice(0, 8)}</p>
                <p className="text-slate-600">PIN verificado: {lesson.pinVerified ? 'Sim' : 'Nao'}</p>
              </button>
            ))}
            {lessons.length === 0 && <p className="text-sm text-slate-500">Nenhuma aula encontrada.</p>}
          </div>
        )}
      </section>

      <section className="panel space-y-3">
        <h2 className="text-lg font-semibold">Console de execucao</h2>
        <input
          className="w-full rounded-lg border border-slate-300 p-2 text-sm"
          placeholder="ID da aula"
          value={selectedLessonId}
          onChange={(event) => setSelectedLessonId(event.target.value)}
        />

        <textarea
          className="w-full rounded-lg border border-slate-300 p-2 text-sm"
          placeholder="Observacao operacional (usada em no-show/cancelamento)"
          value={operationNote}
          onChange={(event) => setOperationNote(event.target.value)}
        />

        <input
          className="w-full rounded-lg border border-slate-300 p-2 text-sm"
          placeholder="PIN de check-in"
          value={pinCode}
          onChange={(event) => setPinCode(event.target.value)}
        />

        {selectedLesson && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <p className="font-semibold">Resumo da aula selecionada</p>
            <p>Status atual: {statusLabel[selectedStatus]}</p>
            <p>Iniciada em: {selectedLesson.startedAt ? new Date(selectedLesson.startedAt).toLocaleString() : 'Nao iniciada'}</p>
            <p>Finalizada em: {selectedLesson.finishedAt ? new Date(selectedLesson.finishedAt).toLocaleString() : 'Nao finalizada'}</p>
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" onClick={() => checkIn.mutate()} disabled={!selectedLessonId || checkIn.isPending || !canCheckIn || pinCode.length !== 4}>
            Verificar PIN
          </button>
          <button type="button" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" onClick={() => start.mutate()} disabled={!selectedLessonId || start.isPending || !canStart}>
            Iniciar aula
          </button>
          <button type="button" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" onClick={() => finish.mutate()} disabled={!selectedLessonId || finish.isPending || !canFinish}>
            Finalizar aula
          </button>
          <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:opacity-50" onClick={() => noShow.mutate()} disabled={!selectedLessonId || noShow.isPending || !canMarkNoShow}>
            Marcar no-show
          </button>
          <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:opacity-50" onClick={() => cancel.mutate()} disabled={!selectedLessonId || cancel.isPending || !canCancel}>
            Cancelar aula
          </button>
        </div>
      </section>
    </div>
  );
}
