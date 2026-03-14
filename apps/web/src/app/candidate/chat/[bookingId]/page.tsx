import { DashboardShell } from '@/components/dashboard-shell';
import { ChatBookingPanel } from '@/components/chat-booking-panel';

const nav = [
  { href: '/candidate/dashboard', label: 'Dashboard' },
  { href: '/candidate/bookings', label: 'Minhas reservas' },
  { href: '/candidate/search', label: 'Buscar instrutores' },
];

export default function CandidateBookingChatPage({ params }: { params: { bookingId: string } }) {
  return (
    <DashboardShell title="Chat da Reserva" nav={nav}>
      <ChatBookingPanel bookingId={params.bookingId} />
    </DashboardShell>
  );
}
