import { DashboardShell } from '@/components/dashboard-shell';
import { ChatBookingPanel } from '@/components/chat-booking-panel';

const nav = [
  { href: '/instructor/dashboard', label: 'Dashboard' },
  { href: '/instructor/wallet', label: 'Wallet' },
  { href: '/instructor/bookings', label: 'Reservas' },
  { href: '/instructor/agenda', label: 'Agenda' },
];

export default function InstructorBookingChatPage({ params }: { params: { bookingId: string } }) {
  return (
    <DashboardShell title="Chat da Reserva" nav={nav}>
      <ChatBookingPanel bookingId={params.bookingId} />
    </DashboardShell>
  );
}
