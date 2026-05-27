import { useEffect, useRef, useState } from 'react';
import PromptChips, { PROMPT_CHIPS } from './PromptChips.jsx';

// Left-side conversation panel for the post-search view. Shows the user's
// submitted prompt as a chat bubble, an assistant acknowledgement, and a
// big rounded composer so they can refine the search. We don't have a real
// AI backend wired up, so "send" just becomes another search submission.

function SendIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function SparkIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  );
}

export default function ChatPanel({
  messages,
  resultCount,
  onSubmit,
  onChipClick,
  onReset,
}) {
  const [value, setValue] = useState('');
  const taRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }, [value]);

  // Auto-scroll the transcript to the bottom whenever a new message lands.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, resultCount]);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue('');
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-ink-100">
      {/* Header */}
      <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-ink-100/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-sage-200 grid place-items-center">
            <SparkIcon className="w-3.5 h-3.5 text-sage-700" />
          </span>
          <div>
            <div className="text-sm font-semibold text-ink-900 leading-tight">
              hone assistant
            </div>
            <div className="text-[11px] text-ink-500 leading-tight">
              Davis housing · live results
            </div>
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-ink-500 hover:text-ink-900 underline-offset-2 hover:underline"
        >
          New chat
        </button>
      </div>

      {/* Transcript */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-4"
      >
        {messages.map((m) => (
          <Bubble key={m.id} role={m.role}>
            {m.text}
          </Bubble>
        ))}

        {messages.length > 0 && (
          <Bubble role="assistant" subtle>
            <span className="font-medium text-ink-900">
              {resultCount > 0
                ? `Found ${resultCount} ${
                    resultCount === 1 ? 'match' : 'matches'
                  } in Davis →`
                : 'No matches yet. Try refining the prompt.'}
            </span>
          </Bubble>
        )}

        {/* Suggestion chips inside the chat — same set as the landing,
            useful for one-tap refinement. */}
        {messages.length <= 2 && (
          <div className="pt-2">
            <div className="text-[11px] uppercase tracking-wider text-ink-300 mb-2">
              Try refining with
            </div>
            <PromptChips compact onPick={(chip) => onChipClick(chip)} />
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-ink-100/70 bg-white">
        <div className="rounded-3xl bg-cream-50 border border-ink-100 focus-within:border-sage-400 focus-within:ring-4 focus-within:ring-sage-100 transition relative">
          <textarea
            ref={taRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask Hone to refine your housing search…"
            className="w-full resize-none bg-transparent px-4 pt-3.5 pb-12 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none rounded-3xl"
          />
          <div className="absolute left-3 bottom-3 text-[10px] uppercase tracking-wider text-ink-300">
            press ↵ to send
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
            aria-label="Send"
            className="absolute right-2.5 bottom-2.5 w-9 h-9 rounded-full bg-sage-300 text-ink-900 hover:bg-sage-400 disabled:bg-ink-100 disabled:text-ink-300 disabled:cursor-not-allowed grid place-items-center transition"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({ role, children, subtle }) {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-ink-900 text-white px-4 py-2.5 text-sm leading-relaxed shadow-soft">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div
        className={`max-w-[90%] rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-relaxed ${
          subtle
            ? 'bg-sage-50 text-ink-700 border border-sage-100'
            : 'bg-cream-50 text-ink-900 border border-cream-200'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

// Helper for HomePage so it doesn't need to know about PROMPT_CHIPS shape.
export { PROMPT_CHIPS };
