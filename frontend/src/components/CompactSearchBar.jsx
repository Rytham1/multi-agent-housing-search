import { useEffect, useState } from 'react';

// Slim version of the hero composer that sits above the map/list split.
// It carries the typed query forward (so the user sees what they asked),
// renders a few active-filter chips inline, and exposes a Reset link
// that drops the user back to the landing hero.

function SearchIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function XIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ArrowIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function CompactSearchBar({
  query,
  filters,
  onSubmit,
  onClearFilter,
  onReset,
}) {
  const [value, setValue] = useState(query);

  // Keep local input in sync if parent updates the query (e.g. user clicks
  // a chip from somewhere else later).
  useEffect(() => {
    setValue(query);
  }, [query]);

  function submit(e) {
    e?.preventDefault?.();
    onSubmit(value.trim());
  }

  const activeChips = describeFilters(filters);

  return (
    <div className="border-b border-ink-100 bg-white/90 backdrop-blur sticky top-0 z-[2000]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <form
          onSubmit={submit}
          className="flex-1 flex items-center rounded-full bg-white border border-ink-100 shadow-chip focus-within:border-sage-400 focus-within:ring-2 focus-within:ring-sage-100 transition pl-4 pr-1.5 py-1.5"
        >
          <SearchIcon className="w-4 h-4 text-ink-500 shrink-0" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Refine your search…"
            className="flex-1 bg-transparent px-3 py-1.5 text-sm placeholder:text-ink-300 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="w-8 h-8 rounded-full bg-sage-300 text-ink-900 hover:bg-sage-400 grid place-items-center transition"
          >
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          {activeChips.map((c) => (
            <button
              key={c.key}
              onClick={() => onClearFilter(c.key)}
              className="inline-flex items-center gap-1.5 rounded-chip bg-sage-100 text-ink-900 border border-sage-200 px-3 py-1 text-xs font-medium hover:bg-sage-200 transition"
              title="Remove filter"
            >
              {c.label}
              <XIcon />
            </button>
          ))}
          <button
            onClick={onReset}
            className="text-xs text-ink-500 hover:text-ink-900 underline-offset-2 hover:underline"
          >
            New search
          </button>
        </div>
      </div>
    </div>
  );
}

function describeFilters(f) {
  const out = [];
  if (f.longTerm) out.push({ key: 'longTerm', label: 'long term' });
  if (f.sublease) out.push({ key: 'sublease', label: 'sublease' });
  if (f.bedrooms) out.push({ key: 'bedrooms', label: `${f.bedrooms}+ bed` });
  if (f.priceMin || f.priceMax) {
    const min = f.priceMin ? `$${f.priceMin.toLocaleString()}` : 'min';
    const max = f.priceMax ? `$${f.priceMax.toLocaleString()}` : 'max';
    out.push({ key: 'price', label: `${min} – ${max}` });
  }
  if (f.rating) out.push({ key: 'rating', label: `${f.rating}+ stars` });
  if (f.maxBusMinutes)
    out.push({ key: 'maxBusMinutes', label: `≤ ${f.maxBusMinutes} min bus` });
  if (f.petFriendly) out.push({ key: 'petFriendly', label: 'pet-friendly' });
  return out;
}
