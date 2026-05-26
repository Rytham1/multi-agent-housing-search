import { useState, useRef, useEffect } from 'react';
import PromptChips from './PromptChips.jsx';

// Layla-inspired chat-first hero. The big rounded textarea is the primary CTA;
// pressing Enter (without Shift) or hitting the send button calls onSubmit,
// which the page uses to collapse the hero into the explore layout.

function SendIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function SparkIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  );
}

export default function HeroSearch({ onSubmit, onChipClick }) {
  const [value, setValue] = useState('');
  const taRef = useRef(null);

  // Auto-grow the textarea to fit content but cap it so the layout doesn't
  // jump around. Feels closer to a chat composer than a plain input.
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
  }, [value]);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-50 via-white to-white">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
          {/* Left: copy + composer */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sage-100 text-sage-700 px-3 py-1 text-xs font-medium mb-5">
              <SparkIcon className="w-3.5 h-3.5" />
              <span>Davis housing, made simple</span>
            </div>

            <h1 className="font-semibold text-ink-900 leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-[3.5rem]">
              Find your Davis home.
              <span className="block text-sage-600">Faster.</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-ink-500 max-w-xl">
              Tell hone what you’re looking for and we’ll surface apartments,
              subleases, and student-friendly options around UC Davis.
            </p>

            {/* Composer */}
            <div className="mt-8 max-w-2xl">
              <div className="group relative rounded-3xl bg-white border border-ink-100 shadow-soft focus-within:border-sage-400 focus-within:ring-4 focus-within:ring-sage-100 transition">
                <textarea
                  ref={taRef}
                  rows={1}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Ask anything — e.g. “2 bedroom under $2,500 near campus”"
                  className="w-full resize-none bg-transparent px-5 pt-4 pb-14 text-base text-ink-900 placeholder:text-ink-300 focus:outline-none rounded-3xl"
                />
                <div className="absolute left-3 bottom-3 flex items-center gap-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-ink-300 px-2">
                    hone · ai search
                  </span>
                </div>
                <button
                  type="button"
                  onClick={submit}
                  disabled={!value.trim()}
                  aria-label="Search"
                  className="absolute right-3 bottom-3 w-10 h-10 rounded-full bg-sage-300 text-ink-900 hover:bg-sage-400 disabled:bg-ink-100 disabled:text-ink-300 disabled:cursor-not-allowed grid place-items-center transition shadow-chip"
                >
                  <SendIcon className="w-4 h-4" />
                </button>
              </div>

              <PromptChips
                onPick={(chip) => {
                  setValue(chip.display);
                  onChipClick(chip);
                }}
              />
            </div>
          </div>

          {/* Right: organic visual — housing-themed, not Layla's artwork */}
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative hidden lg:block">
      {/* Big organic blob — pure CSS gradients, no external images. */}
      <div
        aria-hidden
        className="relative aspect-[5/6] w-full max-w-[480px] ml-auto"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-sage-200 via-cream-100 to-sky-200"
          style={{
            borderRadius: '52% 48% 38% 62% / 46% 56% 44% 54%',
            boxShadow: '0 30px 80px -20px rgba(31,31,31,0.15)',
          }}
        />
        <div
          aria-hidden
          className="absolute -top-8 -left-6 w-40 h-40 bg-sage-300/40 rounded-full blur-2xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-6 -right-4 w-44 h-44 bg-sky-300/40 rounded-full blur-2xl"
        />

        {/* Floating UI cards — decorative, abstract, not pretending to be
            real listings. They give a sense of "what hone shows you". */}
        <div className="absolute top-8 left-4 sm:left-8 w-56 rotate-[-4deg]">
          <FloatingCard
            tag="apartment"
            title="Sunny 2 bd near Wright Hall"
            sub="≤ 8 min by bus · pet-friendly"
            price="$2,150"
            accent="sage"
          />
        </div>
        <div className="absolute bottom-10 right-2 sm:right-4 w-60 rotate-[3deg]">
          <FloatingCard
            tag="sublease"
            title="Summer sublease · Drew Ave"
            sub="Furnished · 5 min to campus"
            price="$895"
            accent="sky"
          />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-10 w-48 rotate-[-2deg]">
          <FloatingPill />
        </div>
      </div>
    </div>
  );
}

function FloatingCard({ tag, title, sub, price, accent }) {
  const tagClass =
    accent === 'sky'
      ? 'bg-sky-200 text-ink-900'
      : 'bg-sage-200 text-ink-900';
  return (
    <div className="rounded-2xl bg-white/95 backdrop-blur border border-ink-100 shadow-soft p-3">
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1 rounded-chip px-2 py-0.5 text-[10px] font-medium ${tagClass}`}
        >
          {tag}
        </span>
        <span className="text-sm font-semibold text-ink-900">{price}/mo</span>
      </div>
      <div className="mt-2 text-sm font-medium text-ink-900 leading-snug">
        {title}
      </div>
      <div className="text-[11px] text-ink-500 mt-0.5">{sub}</div>
    </div>
  );
}

function FloatingPill() {
  return (
    <div className="rounded-full bg-white border border-ink-100 shadow-soft px-4 py-2 flex items-center gap-2 text-xs text-ink-700">
      <span className="w-2 h-2 rounded-full bg-sage-400" />
      <span className="font-medium">Live listings in Davis</span>
    </div>
  );
}
