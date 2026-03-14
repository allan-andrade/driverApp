type ComplianceSubmission = {
  id: string;
  stateCode: string;
  documentType: string;
  verificationStatus: string;
  createdAt: string;
  reviews?: Array<{ id: string; decision: string; reason?: string | null }>;
};

export function ComplianceSubmissionTable({ items }: { items: ComplianceSubmission[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-4 py-3">Documento</th>
            <th className="px-4 py-3">UF</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Ultima decisao</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{item.documentType}</td>
              <td className="px-4 py-3">{item.stateCode}</td>
              <td className="px-4 py-3 font-semibold">{item.verificationStatus}</td>
              <td className="px-4 py-3 text-slate-600">{item.reviews?.[0]?.decision ?? '-'}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                Nenhuma submissao encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
