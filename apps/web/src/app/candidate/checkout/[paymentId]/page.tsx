import { DashboardShell } from '@/components/dashboard-shell';
import { CheckoutWorkbench } from '@/components/checkout-workbench';

const nav = [
  { href: '/candidate/dashboard', label: 'Dashboard' },
  { href: '/candidate/bookings', label: 'Minhas reservas' },
  { href: '/candidate/search', label: 'Buscar instrutores' },
];

export default function CandidateCheckoutPage({ params }: { params: { paymentId: string } }) {
  return (
    <DashboardShell title="Checkout de Pagamento" nav={nav}>
      <CheckoutWorkbench paymentId={params.paymentId} />
    </DashboardShell>
  );
}
