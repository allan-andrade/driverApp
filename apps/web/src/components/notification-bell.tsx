import Link from 'next/link';

export function NotificationBell({ unreadCount }: { unreadCount: number }) {
  return (
    <Link href="/candidate/notifications" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white">
      <span className="text-sm">N</span>
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
