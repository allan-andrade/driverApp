'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { clientApiRequest } from '@/lib/client-api';

type Slot = {
  id: string;
  weekday: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

const weekdayLabel: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terca',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sabado',
};

export function InstructorAgendaManager() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    weekday: 1,
    startTime: '08:00',
    endTime: '12:00',
    isActive: true,
  });

  const { data: slots = [], isLoading, isError } = useQuery({
    queryKey: ['instructor-me-availability'],
    queryFn: () => clientApiRequest<Slot[]>('/instructors/me/availability'),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      clientApiRequest('/instructors/me/availability', {
        method: 'POST',
        body: JSON.stringify(form),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['instructor-me-availability'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (slotId: string) =>
      clientApiRequest(`/instructors/me/availability/${slotId}`, {
        method: 'DELETE',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['instructor-me-availability'] });
    },
  });

  return (
    <div className="space-y-4">
      <article className="panel">
        <h2 className="text-lg font-semibold">Adicionar disponibilidade</h2>
        <form
          className="mt-4 grid gap-3 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            createMutation.mutate();
          }}
        >
          <select
            value={form.weekday}
            onChange={(event) => setForm((previous) => ({ ...previous, weekday: Number(event.target.value) }))}
            className="rounded-xl border px-3 py-2"
          >
            {Object.entries(weekdayLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <label className="space-y-1 text-sm">
            <span>Ativo</span>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((previous) => ({ ...previous, isActive: event.target.checked }))}
            />
          </label>

          <input
            type="time"
            value={form.startTime}
            onChange={(event) => setForm((previous) => ({ ...previous, startTime: event.target.value }))}
            className="rounded-xl border px-3 py-2"
          />
          <input
            type="time"
            value={form.endTime}
            onChange={(event) => setForm((previous) => ({ ...previous, endTime: event.target.value }))}
            className="rounded-xl border px-3 py-2"
          />

          <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white md:col-span-2">
            {createMutation.isPending ? 'Salvando...' : 'Adicionar slot'}
          </button>
        </form>
      </article>

      {isLoading && <div className="panel text-sm text-slate-500">Carregando agenda...</div>}
      {isError && <div className="panel text-sm text-red-600">Falha ao carregar disponibilidade.</div>}

      {slots.map((slot) => (
        <article key={slot.id} className="panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">
              {weekdayLabel[slot.weekday]} • {slot.startTime} - {slot.endTime} • {slot.isActive ? 'Ativo' : 'Inativo'}
            </p>
            <button
              type="button"
              onClick={() => removeMutation.mutate(slot.id)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
            >
              Remover
            </button>
          </div>
        </article>
      ))}

      {slots.length === 0 && !isLoading && <div className="panel text-sm text-slate-500">Sem slots cadastrados.</div>}
    </div>
  );
}
