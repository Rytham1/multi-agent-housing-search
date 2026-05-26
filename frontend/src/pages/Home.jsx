import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import HeroSearch from '../components/HeroSearch.jsx';
import CompactSearchBar from '../components/CompactSearchBar.jsx';
import ExploreLayout from '../components/ExploreLayout.jsx';
import FilterBar from '../components/FilterBar.jsx';

// Hone homepage — Layla-inspired chat-first landing that collapses into the
// existing map + listings split once the user submits a search or picks a
// prompt chip. All the listing data, map behavior, and click-through routes
// are unchanged; we only own the surrounding shell.

export default function HomePage() {
  const [mode, setMode] = useState('hero'); // 'hero' | 'explore'
  const [filters, setFilters] = useState({});
  const [query, setQuery] = useState(''); // what the user typed / picked
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoverId, setHoverId] = useState(null);

  // Build query string from filters. `query` is treated separately from the
  // filter object: it's the free-text the user typed into the composer and
  // maps to the existing /listings?q= search.
  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    if (filters.longTerm) p.set('longTerm', 'true');
    if (filters.sublease) p.set('sublease', 'true');
    if (filters.bedrooms) p.set('bedrooms', String(filters.bedrooms));
    if (filters.priceMin) p.set('priceMin', String(filters.priceMin));
    if (filters.priceMax) p.set('priceMax', String(filters.priceMax));
    if (filters.rating) p.set('rating', String(filters.rating));
    if (filters.maxBusMinutes) p.set('maxBusMinutes', String(filters.maxBusMinutes));
    if (filters.petFriendly) p.set('petFriendly', 'true');
    const s = p.toString();
    return s ? `?${s}` : '';
  }, [filters, query]);

  // Fetch listings in the background even on the hero screen so the explore
  // view feels instant once the user clicks in. Keeps existing API behavior.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .get(`/listings${queryString}`)
      .then((data) => {
        if (!cancelled) setListings(data.listings);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  const hasFilters = Object.values(filters).some(
    (v) => v !== '' && v !== null && v !== undefined && v !== false
  );

  function handleSubmit(text) {
    // Free-text submit — keep filters as-is, just set the query and switch
    // to explore mode. If the typed text is empty we still flip to explore
    // so the user can see what's there.
    setQuery(text);
    setMode('explore');
  }

  function handleChipClick(chip) {
    // Chips set filters explicitly. We use the chip's display text as the
    // visible query in the compact bar, but DON'T pass it to the API (it's
    // not a real address/name) — that's handled by clearing `q` here.
    setFilters((prev) => ({ ...prev, ...chip.filters }));
    setQuery(''); // free-text disabled for chips; filters do the work
    setMode('explore');
  }

  function clearOneFilter(key) {
    setFilters((prev) => {
      const next = { ...prev };
      if (key === 'price') {
        delete next.priceMin;
        delete next.priceMax;
      } else {
        delete next[key];
      }
      return next;
    });
  }

  function resetToHero() {
    setFilters({});
    setQuery('');
    setMode('hero');
  }

  if (mode === 'hero') {
    return (
      <div className="flex-1 flex flex-col">
        <HeroSearch onSubmit={handleSubmit} onChipClick={handleChipClick} />
        <HeroFooterStrip onChipClick={handleChipClick} />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 h-[calc(100dvh-64px)]">
      <CompactSearchBar
        query={query}
        filters={filters}
        onSubmit={(text) => setQuery(text)}
        onClearFilter={clearOneFilter}
        onReset={resetToHero}
      />
      {/* Keep the original filter UI accessible so power-users still get
          the bedrooms/price/rating/commute popovers we already built. */}
      <FilterBar filters={filters} onChange={setFilters} />
      <ExploreLayout
        listings={listings}
        loading={loading}
        error={error}
        hoverId={hoverId}
        setHoverId={setHoverId}
        hasFilters={hasFilters || !!query}
        onClearAll={() => {
          setFilters({});
          setQuery('');
        }}
      />
    </div>
  );
}

// Slim trust/preview strip beneath the hero — gives the landing some weight
// without dragging listings up before the user has asked. Pure marketing.
function HeroFooterStrip({ onChipClick }) {
  return (
    <section className="border-t border-ink-100/70 bg-white">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 py-12 grid sm:grid-cols-3 gap-8">
        <Feature
          title="Built for Davis"
          body="Apartments, subleases, and student-friendly options scoped to UC Davis and the surrounding neighborhoods."
        />
        <Feature
          title="Real reviews"
          body="See ratings and verified resident reviews — no SEO-spam, no fake stars."
        />
        <Feature
          title="Commute-aware"
          body="Filter by bus time to campus so your morning starts somewhere you can actually live with."
        />
      </div>
    </section>
  );
}

function Feature({ title, body }) {
  return (
    <div>
      <div className="w-9 h-9 rounded-xl bg-sage-100 text-sage-700 grid place-items-center mb-3">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h3 className="font-semibold text-ink-900 text-sm">{title}</h3>
      <p className="text-sm text-ink-500 mt-1 leading-relaxed">{body}</p>
    </div>
  );
}
