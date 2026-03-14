type MarketplaceSortBarProps = {
  defaultSortBy?: string;
};

export function MarketplaceSortBar({ defaultSortBy = 'relevance' }: MarketplaceSortBarProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ordenacao</label>
      <select name="sortBy" defaultValue={defaultSortBy} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm">
        <option value="relevance">Relevancia inteligente</option>
        <option value="price_asc">Menor preco</option>
        <option value="price_desc">Maior preco</option>
        <option value="rating">Melhor avaliacao</option>
        <option value="trust">Maior trust score</option>
        <option value="teaching">Maior teaching score</option>
      </select>
    </div>
  );
}
