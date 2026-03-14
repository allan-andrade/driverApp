import Link from 'next/link';
import { TopNav } from '@/components/top-nav';

export default function HomePage() {
  return (
    <main>
      <TopNav />
      <section className="shell py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              Marketplace vertical para formacao de condutores
            </span>
            <h1 className="text-5xl font-bold leading-tight text-ink">
              Agendamento inteligente de aulas de direcao com camada de confianca e compliance
            </h1>
            <p className="text-lg text-slate-600">
              Conecte candidatos, instrutores autonomos e autoescolas com gestao operacional completa,
              trilha de auditoria e base pronta para escalar no Brasil.
            </p>
            <div className="flex gap-4">
              <Link href="/instructors" className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white">
                Encontrar instrutores
              </Link>
              <Link href="/register" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold">
                Criar conta
              </Link>
            </div>
          </div>
          <div className="panel min-h-80 bg-hero-gradient">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white p-4 shadow">
                <p className="text-xs font-medium text-slate-500">Check-in por PIN</p>
                <p className="mt-2 text-2xl font-semibold">Seguro</p>
              </div>
              <div className="rounded-xl bg-white p-4 shadow">
                <p className="text-xs font-medium text-slate-500">Rules Engine</p>
                <p className="mt-2 text-2xl font-semibold">SP / RJ</p>
              </div>
              <div className="rounded-xl bg-white p-4 shadow">
                <p className="text-xs font-medium text-slate-500">Agendas</p>
                <p className="mt-2 text-2xl font-semibold">Em tempo real</p>
              </div>
              <div className="rounded-xl bg-white p-4 shadow">
                <p className="text-xs font-medium text-slate-500">Marketplace</p>
                <p className="mt-2 text-2xl font-semibold">Instrutor + Escola</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
