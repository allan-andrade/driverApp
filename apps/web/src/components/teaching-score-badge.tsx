type TeachingScoreBadgeProps = {
  score: number;
};

function scoreTone(score: number) {
  if (score >= 80) return 'bg-sky-100 text-sky-800';
  if (score >= 60) return 'bg-indigo-100 text-indigo-800';
  return 'bg-slate-200 text-slate-700';
}

export function TeachingScoreBadge({ score }: TeachingScoreBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${scoreTone(score)}`}>
      Teaching {score.toFixed(1)}
    </span>
  );
}
