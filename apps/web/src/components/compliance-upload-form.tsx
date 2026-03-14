'use client';

import { useState } from 'react';
import { clientApiRequest } from '@/lib/client-api';

export function ComplianceUploadForm() {
  const [documentType, setDocumentType] = useState('CNH');
  const [stateCode, setStateCode] = useState('SP');
  const [fileUrl, setFileUrl] = useState('https://storage.local/mock-document.pdf');
  const [status, setStatus] = useState<string | null>(null);

  async function submit() {
    setStatus('Enviando...');
    try {
      await clientApiRequest('/compliance/submissions', {
        method: 'POST',
        body: JSON.stringify({ documentType, stateCode, fileUrl }),
      });
      setStatus('Submissao enviada com sucesso.');
    } catch (error) {
      setStatus('Falha ao enviar documento.');
      console.error(error);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold">Enviar documento</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <input className="rounded-xl border px-3 py-2" value={documentType} onChange={(e) => setDocumentType(e.target.value)} />
        <input className="rounded-xl border px-3 py-2" value={stateCode} onChange={(e) => setStateCode(e.target.value)} />
        <input className="rounded-xl border px-3 py-2" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
      </div>
      <button onClick={submit} className="mt-3 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">
        Enviar
      </button>
      {status && <p className="mt-2 text-sm text-slate-600">{status}</p>}
    </section>
  );
}
