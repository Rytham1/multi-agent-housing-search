import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api/client.js';
import HeroSearch from '../components/HeroSearch.jsx';
import ChatResultsLayout from '../components/ChatResultsLayout.jsx';
import { SAMPLE_LISTINGS } from '../lib/sampleListings.js';

// Hone homepage:
//
//   1. mode === 'hero'    — Layla-inspired landing with big chat box +
//                           prompt chips. Map and old filter bar are NOT
//                           rendered here.
//   2. mode === 'explore' — Chat panel on the left, listing results on the
//                           right. No map, no filter pill row.
//
// The listings API call still uses the same /listings endpoint, but if it
// fails we silently fall back to SAMPLE_LISTINGS and surface a friendly
// banner instead of a raw red error.

export default function HomePage() {
  const [mode, setMode] = useState('hero');
  const [filters, setFilters] = useState({});
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]); // [{ id, role, text }]
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usingSample, setUsingSample] = useState(false);
  const [hoverId, setHoverId] = useState(null);

  // Used to assign stable ids to chat messages without pulling in uuid.
  const msgIdRef = useRef(0);
  const nextMsgId = () => `m-${++msgIdRef.current}`;

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    if (filters.longTerm) p.set('longTerm', 'true');
    if (filters.sublease) p.set('sublease', 'true');
    if (filters.bedrooms) p.set('bedrooms', String(filters.bedrooms));
    if (filters.priceMin) p.set('priceMin', String(filters.priceMin));
    if (filters.priceMax) p.set('priceMax', String(filters.priceMax));
    if (filters.rating) p.set('rating', String(filters.rating));
    if (filters.maxBusMinutes)
      p.set('maxBusMinutes', String(filters.maxBusMinutes));
    if (filters.petFriendly) p.set('petFriendly', 'true');
    const s = p.toString();
    return s ? `?${s}` : '';
  }, [filters, query]);

  // Fetch listings whenever the filters/query change AND we're in explore
  // mode. On the hero screen we skip the fetch — there's nothing to render
  // it into, and it avoids surprising 500s before the user has done anything.
  useEffect(() => {
    if (mode !== 'explore') return;
    let cancelled = false;
    setLoading(true);
    setUsingSample(false);
    api
      .get(`/listings${queryString}`)
      .then((data) => {
        if (cancelled) return;
        const live = Array.isArray(data?.listings) ? data.listings : [];
        if (live.length === 0) {
          // The API succeeded but returned nothing — leave the panel empty
          // (the EmptyState in ResultsPanel handles this). Do NOT flip to
          // sample data here; an empty result is a valid answer.
          setListings([]);
        } else {
          setListings(live);
        }
      })
      .catch((err) => {
        // Don't let raw "Request failed: 500" dominate the UI. Log for the
        // developer, surface sample data so the redesign is still reviewable.
        // eslint-disable-next-line no-console
        console.error('[hone] /listings failed, using sample data:', err);
        if (cancelled) return;
        setListings(SAMPLE_LISTINGS);
        setUsingSample(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [queryString, mode]);

  function handleHeroSubmit(text) {
    setQuery(text);
    appendUserMessage(text);
    setMode('explore');
  }

  function handleHeroChip(chip) {
    setFilters((prev) => ({ ...prev, ...chip.filters }));
    setQuery('');
    appendUserMessage(chip.display);
    setMode('explore');
  }

  function handleChatSubmit(text) {
    setQuery(text);
    appendUserMessage(text);
  }

  function handleChatChip(chip) {
    setFilters((prev) => ({ ...prev, ...chip.filters }));
    // Don't pass chip text to the API — it isn't a real address/name.
    setQuery('');
    appendUserMessage(chip.display);
  }

  function appendUserMessage(text) {
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: nextMsgId(), role: 'user', text },
    ]);
  }

  function resetToHero() {
    setFilters({});
    setQuery('');
    setMessages([]);
    setListings([]);
    setUsingSample(false);
    setMode('hero');
  }

  if (mode === 'hero') {
    return (
      <div className="flex-1 flex flex-col">
        <HeroSearch onSubmit={handleHeroSubmit} onChipClick={handleHeroChip} />
        <HeroFooterStrip />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 h-[calc(100dvh-64px)]">
      <ChatResultsLayout
        messages={messages}
        listings={listings}
        loading={loading}
        usingSample={usingSample}
        hoverId={hoverId}
        setHoverId={setHoverId}
        onSubmit={handleChatSubmit}
        onChipClick={handleChatChip}
        onReset={resetToHero}
      />
    </div>
  );
}

// Marketing strip beneath the landing hero. Stays on the hero only — the
// post-search view has no room for it.
function HeroFooterStrip() {
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
