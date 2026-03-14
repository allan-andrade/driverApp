'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { AdminOperationsAnalytics, FraudSignal, ReminderJobLog, WebhookEvent } from '@driver-school/types';
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

  const { data: operations, isLoading: operationsLoading } = useQuery({
    queryKey: ['admin-operations-analytics'],
    queryFn: () => clientApiRequest<AdminOperationsAnalytics>('/analytics/admin/operations'),
  });

  const { data: fraudSignals, isLoading: fraudSignalsLoading } = useQuery({
    queryKey: ['admin-fraud-signals'],
    queryFn: () => clientApiRequest<FraudSignal[]>('/fraud/signals?limit=20'),
  });

  const { data: webhookEvents, isLoading: webhookEventsLoading } = useQuery({
    queryKey: ['admin-webhook-events'],
    queryFn: () => clientApiRequest<WebhookEvent[]>('/webhooks/events?limit=20'),
  });

  const { data: reminders, isLoading: remindersLoading } = useQuery({
    queryKey: ['admin-reminder-logs'],
    queryFn: () => clientApiRequest<ReminderJobLog[]>('/reminders/logs'),
  });

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

  const evaluateFraud = useMutation({
    mutationFn: () => clientApiRequest(`/fraud/evaluate/payment/${entityId}`, { method: 'POST' }),
    onSuccess: () => setFeedback('Avaliacao antifraude executada.'),
  });

  return (
    <div className="space-y-6">
      <section className="grid gap-3 md:grid-cols-4">
        <article className="panel">
          <p className="text-xs uppercase tracking-wide text-slate-500">Gross Volume</p>
          <p className="mt-1 text-2xl font-semibold text-ink">
            {operationsLoading || !operations ? '...' : `R$ ${Number(operations.finance.grossAmount).toFixed(2)}`}
          </p>
        </article>
        <article className="panel">
          <p className="text-xs uppercase tracking-wide text-slate-500">Receita Plataforma</p>
          <p className="mt-1 text-2xl font-semibold text-ink">
            {operationsLoading || !operations ? '...' : `R$ ${Number(operations.finance.platformRevenue).toFixed(2)}`}
          </p>
        </article>
        <article className="panel">
          <p className="text-xs uppercase tracking-wide text-slate-500">Tentativas de Pagamento</p>
          <p className="mt-1 text-2xl font-semibold text-ink">
            {operationsLoading || !operations ? '...' : operations.finance.attempts.reduce((acc, item) => acc + item.count, 0)}
          </p>
        </article>
        <article className="panel">
          <p className="text-xs uppercase tracking-wide text-slate-500">Sinais de Risco</p>
          <p className="mt-1 text-2xl font-semibold text-ink">
            {operationsLoading || !operations ? '...' : operations.fraud.recent.length}
          </p>
        </article>
      </section>

      <section className="panel space-y-3">
        <h2 className="text-lg font-semibold">Centro de comando operacional</h2>
        <p className="text-sm text-slate-500">Use este painel para operar excecoes de pagamento, payout, disputas, incidentes, compliance e antifraude.</p>
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

        <div className="rounded-lg border border-slate-200 p-3">
          <p className="mb-2 text-sm font-medium">Avaliacao antifraude</p>
          <p className="mb-2 text-xs text-slate-500">Informe um ID de pagamento e execute a heuristica antifraude.</p>
          <button
            type="button"
            className="rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => evaluateFraud.mutate()}
            disabled={!entityId || evaluateFraud.isPending}
          >
            Rodar avaliacao
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="panel">
          <h3 className="text-base font-semibold">Ultimos sinais de fraude</h3>
          <div className="mt-3 space-y-2 text-sm">
            {fraudSignalsLoading && <p className="text-slate-500">Carregando sinais...</p>}
            {(fraudSignals ?? []).slice(0, 8).map((signal) => (
              <div key={signal.id} className="rounded-xl border border-slate-200 p-2">
                <p className="font-medium text-slate-800">{signal.signalType}</p>
                <p className="text-slate-600">Severidade: {signal.severity}</p>
                <p className="text-slate-500">{new Date(signal.createdAt).toLocaleString('pt-BR')}</p>
              </div>
            ))}
            {!fraudSignalsLoading && (fraudSignals?.length ?? 0) === 0 && <p className="text-slate-500">Nenhum sinal registrado.</p>}
          </div>
        </article>

        <article className="panel">
          <h3 className="text-base font-semibold">Eventos de webhook</h3>
          <div className="mt-3 space-y-2 text-sm">
            {webhookEventsLoading && <p className="text-slate-500">Carregando webhooks...</p>}
            {(webhookEvents ?? []).slice(0, 8).map((event) => (
              <div key={event.id} className="rounded-xl border border-slate-200 p-2">
                <p className="font-medium text-slate-800">{event.eventType}</p>
                <p className="text-slate-600">Provider: {event.provider}</p>
                <p className="text-slate-500">{new Date(event.createdAt).toLocaleString('pt-BR')}</p>
              </div>
            ))}
            {!webhookEventsLoading && (webhookEvents?.length ?? 0) === 0 && <p className="text-slate-500">Sem eventos no momento.</p>}
          </div>
        </article>
      </section>

      <article className="panel">
        <h3 className="text-base font-semibold">Reminders entregues</h3>
        <div className="mt-3 space-y-2 text-sm">
          {remindersLoading && <p className="text-slate-500">Carregando reminders...</p>}
          {(reminders ?? []).slice(0, 8).map((log) => (
            <div key={log.id} className="rounded-xl border border-slate-200 p-2">
              <p className="font-medium text-slate-800">Canal: {log.channel}</p>
              <p className="text-slate-600">Status: {log.status}</p>
              <p className="text-slate-500">{new Date(log.createdAt).toLocaleString('pt-BR')}</p>
            </div>
          ))}
          {!remindersLoading && (reminders?.length ?? 0) === 0 && <p className="text-slate-500">Sem reminders entregues.</p>}
        </div>
      </article>

      <QueryPanel title="Disputas" path="/disputes/admin" />
      <QueryPanel title="Incidentes" path="/incidents/admin" />
      <QueryPanel title="Pagamentos" path="/payments/admin" />
      <QueryPanel title="Payouts" path="/payouts/admin" />
      <QueryPanel title="Submissoes documentais" path="/compliance/submissions" />
    </div>
  );
}
