'use client';

import { useQuery } from '@tanstack/react-query';
import { ComplianceSubmissionTable } from '@/components/compliance-submission-table';
import { ComplianceUploadForm } from '@/components/compliance-upload-form';
import { clientApiRequest } from '@/lib/client-api';

type Submission = {
  id: string;
  stateCode: string;
  documentType: string;
  verificationStatus: string;
  createdAt: string;
  reviews?: Array<{ id: string; decision: string; reason?: string | null }>;
};

export default function SchoolCompliancePage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['school-compliance-submissions'],
    queryFn: () => clientApiRequest<Submission[]>('/compliance/submissions/me'),
  });

  return (
    <main className="shell space-y-4 py-10">
      <h1 className="text-2xl font-bold">Compliance da autoescola</h1>
      <ComplianceUploadForm />
      {isLoading ? <p className="text-sm text-slate-500">Carregando...</p> : <ComplianceSubmissionTable items={data} />}
    </main>
  );
}
