import { ScoreCard } from './score-card';

export function AnalyticsOverviewCards({
  items,
}: {
  items: Array<{ title: string; value: string | number; subtitle?: string; tone?: 'emerald' | 'amber' | 'slate' }>;
}) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <ScoreCard
          key={item.title}
          title={item.title}
          value={item.value}
          subtitle={item.subtitle}
          tone={item.tone}
        />
      ))}
    </section>
  );
}
