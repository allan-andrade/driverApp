type TrustScoreBadgeProps = {
  score: number;
};

function scoreTone(score: number) {
  if (score >= 80) return 'bg-emerald-100 text-emerald-800';
  if (score >= 60) return 'bg-amber-100 text-amber-800';
  return 'bg-rose-100 text-rose-800';
}

export function TrustScoreBadge({ score }: TrustScoreBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${scoreTone(score)}`}>
      Trust {score.toFixed(1)}
    </span>
  );
}
