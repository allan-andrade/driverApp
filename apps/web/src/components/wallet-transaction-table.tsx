import { WalletTransaction } from '@driver-school/types';

function money(value: number, currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);
}

export function WalletTransactionTable({ transactions }: { transactions: WalletTransaction[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Valor</th>
            <th className="px-4 py-3">Referencia</th>
            <th className="px-4 py-3">Descricao</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((item) => (
            <tr key={item.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-semibold">{item.type}</td>
              <td className="px-4 py-3">{money(item.amount, item.currency)}</td>
              <td className="px-4 py-3">{item.referenceType} #{item.referenceId.slice(-6)}</td>
              <td className="px-4 py-3 text-slate-600">{item.description ?? '-'}</td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                Nenhuma movimentacao encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
