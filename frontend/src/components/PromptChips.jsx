// Curated quick-start chips for the hero composer. Each chip has a display
// string the user "typed" and a filters object that maps onto the existing
// Hone listings API. No new backend wiring needed — we just preset the
// search/filter state.

export const PROMPT_CHIPS = [
  {
    id: 'pet',
    display: 'Find pet-friendly apartments',
    filters: { petFriendly: true, longTerm: true },
  },
  {
    id: 'sublease',
    display: 'Show subleases near campus',
    filters: { sublease: true, maxBusMinutes: 10 },
  },
  {
    id: '2bd',
    display: 'I need a 2 bedroom under $2500',
    filters: { bedrooms: 2, priceMax: 2500 },
  },
  {
    id: 'commute',
    display: 'Best commute to UC Davis',
    filters: { maxBusMinutes: 10 },
  },
  {
    id: 'rating',
    display: 'Apartments with good ratings',
    filters: { rating: 4 },
  },
];

export default function PromptChips({ onPick, compact = false }) {
  return (
    <div
      className={`mt-4 flex flex-wrap gap-2 ${
        compact ? '' : 'sm:mt-5'
      }`}
    >
      {PROMPT_CHIPS.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onPick(chip)}
          className="group rounded-chip bg-white border border-ink-100 px-3.5 py-1.5 text-sm text-ink-700 hover:border-sage-300 hover:bg-sage-50 hover:text-ink-900 transition shadow-chip"
        >
          {chip.display}
        </button>
      ))}
    </div>
  );
}
