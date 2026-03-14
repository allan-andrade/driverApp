import Link from 'next/link';

type InstructorCardProps = {
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

export function InstructorCard(props: InstructorCardProps) {
  return (
    <article className="panel animate-rise">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-ink">{props.fullName}</h3>
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
          R$ {Number(props.basePrice).toFixed(2)}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-500">
        {props.city}, {props.state} • {props.categories.join(', ')}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-slate-100 px-2 py-1">Rating {props.rating.toFixed(1)}</span>
        <span className="rounded-full bg-slate-100 px-2 py-1">{props.verificationStatus}</span>
        <span className="rounded-full bg-slate-100 px-2 py-1">
          {props.hasAvailability ? 'Disponivel' : 'Sem slot'}
        </span>
      </div>
      <Link
        href={`/instructors/${props.id}`}
        className="mt-5 inline-flex rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white"
      >
        Ver perfil
      </Link>
    </article>
  );
}
