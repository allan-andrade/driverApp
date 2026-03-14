'use client';

import { useQuery } from '@tanstack/react-query';
import { Wallet, WalletTransaction } from '@driver-school/types';
import { WalletSummaryCard } from '@/components/wallet-summary-card';
import { WalletTransactionTable } from '@/components/wallet-transaction-table';
import { clientApiRequest } from '@/lib/client-api';

export default function InstructorWalletPage() {
  const { data: wallet, isLoading } = useQuery({
    queryKey: ['instructor-wallet-page'],
    queryFn: () => clientApiRequest<Wallet>('/wallets/me'),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['instructor-wallet-transactions'],
    queryFn: () => clientApiRequest<WalletTransaction[]>('/wallets/me/transactions'),
  });

  if (isLoading || !wallet) {
    return <main className="shell py-10 text-sm text-slate-500">Carregando wallet...</main>;
  }

  return (
    <main className="shell space-y-4 py-10">
      <h1 className="text-2xl font-bold">Wallet do Instrutor</h1>
      <WalletSummaryCard wallet={wallet} />
      <WalletTransactionTable transactions={transactions} />
    </main>
  );
}
