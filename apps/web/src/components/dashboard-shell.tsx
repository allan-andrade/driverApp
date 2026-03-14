"use client";

import Link from 'next/link';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export function DashboardShell({
  title,
  nav,
  children,
}: {
  title: string;
  nav: { href: string; label: string }[];
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="shell py-8">
      <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-cyan-50 via-white to-amber-50 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">DriveSchool OS</p>
            <h1 className="mt-1 text-2xl font-bold text-ink md:text-3xl">{title}</h1>
          </div>
          <Link href="/" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
            Voltar ao publico
          </Link>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="panel h-fit space-y-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === item.href
                  ? 'bg-ink text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </aside>
        <section className="space-y-6">{children}</section>
      </div>
    </div>
  );
}
