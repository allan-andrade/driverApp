'use client';

import { useState } from 'react';
import { clientApiRequest } from '@/lib/client-api';

type Props = {
  submissionId: string;
};

export function AdminDocumentReviewModal({ submissionId }: Props) {
  const [decision, setDecision] = useState<'APPROVED' | 'REJECTED' | 'REQUEST_CHANGES'>('APPROVED');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function submitReview() {
    setStatus('Salvando revisao...');
    try {
      await clientApiRequest(`/admin/compliance/submissions/${submissionId}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ decision, reason }),
      });
      setStatus('Revisao salva com sucesso.');
    } catch (error) {
      setStatus('Falha ao salvar revisao.');
      console.error(error);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h4 className="font-semibold">Revisar submissao</h4>
      <div className="mt-3 grid gap-2">
        <select value={decision} onChange={(e) => setDecision(e.target.value as typeof decision)} className="rounded-xl border px-3 py-2">
          <option value="APPROVED">Aprovar</option>
          <option value="REQUEST_CHANGES">Solicitar ajuste</option>
          <option value="REJECTED">Rejeitar</option>
        </select>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="rounded-xl border px-3 py-2"
          placeholder="Motivo da revisao"
        />
      </div>
      <button onClick={submitReview} className="mt-3 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">
        Enviar revisao
      </button>
      {status && <p className="mt-2 text-sm text-slate-600">{status}</p>}
    </div>
  );
}
