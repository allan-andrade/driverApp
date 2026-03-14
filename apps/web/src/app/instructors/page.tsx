import { InstructorCard } from '@/components/instructor-card';
import { TopNav } from '@/components/top-nav';
import { apiRequest } from '@/lib/api';

type InstructorSearchResult = {
  id: string;
  fullName: string;
  city: string;
  state: string;
  basePrice: number;
  rating: number;
  categories: string[];
  verificationStatus: string;
  hasAvailability: boolean;
};

export default async function InstructorsPage({
  searchParams,
}: {
  searchParams: { city?: string; state?: string; category?: string };
}) {
  const params = new URLSearchParams();
  if (searchParams.city) params.set('city', searchParams.city);
  if (searchParams.state) params.set('state', searchParams.state);
  if (searchParams.category) params.set('category', searchParams.category);

  const instructors = await apiRequest<InstructorSearchResult[]>(`/instructors/search?${params.toString()}`);

  return (
    <main>
      <TopNav />
      <section className="shell py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Descobrir instrutores</h1>
          <form className="flex gap-2">
            <input name="city" placeholder="Cidade" className="rounded-xl border px-3 py-2" />
            <input name="state" placeholder="UF" className="w-20 rounded-xl border px-3 py-2" />
            <select name="category" className="rounded-xl border px-3 py-2">
              <option value="">Categoria</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
            </select>
            <button className="rounded-xl bg-ink px-4 py-2 text-white">Filtrar</button>
          </form>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {instructors.map((instructor) => (
            <InstructorCard key={instructor.id} {...instructor} />
          ))}
        </div>
      </section>
    </main>
  );
}
