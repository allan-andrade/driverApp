'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { clientApiRequest } from '@/lib/client-api';
import { InstructorCard, MarketplaceInstructorDetail } from '@driver-school/types';

const schema = z.object({
  instructorProfileId: z.string().min(1, 'Selecione um instrutor'),
  packageId: z.string().min(1, 'Selecione um pacote'),
  scheduledStart: z.string().min(1, 'Informe a data/hora de inicio'),
});

type FormValues = z.infer<typeof schema>;

function toIsoEnd(start: string, durationMinutes: number): string {
  const date = new Date(start);
  date.setMinutes(date.getMinutes() + durationMinutes);
  return date.toISOString();
}

export function CandidateBookingForm({
  initialInstructorProfileId,
  initialPackageId,
}: {
  initialInstructorProfileId?: string;
  initialPackageId?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: instructors = [] } = useQuery({
    queryKey: ['marketplace-instructors-shortlist'],
    queryFn: async () => {
      const response = await clientApiRequest<{ items: InstructorCard[] }>('/marketplace/instructors?page=1&pageSize=50');
      return response.items;
    },
  });

  const { register, watch, setValue, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      instructorProfileId: initialInstructorProfileId ?? '',
      packageId: initialPackageId ?? '',
    },
  });

  const selectedInstructorId = watch('instructorProfileId');
  const selectedPackageId = watch('packageId');

  const { data: instructorDetail } = useQuery({
    queryKey: ['marketplace-instructor-detail-booking', selectedInstructorId],
    queryFn: () => clientApiRequest<MarketplaceInstructorDetail>(`/marketplace/instructors/${selectedInstructorId}`),
    enabled: Boolean(selectedInstructorId),
  });

  useEffect(() => {
    if (!instructorDetail) {
      return;
    }

    const hasSelectedPackage = instructorDetail.packages.some((item) => item.id === selectedPackageId);
    if (!hasSelectedPackage) {
      setValue('packageId', instructorDetail.packages[0]?.id ?? '');
    }
  }, [instructorDetail, selectedPackageId, setValue]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const selectedPackage = instructorDetail?.packages.find((item) => item.id === values.packageId);
      if (!selectedPackage) {
        throw new Error('Pacote selecionado invalido');
      }

      return clientApiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          instructorProfileId: values.instructorProfileId,
          packageId: values.packageId,
          scheduledStart: new Date(values.scheduledStart).toISOString(),
          scheduledEnd: toIsoEnd(values.scheduledStart, selectedPackage.durationMinutes),
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
      <p className="text-sm text-slate-500">Selecione um instrutor, escolha o pacote e defina o horario da primeira aula.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Instrutor</label>
          <select className="w-full rounded-xl border px-3 py-2" {...register('instructorProfileId')}>
            <option value="">Selecione</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.fullName} - {[instructor.city, instructor.state].filter(Boolean).join('/')} -{' '}
                {instructor.minPackagePrice ? `a partir de R$ ${instructor.minPackagePrice.toFixed(2)}` : 'preco sob consulta'}
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

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">Pacote de aulas</label>
          <select className="w-full rounded-xl border px-3 py-2" {...register('packageId')} disabled={!instructorDetail}>
            <option value="">Selecione</option>
            {instructorDetail?.packages.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} • {item.lessonCount} aulas • {item.durationMinutes} min • R$ {item.price.toFixed(2)}
              </option>
            ))}
          </select>
          {formState.errors.packageId && <p className="text-xs text-red-600">{formState.errors.packageId.message}</p>}

          {instructorDetail && (
            <p className="text-xs text-slate-500">
              A taxa da plataforma e calculada automaticamente. O valor final segue o pacote escolhido.
            </p>
          )}
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
