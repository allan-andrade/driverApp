import { InstructorCard } from '@/components/instructor-card';
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
    sortBy?: string;
    sortOrder?: string;
    page?: string;
  };
}) {
  const params = new URLSearchParams();
  if (searchParams.city) params.set('city', searchParams.city);
  if (searchParams.state) params.set('state', searchParams.state);
  if (searchParams.category) params.set('category', searchParams.category);
  if (searchParams.instructorType) params.set('instructorType', searchParams.instructorType);
  if (searchParams.transmissionType) params.set('transmissionType', searchParams.transmissionType);
  if (searchParams.sortBy) params.set('sortBy', searchParams.sortBy);
  if (searchParams.sortOrder) params.set('sortOrder', searchParams.sortOrder);
  if (searchParams.page) params.set('page', searchParams.page);

  const response = await apiRequest<MarketplaceListResponse>(`/marketplace/instructors?${params.toString()}`);
  const currentPage = Number(searchParams.page ?? '1');
  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(response.meta.totalPages, currentPage + 1);

  return (
    <main>
      <TopNav />
      <section className="shell py-10">
        <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Marketplace de instrutores</h1>
            <p className="mt-2 text-sm text-slate-600">
              Compare didatica, preco e disponibilidade em tempo real para montar sua jornada de habilitacao.
            </p>
          </div>
          <form className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
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
            <select name="sortBy" defaultValue={searchParams.sortBy ?? 'relevance'} className="rounded-xl border px-3 py-2">
              <option value="relevance">Ordenar por relevancia</option>
              <option value="price">Ordenar por preco</option>
              <option value="rating">Ordenar por nota</option>
              <option value="experience">Ordenar por experiencia</option>
            </select>
            <select
              name="sortOrder"
              defaultValue={searchParams.sortOrder ?? 'desc'}
              className="rounded-xl border px-3 py-2"
            >
              <option value="desc">Maior para menor</option>
              <option value="asc">Menor para maior</option>
            </select>
            <button className="rounded-xl bg-ink px-4 py-2 text-white">Aplicar filtros</button>
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
            className={`rounded-xl border px-4 py-2 text-sm ${currentPage <= 1 ? 'pointer-events-none opacity-40' : ''}`}
          >
            Pagina anterior
          </a>
          <a
            href={`/instructors?${new URLSearchParams({ ...searchParams, page: String(nextPage) }).toString()}`}
            className={`rounded-xl border px-4 py-2 text-sm ${currentPage >= response.meta.totalPages ? 'pointer-events-none opacity-40' : ''}`}
          >
            Proxima pagina
          </a>
        </div>
      </section>
    </main>
  );
}
