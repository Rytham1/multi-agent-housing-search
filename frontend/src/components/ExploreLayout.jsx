import { useState } from 'react';
import MapView from './MapView.jsx';
import ListingCard from './ListingCard.jsx';

// Split-pane explore view used after the user submits a query from the hero.
// Reuses MapView + ListingCard so existing data, click, and pin behavior
// keep working untouched.

export default function ExploreLayout({
  listings,
  loading,
  error,
  hoverId,
  setHoverId,
  hasFilters,
  onClearAll,
}) {
  const [mobileView, setMobileView] = useState('list');

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Mobile map/list toggle */}
      <div className="lg:hidden border-b border-ink-100 px-4 py-2 flex gap-2 bg-white">
        <button
          onClick={() => setMobileView('list')}
          className={mobileView === 'list' ? 'filter-pill-active' : 'filter-pill'}
        >
          List ({listings.length})
        </button>
        <button
          onClick={() => setMobileView('map')}
          className={mobileView === 'map' ? 'filter-pill-active' : 'filter-pill'}
        >
          Map
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Map */}
        <div
          className={`lg:flex-1 lg:min-h-0 border-r border-ink-100 ${
            mobileView === 'map' ? 'flex-1' : 'hidden'
          } lg:block`}
        >
          <MapView
            listings={listings}
            highlightedId={hoverId}
            onPinClick={setHoverId}
          />
        </div>

        {/* Listings */}
        <div
          className={`lg:w-[460px] xl:w-[520px] overflow-y-auto px-4 py-5 space-y-3 bg-cream-50/40 ${
            mobileView === 'list' ? 'flex-1' : 'hidden'
          } lg:block`}
        >
          <div className="flex items-baseline justify-between px-1">
            <h2 className="text-sm font-semibold text-ink-900">
              {loading
                ? 'Searching…'
                : `${listings.length} ${
                    listings.length === 1 ? 'result' : 'results'
                  }`}
            </h2>
            <span className="text-[11px] text-ink-500 uppercase tracking-wider">
              Davis, CA
            </span>
          </div>

          {loading && (
            <div className="text-center text-ink-500 py-8">Loading listings…</div>
          )}
          {error && (
            <div className="text-center text-red-600 py-8">Error: {error}</div>
          )}
          {!loading && !error && listings.length === 0 && (
            <EmptyState hasFilters={hasFilters} onClear={onClearAll} />
          )}
          {listings.map((l) => (
            <ListingCard
              key={l._id}
              listing={l}
              highlighted={hoverId === l._id}
              onHover={() => setHoverId(l._id)}
              onLeave={() => setHoverId(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ hasFilters, onClear }) {
  return (
    <div className="text-center py-12 px-4 bg-white rounded-2xl border border-ink-100 shadow-soft">
      <div className="text-3xl mb-2">🏠</div>
      <p className="text-sm font-medium">
        {hasFilters ? 'No listings match those filters' : 'No listings yet'}
      </p>
      <p className="text-xs text-ink-500 mt-1">
        {hasFilters
          ? 'Try widening your price range or clearing some filters.'
          : 'Check back soon — we add new listings every week.'}
      </p>
      {hasFilters && (
        <button onClick={onClear} className="btn-ghost mt-4 text-xs">
          Clear all filters
        </button>
      )}
    </div>
  );
}
