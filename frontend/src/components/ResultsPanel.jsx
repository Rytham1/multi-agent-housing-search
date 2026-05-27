import { useEffect, useState } from 'react';
import ListingCard from './ListingCard.jsx';

// Right-side results panel for the post-search view. Owns the soft fallback
// banner (when we're rendering sample data because the API failed) and a
// gentle stagger-in animation so cards "pop" when results refresh.

export default function ResultsPanel({
  listings,
  loading,
  usingSample,
  hoverId,
  setHoverId,
  onReset,
}) {
  // Re-key the list each time it changes so the entry animation re-fires.
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [listings]);

  return (
    <div className="flex flex-col h-full bg-cream-50/40">
      {/* Header */}
      <div className="px-5 sm:px-8 pt-6 pb-4 flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink-900 tracking-tight">
            {loading ? 'Searching Davis…' : `${listings.length} matches`}
          </h2>
          <p className="text-xs text-ink-500 mt-0.5">
            Sorted by relevance · Davis, CA
          </p>
        </div>
        {!loading && listings.length > 0 && (
          <span className="text-[11px] uppercase tracking-wider text-ink-300">
            live results
          </span>
        )}
      </div>

      {usingSample && !loading && (
        <div className="mx-5 sm:mx-8 mb-3 rounded-2xl border border-cream-200 bg-white px-4 py-3 text-xs text-ink-700 shadow-soft">
          <span className="font-medium text-ink-900">Showing sample matches.</span>{' '}
          We couldn’t reach the live listings service right now — here’s a
          preview so you can keep exploring.
        </div>
      )}

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-8 pb-8 space-y-3">
        {loading && (
          <SkeletonList />
        )}

        {!loading && listings.length === 0 && (
          <EmptyState onReset={onReset} />
        )}

        {!loading &&
          listings.map((l, i) => (
            <div
              key={`${animKey}-${l._id}`}
              className="results-card-enter"
              style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
            >
              <ListingCard
                listing={l}
                highlighted={hoverId === l._id}
                onHover={() => setHoverId(l._id)}
                onLeave={() => setHoverId(null)}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-ink-100 p-2.5 flex gap-3 animate-pulse"
        >
          <div className="w-40 h-32 sm:w-44 sm:h-36 rounded-xl bg-ink-100/70" />
          <div className="flex-1 py-1 space-y-2">
            <div className="h-3.5 bg-ink-100/70 rounded w-3/4" />
            <div className="h-3 bg-ink-100/60 rounded w-1/2" />
            <div className="h-4 bg-ink-100/70 rounded w-1/3 mt-2" />
            <div className="flex gap-1.5 mt-3">
              <div className="h-5 bg-ink-100/60 rounded-full w-16" />
              <div className="h-5 bg-ink-100/60 rounded-full w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="text-center py-14 px-4 bg-white rounded-2xl border border-ink-100 shadow-soft">
      <div className="text-3xl mb-2">🏠</div>
      <p className="text-sm font-medium">No matches just yet</p>
      <p className="text-xs text-ink-500 mt-1 max-w-xs mx-auto">
        Try a different prompt on the left — e.g. “pet-friendly 1 bedroom under
        $2,000” or “sublease near campus”.
      </p>
      <button onClick={onReset} className="btn-ghost mt-4 text-xs">
        Start a new chat
      </button>
    </div>
  );
}
