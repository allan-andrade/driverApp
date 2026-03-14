import { InstructorMetrics } from '@driver-school/types';
import { ScoreCard } from './score-card';
import { TeachingScoreBadge } from './teaching-score-badge';
import { TrustScoreBadge } from './trust-score-badge';

export function InstructorMetricsPanel({ metrics }: { metrics: InstructorMetrics }) {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">Metrics</h3>
        <div className="flex gap-2">
          <TrustScoreBadge score={metrics.trustScore} />
          <TeachingScoreBadge score={metrics.teachingScore} />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <ScoreCard title="Marketplace" value={metrics.marketplaceScore.toFixed(1)} tone="emerald" />
        <ScoreCard title="Avaliacoes" value={metrics.totalReviews} subtitle={`Media ${metrics.averageRating.toFixed(1)}`} />
        <ScoreCard title="Aulas concluidas" value={metrics.completedLessons} subtitle={`No-show ${metrics.noShowCount}`} />
      </div>
    </section>
  );
}
