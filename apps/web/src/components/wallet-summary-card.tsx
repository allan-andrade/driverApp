import { Wallet } from '@driver-school/types';

function money(value: number, currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);
}

export function WalletSummaryCard({ wallet }: { wallet: Wallet }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold">Wallet</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-emerald-50 p-3">
          <p className="text-xs text-emerald-700">Disponivel</p>
          <p className="text-xl font-bold text-emerald-800">{money(wallet.balanceAvailable, wallet.currency)}</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-3">
          <p className="text-xs text-amber-700">Pendente</p>
          <p className="text-xl font-bold text-amber-800">{money(wallet.balancePending, wallet.currency)}</p>
        </div>
        <div className="rounded-xl bg-rose-50 p-3">
          <p className="text-xs text-rose-700">Em hold</p>
          <p className="text-xl font-bold text-rose-800">{money(wallet.balanceOnHold, wallet.currency)}</p>
        </div>
      </div>
    </section>
  );
}
