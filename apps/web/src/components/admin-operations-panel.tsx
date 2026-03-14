'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { clientApiRequest } from '@/lib/client-api';
import { QueryPanel } from './query-panel';

export function AdminOperationsPanel() {
  const [entityId, setEntityId] = useState('');

  const [paymentStatus, setPaymentStatus] = useState('CAPTURED');
  const [payoutStatus, setPayoutStatus] = useState('PAID');
  const [disputeStatus, setDisputeStatus] = useState('UNDER_REVIEW');
  const [incidentStatus, setIncidentStatus] = useState('UNDER_REVIEW');
  const [submissionStatus, setSubmissionStatus] = useState('VERIFIED');
  const [feedback, setFeedback] = useState('');

  const updatePayment = useMutation({
    mutationFn: () =>
      clientApiRequest(`/payments/${entityId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: paymentStatus }),
      }),
    onSuccess: () => setFeedback('Pagamento atualizado com sucesso.'),
  });

  const updatePayout = useMutation({
    mutationFn: () =>
      clientApiRequest(`/payouts/${entityId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: payoutStatus }),
      }),
    onSuccess: () => setFeedback('Payout atualizado com sucesso.'),
  });

  const updateDispute = useMutation({
    mutationFn: () =>
      clientApiRequest(`/disputes/${entityId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: disputeStatus }),
      }),
    onSuccess: () => setFeedback('Disputa atualizada com sucesso.'),
  });

  const updateIncident = useMutation({
    mutationFn: () =>
      clientApiRequest(`/incidents/${entityId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: incidentStatus }),
      }),
    onSuccess: () => setFeedback('Incidente atualizado com sucesso.'),
  });

  const reviewSubmission = useMutation({
    mutationFn: () =>
      clientApiRequest(`/compliance/submissions/${entityId}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ verificationStatus: submissionStatus }),
      }),
    onSuccess: () => setFeedback('Documento revisado com sucesso.'),
  });

  return (
    <div className="space-y-6">
      <section className="panel space-y-3">
        <h2 className="text-lg font-semibold">Centro de comando operacional</h2>
        <p className="text-sm text-slate-500">Use este painel para operar excecoes de pagamento, payout, disputas, incidentes e compliance.</p>
        <input className="w-full rounded-lg border border-slate-300 p-2 text-sm" placeholder="ID do registro (payment/payout/dispute/incident/submission)" value={entityId} onChange={(event) => setEntityId(event.target.value)} />
        {feedback && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{feedback}</p>}

        <div className="grid gap-2 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-2 text-sm font-medium">Pagamento</p>
            <select className="mb-2 w-full rounded-lg border border-slate-300 p-2 text-sm" value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}>
              <option value="CAPTURED">CAPTURED</option>
              <option value="PAID">PAID</option>
              <option value="REFUNDED">REFUNDED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            <button type="button" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={() => updatePayment.mutate()} disabled={!entityId || updatePayment.isPending}>Atualizar pagamento</button>
          </div>

          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-2 text-sm font-medium">Payout</p>
            <select className="mb-2 w-full rounded-lg border border-slate-300 p-2 text-sm" value={payoutStatus} onChange={(event) => setPayoutStatus(event.target.value)}>
              <option value="ON_HOLD">ON_HOLD</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="PAID">PAID</option>
              <option value="FAILED">FAILED</option>
            </select>
            <button type="button" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={() => updatePayout.mutate()} disabled={!entityId || updatePayout.isPending}>Atualizar payout</button>
          </div>

          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-2 text-sm font-medium">Disputa</p>
            <select className="mb-2 w-full rounded-lg border border-slate-300 p-2 text-sm" value={disputeStatus} onChange={(event) => setDisputeStatus(event.target.value)}>
              <option value="OPEN">OPEN</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            <button type="button" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={() => updateDispute.mutate()} disabled={!entityId || updateDispute.isPending}>Atualizar disputa</button>
          </div>

          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-2 text-sm font-medium">Incidente</p>
            <select className="mb-2 w-full rounded-lg border border-slate-300 p-2 text-sm" value={incidentStatus} onChange={(event) => setIncidentStatus(event.target.value)}>
              <option value="OPEN">OPEN</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <button type="button" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={() => updateIncident.mutate()} disabled={!entityId || updateIncident.isPending}>Atualizar incidente</button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-3">
          <p className="mb-2 text-sm font-medium">Review de documento</p>
          <select className="mb-2 w-full rounded-lg border border-slate-300 p-2 text-sm" value={submissionStatus} onChange={(event) => setSubmissionStatus(event.target.value)}>
            <option value="PENDING">PENDING</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
          <button type="button" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={() => reviewSubmission.mutate()} disabled={!entityId || reviewSubmission.isPending}>Revisar submission</button>
        </div>
      </section>

      <QueryPanel title="Disputas" path="/disputes/admin" />
      <QueryPanel title="Incidentes" path="/incidents/admin" />
      <QueryPanel title="Pagamentos" path="/payments/admin" />
      <QueryPanel title="Payouts" path="/payouts/admin" />
      <QueryPanel title="Submissoes documentais" path="/compliance/submissions" />
    </div>
  );
}
