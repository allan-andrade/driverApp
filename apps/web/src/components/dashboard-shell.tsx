import Link from 'next/link';
import { ReactNode } from 'react';

export function DashboardShell({
  title,
  nav,
  children,
}: {
  title: string;
  nav: { href: string; label: string }[];
  children: ReactNode;
}) {
  return (
    <div className="shell py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        <Link href="/" className="text-sm font-medium text-accent">
          Voltar ao publico
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="panel h-fit space-y-3">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50">
              {item.label}
            </Link>
          ))}
        </aside>
        <section className="space-y-6">{children}</section>
      </div>
    </div>
  );
}
