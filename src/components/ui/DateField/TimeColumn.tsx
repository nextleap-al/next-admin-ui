import { useEffect, useRef, type ReactElement } from 'react';

import { cn } from '@/utils/cn';

export const HOURS = Array.from({ length: 24 }, (_, i) => i);
export const MINUTES = Array.from({ length: 60 }, (_, i) => i);
export const pad2 = (n: number): string => String(n).padStart(2, '0');

/** A scrollable column of numbers (hours or minutes); auto-scrolls the selected value into view. */
export function TimeColumn({
  title,
  items,
  selected,
  onPick,
  heightClass = 'h-[248px]',
  widthClass = 'w-12 sm:w-14',
  scrollFallback,
}: {
  title: string;
  items: number[];
  selected: number | null;
  onPick: (n: number) => void;
  heightClass?: string;
  widthClass?: string;
  /** Where to scroll when nothing is selected yet (e.g. 8 for the hour column, 0 for minutes). */
  scrollFallback?: number;
}): ReactElement {
  // Reveal the selected value if there is one; otherwise reveal the fallback (a sensible starting point).
  const scrollTo = selected ?? scrollFallback ?? null;
  const targetRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    targetRef.current?.scrollIntoView({ block: 'start' });
  }, [scrollTo]);

  return (
    <div className="flex flex-col">
      <div className="px-2 py-1.5 text-center text-xs font-medium text-[var(--text-muted)]">
        {title}
      </div>
      <ul className={cn('overflow-y-auto p-1', widthClass, heightClass)}>
        {items.map((n) => {
          const active = n === selected;
          return (
            <li key={n} className="py-px">
              <button
                ref={n === scrollTo ? targetRef : undefined}
                type="button"
                onClick={() => onPick(n)}
                className={cn(
                  'w-full rounded-md px-2 py-1.5 text-center text-sm tabular-nums transition-colors',
                  active
                    ? 'bg-gold-400/15 font-medium text-gold-500'
                    : 'text-[var(--text-primary)] hover:bg-[var(--surface-100)]'
                )}
              >
                {pad2(n)}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
