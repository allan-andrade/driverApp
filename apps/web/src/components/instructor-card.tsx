import Link from 'next/link';
import { InstructorCard as InstructorCardType } from '@driver-school/types';
import { TeachingScoreBadge } from './teaching-score-badge';
import { TrustScoreBadge } from './trust-score-badge';

type InstructorCardProps = InstructorCardType;

export function InstructorCard(props: InstructorCardProps) {
  const displayPrice = props.minPackagePrice ?? props.basePrice;
  const cityLabel = [props.city, props.state].filter(Boolean).join(', ');

  return (
    <article className="panel animate-rise overflow-hidden border-slate-200/90 bg-white/90 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="mb-4 -mx-6 -mt-6 border-b border-slate-200 bg-gradient-to-r from-cyan-50 via-white to-amber-50 px-6 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Perfil recomendado</p>
      </div>
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-ink">{props.fullName}</h3>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {displayPrice ? `A partir de R$ ${displayPrice.toFixed(2)}` : 'Sob consulta'}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-500">
        {cityLabel || 'Localizacao em atualizacao'}
        {props.categories.length > 0 ? ` • ${props.categories.join(', ')}` : ''}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <span className="rounded-full bg-slate-100 px-2 py-1 text-center">Nota {props.rating.toFixed(1)}</span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-center">{props.reviewCount} avaliacoes</span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-center">{props.yearsExperience ?? 0} anos</span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-center">{props.verificationStatus}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <TrustScoreBadge score={props.trustScore} />
        <TeachingScoreBadge score={props.teachingScore} />
      </div>
      <div className="mt-3 text-xs text-slate-500">
        <span className="font-medium text-slate-700">Disponibilidade:</span>{' '}
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 font-medium">
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
