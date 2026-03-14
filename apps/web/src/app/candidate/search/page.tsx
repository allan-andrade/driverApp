import { TopNav } from '@/components/top-nav';

export default function CandidateSearchPage() {
  return (
    <main>
      <TopNav />
      <section className="shell py-8">
        <h1 className="mb-4 text-3xl font-bold">Buscar instrutores</h1>
        <p className="mb-6 text-slate-600">Area dedicada ao candidato para descoberta e agendamento.</p>
        <a href="/instructors" className="rounded-xl bg-ink px-5 py-3 text-white">
          Ir para marketplace de instrutores
        </a>
      </section>
    </main>
  );
}
