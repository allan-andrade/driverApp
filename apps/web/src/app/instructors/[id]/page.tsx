import { TopNav } from '@/components/top-nav';
import { apiRequest } from '@/lib/api';

type InstructorDetails = {
  user?: { email?: string };
  bio: string;
  city: string;
  state: string;
  yearsExperience: number;
  basePrice: number;
  verificationStatus: string;
  availabilitySlots?: Array<{ id: string; weekday: number; startTime: string; endTime: string }>;
};

export default async function InstructorDetailsPage({ params }: { params: { id: string } }) {
  const instructor = await apiRequest<InstructorDetails>(`/instructors/${params.id}`);

  return (
    <main>
      <TopNav />
      <section className="shell py-10">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="panel space-y-4">
            <h1 className="text-3xl font-bold">{instructor.user?.email}</h1>
            <p className="text-slate-600">{instructor.bio}</p>
            <p className="text-sm text-slate-500">
              {instructor.city}, {instructor.state} • {instructor.yearsExperience} anos de experiencia
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Preco base</p>
                <p className="text-xl font-semibold">R$ {Number(instructor.basePrice).toFixed(2)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Status verificacao</p>
                <p className="text-xl font-semibold">{instructor.verificationStatus}</p>
              </div>
            </div>
          </div>
          <div className="panel">
            <h2 className="text-lg font-semibold">Disponibilidade</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {instructor.availabilitySlots?.map((slot) => (
                <li key={slot.id} className="rounded-lg bg-slate-50 p-3">
                  Dia {slot.weekday} • {slot.startTime} - {slot.endTime}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
