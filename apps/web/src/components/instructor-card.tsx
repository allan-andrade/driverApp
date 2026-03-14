import Link from 'next/link';
import { InstructorCard as InstructorCardType } from '@driver-school/types';

type InstructorCardProps = InstructorCardType;

export function InstructorCard(props: InstructorCardProps) {
  const displayPrice = props.minPackagePrice ?? props.basePrice;

  return (
    <article className="panel animate-rise border-slate-200/90 bg-white/90 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-ink">{props.fullName}</h3>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {displayPrice ? `A partir de R$ ${displayPrice.toFixed(2)}` : 'Sob consulta'}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-500">
        {[props.city, props.state].filter(Boolean).join(', ')}
        {props.categories.length > 0 ? ` • ${props.categories.join(', ')}` : ''}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <span className="rounded-full bg-slate-100 px-2 py-1 text-center">Nota {props.rating.toFixed(1)}</span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-center">{props.reviewCount} avaliacoes</span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-center">{props.yearsExperience ?? 0} anos</span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-center">{props.verificationStatus}</span>
      </div>
      <div className="mt-3 text-xs text-slate-500">
        <span className="font-medium text-slate-700">Disponibilidade:</span>{' '}
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1">
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
