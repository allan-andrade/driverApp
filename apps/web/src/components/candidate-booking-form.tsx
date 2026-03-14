'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { clientApiRequest } from '@/lib/client-api';

const schema = z.object({
  instructorProfileId: z.string().min(1, 'Selecione um instrutor'),
  scheduledStart: z.string().min(1, 'Informe a data/hora de inicio'),
  durationMinutes: z.coerce.number().int().min(30).max(180),
  priceTotal: z.coerce.number().min(1),
});

type FormValues = z.infer<typeof schema>;

type InstructorSearch = Array<{ id: string; fullName: string; city: string; state: string; basePrice: number }>;

function toIsoEnd(start: string, durationMinutes: number): string {
  const date = new Date(start);
  date.setMinutes(date.getMinutes() + durationMinutes);
  return date.toISOString();
}

export function CandidateBookingForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: instructors = [] } = useQuery({
    queryKey: ['instructors-search'],
    queryFn: () => clientApiRequest<InstructorSearch>('/instructors/search'),
  });

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      durationMinutes: 50,
      priceTotal: 100,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return clientApiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          instructorProfileId: values.instructorProfileId,
          scheduledStart: new Date(values.scheduledStart).toISOString(),
          scheduledEnd: toIsoEnd(values.scheduledStart, values.durationMinutes),
          priceTotal: values.priceTotal,
          platformFee: Number((values.priceTotal * 0.1).toFixed(2)),
        }),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/bookings/me'] });
      router.push('/candidate/bookings');
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="panel space-y-4">
      <h2 className="text-xl font-semibold">Nova reserva</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Instrutor</label>
          <select className="w-full rounded-xl border px-3 py-2" {...register('instructorProfileId')}>
            <option value="">Selecione</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.fullName} - {instructor.city}/{instructor.state} - R$ {Number(instructor.basePrice).toFixed(2)}
              </option>
            ))}
          </select>
          {formState.errors.instructorProfileId && (
            <p className="text-xs text-red-600">{formState.errors.instructorProfileId.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Inicio da aula</label>
          <input type="datetime-local" className="w-full rounded-xl border px-3 py-2" {...register('scheduledStart')} />
          {formState.errors.scheduledStart && (
            <p className="text-xs text-red-600">{formState.errors.scheduledStart.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Duracao (minutos)</label>
          <input type="number" className="w-full rounded-xl border px-3 py-2" {...register('durationMinutes')} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Preco total (R$)</label>
          <input type="number" step="0.01" className="w-full rounded-xl border px-3 py-2" {...register('priceTotal')} />
        </div>
      </div>

      <button
        type="submit"
        disabled={formState.isSubmitting || mutation.isPending}
        className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white"
      >
        {mutation.isPending ? 'Criando reserva...' : 'Confirmar reserva'}
      </button>

      {mutation.isError && <p className="text-sm text-red-600">Falha ao criar reserva. Revise os dados.</p>}
    </form>
  );
}
