import { TopNav } from '@/components/top-nav';
import { apiRequest } from '@/lib/api';
import { MarketplaceInstructorDetail, MarketplaceReview } from '@driver-school/types';

const weekdayLabel: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terca',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sabado',
};

export default async function InstructorDetailsPage({ params }: { params: { id: string } }) {
  const [instructor, reviews] = await Promise.all([
    apiRequest<MarketplaceInstructorDetail>(`/marketplace/instructors/${params.id}`),
    apiRequest<MarketplaceReview[]>(`/marketplace/instructors/${params.id}/reviews`),
  ]);

  return (
    <main>
      <TopNav />
      <section className="shell py-10">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="panel bg-white/90">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{instructor.fullName}</h1>
                  <p className="mt-1 text-sm text-slate-500">
                    {[instructor.city, instructor.state].filter(Boolean).join(', ')} • {instructor.yearsExperience ?? 0} anos
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {instructor.verificationStatus}
                </span>
              </div>

              <p className="mt-5 text-slate-600">{instructor.bio ?? 'Perfil em configuracao.'}</p>

              <div className="mt-6 grid gap-3 md:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Nota media</p>
                  <p className="text-xl font-semibold">{instructor.stats.rating.toFixed(1)}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Avaliacoes</p>
                  <p className="text-xl font-semibold">{instructor.stats.reviewCount}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Pacotes</p>
                  <p className="text-xl font-semibold">{instructor.stats.packageCount}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Preco base</p>
                  <p className="text-xl font-semibold">
                    {instructor.basePrice ? `R$ ${instructor.basePrice.toFixed(2)}` : 'Sob consulta'}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {instructor.categories.map((category) => (
                  <span key={category} className="rounded-full bg-slate-100 px-3 py-1">
                    Categoria {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="panel">
              <h2 className="text-lg font-semibold">Pacotes de aulas</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {instructor.packages.map((item) => (
                  <article key={item.id} className="rounded-xl border border-slate-200 p-4">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {item.lessonCount} aulas • {item.durationMinutes} min • Categoria {item.category}
                    </p>
                    <p className="mt-3 text-xl font-semibold">R$ {item.price.toFixed(2)}</p>
                    <a
                      href={`/candidate/bookings/new?instructorId=${instructor.id}&packageId=${item.id}`}
                      className="mt-3 inline-flex rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white"
                    >
                      Reservar este pacote
                    </a>
                  </article>
                ))}
              </div>
            </div>

            <div className="panel">
              <h2 className="text-lg font-semibold">Avaliacoes recentes</h2>
              <div className="mt-4 space-y-3">
                {reviews.slice(0, 6).map((review) => (
                  <article key={review.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{review.candidateName}</p>
                      <p className="text-sm text-slate-500">Nota {review.average.toFixed(1)}</p>
                    </div>
                    {review.comment && <p className="mt-2 text-sm text-slate-600">{review.comment}</p>}
                  </article>
                ))}
                {reviews.length === 0 && <p className="text-sm text-slate-500">Ainda sem avaliacoes publicas.</p>}
              </div>
            </div>
          </div>

          <div className="panel h-fit">
            <h2 className="text-lg font-semibold">Disponibilidade semanal</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {instructor.availability.map((slot) => (
                <li key={slot.id} className="rounded-lg bg-slate-50 p-3">
                  {weekdayLabel[slot.weekday] ?? `Dia ${slot.weekday}`} • {slot.startTime} - {slot.endTime}
                </li>
              ))}
              {instructor.availability.length === 0 && (
                <li className="rounded-lg bg-slate-50 p-3 text-slate-500">Sem slots ativos no momento.</li>
              )}
            </ul>

            <a
              href={`/candidate/bookings/new?instructorId=${instructor.id}`}
              className="mt-4 inline-flex w-full justify-center rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white"
            >
              Reservar com este instrutor
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
