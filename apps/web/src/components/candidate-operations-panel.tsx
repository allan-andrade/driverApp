'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { clientApiRequest } from '@/lib/client-api';

export function CandidateOperationsPanel() {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [documentType, setDocumentType] = useState('RG');
  const [fileUrl, setFileUrl] = useState('https://example.com/documento.pdf');

  const { data: lessons = [] } = useQuery({
    queryKey: ['candidate-lessons-me'],
    queryFn: () => clientApiRequest<Array<{ id: string; status: string; bookingId: string }>>('/lessons/me'),
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['candidate-payments-me'],
    queryFn: () => clientApiRequest<Array<{ id: string; status: string; amount: number }>>('/payments/me'),
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['candidate-submissions-me'],
    queryFn: () => clientApiRequest<Array<{ id: string; documentType: string; verificationStatus: string }>>('/compliance/submissions'),
  });

  const createDispute = useMutation({
    mutationFn: () =>
      clientApiRequest('/disputes', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: bookingId || undefined,
          lessonId: lessonId || undefined,
          paymentId: paymentId || undefined,
          reason,
          description,
        }),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['candidate-payments-me'] });
      await queryClient.invalidateQueries({ queryKey: ['candidate-lessons-me'] });
      setReason('');
      setDescription('');
    },
  });

  const createIncident = useMutation({
    mutationFn: () =>
      clientApiRequest('/incidents', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: bookingId || undefined,
          lessonId: lessonId || undefined,
          type: 'OTHER',
          severity: 'LOW',
          description: description || 'Relato operacional enviado pelo candidato.',
        }),
      }),
    onSuccess: () => {
      setDescription('');
    },
  });

  const submitDocument = useMutation({
    mutationFn: () =>
      clientApiRequest('/compliance/submissions', {
        method: 'POST',
        body: JSON.stringify({
          documentType,
          fileUrl,
        }),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['candidate-submissions-me'] });
    },
  });

  return (
    <div className="space-y-6">
      <section className="panel space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Sala de operacoes do aluno</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{lessons.length} aulas</span>
        </div>
        {lessons.length === 0 ? (
          <p className="text-sm text-slate-500">Sem aulas vinculadas no momento.</p>
        ) : (
          <div className="space-y-2 text-sm">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="rounded-lg border border-slate-200 p-3">
                <p className="font-semibold">Aula {lesson.id.slice(0, 8)}</p>
                <p className="text-slate-600">Status: {lesson.status}</p>
                <p className="text-slate-600">Booking: {lesson.bookingId.slice(0, 8)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel space-y-3">
        <h2 className="text-lg font-semibold">Financeiro</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-slate-500">Sem pagamentos localizados.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {payments.map((payment) => (
              <li key={payment.id} className="rounded-lg border border-slate-200 p-3">
                {payment.id} | {payment.status} | R$ {Number(payment.amount).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel space-y-3">
        <h2 className="text-lg font-semibold">Disputas e incidentes</h2>
        <select className="w-full rounded-lg border border-slate-300 p-2 text-sm" value={lessonId} onChange={(event) => {
          const selectedLesson = lessons.find((lesson) => lesson.id === event.target.value);
          setLessonId(event.target.value);
          if (selectedLesson) {
            setBookingId(selectedLesson.bookingId);
          }
        }}>
          <option value="">Selecione uma aula (opcional)</option>
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.id.slice(0, 8)} - {lesson.status}
            </option>
          ))}
        </select>

        <select className="w-full rounded-lg border border-slate-300 p-2 text-sm" value={paymentId} onChange={(event) => setPaymentId(event.target.value)}>
          <option value="">Selecione um pagamento (opcional)</option>
          {payments.map((payment) => (
            <option key={payment.id} value={payment.id}>
              {payment.id.slice(0, 8)} - {payment.status} - R$ {Number(payment.amount).toFixed(2)}
            </option>
          ))}
        </select>

        <input className="w-full rounded-lg border border-slate-300 p-2 text-sm" placeholder="bookingId (preenchido automaticamente quando aplicavel)" value={bookingId} onChange={(event) => setBookingId(event.target.value)} />
        <input className="w-full rounded-lg border border-slate-300 p-2 text-sm" placeholder="Motivo" value={reason} onChange={(event) => setReason(event.target.value)} />
        <textarea className="w-full rounded-lg border border-slate-300 p-2 text-sm" placeholder="Descricao" value={description} onChange={(event) => setDescription(event.target.value)} />
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={() => createDispute.mutate()} disabled={!reason || createDispute.isPending}>
            Criar disputa
          </button>
          <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-sm" onClick={() => createIncident.mutate()} disabled={createIncident.isPending}>
            Registrar incidente
          </button>
        </div>
      </section>

      <section className="panel space-y-3">
        <h2 className="text-lg font-semibold">Compliance documental</h2>
        <p className="text-sm text-slate-500">Envie documentos e acompanhe o status de revisao operacional.</p>
        <input className="w-full rounded-lg border border-slate-300 p-2 text-sm" value={documentType} onChange={(event) => setDocumentType(event.target.value)} />
        <input className="w-full rounded-lg border border-slate-300 p-2 text-sm" value={fileUrl} onChange={(event) => setFileUrl(event.target.value)} />
        <button type="button" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={() => submitDocument.mutate()} disabled={submitDocument.isPending}>
          Enviar documento
        </button>
        {submissions.length > 0 && (
          <ul className="space-y-2 text-sm">
            {submissions.map((submission) => (
              <li key={submission.id} className="rounded-lg border border-slate-200 p-3">
                {submission.documentType} | {submission.verificationStatus}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
