export function RankingFactorsPanel({ factors }: { factors?: Record<string, unknown> }) {
  if (!factors) {
    return null;
  }

  const entries = Object.entries(factors).slice(0, 8);

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Fatores de ranking</h4>
      <div className="mt-2 grid gap-2 text-xs text-slate-600 md:grid-cols-2">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between rounded-md bg-white px-2 py-1">
            <span>{key}</span>
            <span className="font-semibold">{String(value)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
