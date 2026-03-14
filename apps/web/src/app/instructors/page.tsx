import { InstructorCard } from '@/components/instructor-card';
import { MarketplaceSortBar } from '@/components/marketplace-sort-bar';
import { TopNav } from '@/components/top-nav';
import { apiRequest } from '@/lib/api';
import { MarketplaceListResponse } from '@driver-school/types';

export default async function InstructorsPage({
  searchParams,
}: {
  searchParams: {
    city?: string;
    state?: string;
    category?: string;
    instructorType?: string;
    transmissionType?: string;
    verifiedOnly?: string;
    hasAvailability?: string;
    minPrice?: string;
    maxPrice?: string;
    minScore?: string;
    minReviews?: string;
    sortBy?: string;
    page?: string;
  };
}) {
  const params = new URLSearchParams();
  if (searchParams.city) params.set('city', searchParams.city);
  if (searchParams.state) params.set('state', searchParams.state);
  if (searchParams.category) params.set('category', searchParams.category);
  if (searchParams.instructorType) params.set('instructorType', searchParams.instructorType);
  if (searchParams.transmissionType) params.set('transmissionType', searchParams.transmissionType);
  if (searchParams.verifiedOnly) params.set('verifiedOnly', searchParams.verifiedOnly);
  if (searchParams.hasAvailability) params.set('hasAvailability', searchParams.hasAvailability);
  if (searchParams.minPrice) params.set('minPrice', searchParams.minPrice);
  if (searchParams.maxPrice) params.set('maxPrice', searchParams.maxPrice);
  if (searchParams.minScore) params.set('minScore', searchParams.minScore);
  if (searchParams.minReviews) params.set('minReviews', searchParams.minReviews);
  if (searchParams.sortBy) params.set('sortBy', searchParams.sortBy);
  if (searchParams.page) params.set('page', searchParams.page);

  const response = await apiRequest<MarketplaceListResponse>(`/marketplace/instructors?${params.toString()}`);
  const currentPage = Number(searchParams.page ?? '1');
  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(response.meta.totalPages, currentPage + 1);

  return (
    <main>
      <TopNav />
      <section className="shell py-10">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-r from-cyan-50 via-white to-amber-50 p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Matchmaking inteligente</p>
              <h1 className="mt-2 text-3xl font-bold">Marketplace de instrutores</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Compare didatica, confianca, preco e disponibilidade em tempo real para montar sua jornada de habilitacao.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-700">
              <p className="font-semibold text-ink">Ranking dinamico ativo</p>
              <p className="text-xs text-slate-500">Ordenacao por score de relevancia + sinais de qualidade</p>
            </div>
          </div>
          <form className="grid gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-4 md:grid-cols-2 lg:grid-cols-4">
            <input
              name="city"
              placeholder="Cidade"
              defaultValue={searchParams.city}
              className="rounded-xl border px-3 py-2"
            />
            <input
              name="state"
              placeholder="UF"
              defaultValue={searchParams.state}
              className="rounded-xl border px-3 py-2"
            />
            <select name="category" defaultValue={searchParams.category} className="rounded-xl border px-3 py-2">
              <option value="">Categoria</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
            <select
              name="instructorType"
              defaultValue={searchParams.instructorType}
              className="rounded-xl border px-3 py-2"
            >
              <option value="">Tipo de instrutor</option>
              <option value="AUTONOMO">Autonomo</option>
              <option value="SCHOOL_LINKED">Vinculado a autoescola</option>
            </select>
            <select
              name="transmissionType"
              defaultValue={searchParams.transmissionType}
              className="rounded-xl border px-3 py-2"
            >
              <option value="">Cambio</option>
              <option value="MANUAL">Manual</option>
              <option value="AUTOMATIC">Automatico</option>
            </select>
            <input name="minPrice" placeholder="Preco min" defaultValue={searchParams.minPrice} className="rounded-xl border px-3 py-2" />
            <input name="maxPrice" placeholder="Preco max" defaultValue={searchParams.maxPrice} className="rounded-xl border px-3 py-2" />
            <input name="minScore" placeholder="Score minimo" defaultValue={searchParams.minScore} className="rounded-xl border px-3 py-2" />
            <input name="minReviews" placeholder="Min reviews" defaultValue={searchParams.minReviews} className="rounded-xl border px-3 py-2" />
            <select name="verifiedOnly" defaultValue={searchParams.verifiedOnly ?? ''} className="rounded-xl border px-3 py-2">
              <option value="">Verificacao</option>
              <option value="true">Apenas verificados</option>
            </select>
            <select name="hasAvailability" defaultValue={searchParams.hasAvailability ?? ''} className="rounded-xl border px-3 py-2">
              <option value="">Agenda</option>
              <option value="true">Com disponibilidade</option>
            </select>
            <MarketplaceSortBar defaultSortBy={searchParams.sortBy ?? 'relevance'} />
            <button className="rounded-xl bg-ink px-4 py-2 font-semibold text-white">Aplicar filtros</button>
          </form>
        </div>

        <div className="mt-8 flex items-center justify-between text-sm text-slate-600">
          <p>
            {response.meta.total} instrutores encontrados • pagina {response.meta.page} de {response.meta.totalPages}
          </p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {response.items.map((instructor) => (
            <InstructorCard key={instructor.id} {...instructor} />
          ))}
          {response.items.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
              Nenhum instrutor encontrado com os filtros atuais.
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href={`/instructors?${new URLSearchParams({ ...searchParams, page: String(prevPage) }).toString()}`}
            className={`rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium ${currentPage <= 1 ? 'pointer-events-none opacity-40' : ''}`}
          >
            Pagina anterior
          </a>
          <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            {currentPage}/{response.meta.totalPages}
          </span>
          <a
            href={`/instructors?${new URLSearchParams({ ...searchParams, page: String(nextPage) }).toString()}`}
            className={`rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium ${currentPage >= response.meta.totalPages ? 'pointer-events-none opacity-40' : ''}`}
          >
            Proxima pagina
          </a>
        </div>
      </section>
    </main>
  );
}
