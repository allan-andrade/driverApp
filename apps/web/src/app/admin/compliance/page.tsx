'use client';

import { useQuery } from '@tanstack/react-query';
import { AdminDocumentReviewModal } from '@/components/admin-document-review-modal';
import { ComplianceSubmissionTable } from '@/components/compliance-submission-table';
import { clientApiRequest } from '@/lib/client-api';

type Submission = {
  id: string;
  stateCode: string;
  documentType: string;
  verificationStatus: string;
  createdAt: string;
  reviews?: Array<{ id: string; decision: string; reason?: string | null }>;
};

export default function AdminCompliancePage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['admin-compliance-submissions'],
    queryFn: () => clientApiRequest<Submission[]>('/admin/compliance/submissions'),
  });

  const selected = data[0];

  return (
    <main className="shell space-y-4 py-10">
      <h1 className="text-2xl font-bold">Revisao documental</h1>
      {selected && <AdminDocumentReviewModal submissionId={selected.id} />}
      {isLoading ? <p className="text-sm text-slate-500">Carregando...</p> : <ComplianceSubmissionTable items={data} />}
    </main>
  );
}
