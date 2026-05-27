import ChatPanel from './ChatPanel.jsx';
import ResultsPanel from './ResultsPanel.jsx';

// Two-column post-search shell: chat on the left, listing results on the
// right. Deliberately does NOT render the map or the old filter pill row —
// those still exist in the codebase (MapView, FilterBar) but aren't part
// of this flow anymore.

export default function ChatResultsLayout({
  messages,
  listings,
  loading,
  usingSample,
  hoverId,
  setHoverId,
  onSubmit,
  onChipClick,
  onReset,
}) {
  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-cream-50/30">
      {/* Chat panel — fixed-ish width on desktop, full-width on mobile */}
      <div className="lg:w-[460px] xl:w-[520px] lg:min-h-0 lg:h-full max-h-[55vh] lg:max-h-none border-b lg:border-b-0 border-ink-100">
        <ChatPanel
          messages={messages}
          resultCount={listings.length}
          onSubmit={onSubmit}
          onChipClick={onChipClick}
          onReset={onReset}
        />
      </div>

      {/* Results panel — fills remaining width */}
      <div className="flex-1 min-h-0 lg:h-full">
        <ResultsPanel
          listings={listings}
          loading={loading}
          usingSample={usingSample}
          hoverId={hoverId}
          setHoverId={setHoverId}
          onReset={onReset}
        />
      </div>
    </div>
  );
}
