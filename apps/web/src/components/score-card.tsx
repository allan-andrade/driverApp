type ScoreCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  tone?: 'emerald' | 'amber' | 'slate';
};

const toneClass: Record<NonNullable<ScoreCardProps['tone']>, string> = {
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  amber: 'border-amber-200 bg-amber-50 text-amber-900',
  slate: 'border-slate-200 bg-slate-50 text-slate-900',
};

export function ScoreCard({ title, value, subtitle, tone = 'slate' }: ScoreCardProps) {
  return (
    <article className={`rounded-2xl border p-4 ${toneClass[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-75">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {subtitle && <p className="mt-1 text-xs opacity-75">{subtitle}</p>}
    </article>
  );
}
