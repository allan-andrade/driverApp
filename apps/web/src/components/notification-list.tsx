import { NotificationItem } from '@driver-school/types';

export function NotificationList({ items }: { items: NotificationItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <article
          key={item.id}
          className={`rounded-xl border p-3 ${item.readAt ? 'border-slate-200 bg-white' : 'border-sky-200 bg-sky-50'}`}
        >
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold">{item.title}</h4>
            <span className="text-[11px] uppercase tracking-wide text-slate-500">{item.type}</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{item.message}</p>
        </article>
      ))}
      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          Sem notificacoes no momento.
        </div>
      )}
    </div>
  );
}
