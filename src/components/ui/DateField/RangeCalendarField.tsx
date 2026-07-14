import { useEffect, useRef, useState, type ReactElement } from 'react';

import * as Popover from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar, type DateRange, type DateRangePreset } from '@/components/ui/DatePicker';
import { cn } from '@/utils/cn';
import { toDate as parseDate, toDateString } from '@/utils/dateValue';
import type { DateRangeValue } from './DateField';

export interface RangeCalendarFieldProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  presets?: DateRangePreset[];
  disabled?: boolean;
  placeholder?: string;
  align?: 'start' | 'center' | 'end';
  hasError?: boolean;
  id?: string;
  min?: string;
  max?: string;
  enableYearNavigation?: boolean;
  required?: boolean;
  'aria-invalid'?: boolean;
  'aria-label'?: string;
  'aria-required'?: boolean;
}

/** How long the completed range stays highlighted before the popover closes — a "selected, closing" beat. */
const CLOSE_DELAY_MS = 300;

const fmt = (date: Date | undefined): string => (date ? format(date, 'd MMM yyyy') : '');

function toRange(value: DateRangeValue): DateRange | undefined {
  const from = parseDate(value.from);
  const to = parseDate(value.to);
  if (!from && !to) return undefined;
  return { from, to };
}

/**
 * From–to date picker that commits and closes the moment the second date completes the range — no
 * Apply step (unlike `DateRangePicker`, which fires onChange only on an explicit Apply and owns its own
 * popover, so this drives `Calendar` inside a popover it controls instead). String in / string out.
 * Used for `DateField`'s `mode="date-range"`.
 */
export function RangeCalendarField(props: RangeCalendarFieldProps): ReactElement {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>(() => toRange(props.value));
  const [month, setMonth] = useState<Date | undefined>(() => toRange(props.value)?.from);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = (): void => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  const committed = toRange(props.value);
  const committedLabel =
    committed?.from || committed?.to ? `${fmt(committed.from)} – ${fmt(committed.to)}` : '';

  // Commit the value right away, but keep the completed range on screen for a beat before the popover
  // closes — a small "selected, closing…" cue. Commit and close are decoupled so an early dismiss still saves.
  const finalize = (range: DateRange): void => {
    clearTimer();
    setDraft(range);
    props.onChange({ from: toDateString(range.from), to: toDateString(range.to) });
    setClosing(true); // triggers the zoom "pop" on the panel
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  const handleSelect = (range: DateRange | undefined): void => {
    clearTimer();
    if (range?.from && range.to) {
      finalize(range); // both ends set → take it, then close after a beat
    } else {
      setDraft(range); // first click / partial — just reflect it
    }
  };

  const clear = (): void => {
    clearTimer();
    setClosing(false);
    setDraft(undefined);
    props.onChange({ from: '', to: '' }); // empty it but keep the popover open to pick a new range
  };

  const onOpenChange = (next: boolean): void => {
    clearTimer();
    if (next) {
      setClosing(false); // fresh open — no leftover pop from the previous close
      const initial = toRange(props.value);
      setDraft(initial);
      setMonth(initial?.from);
    } else if (draft?.from || draft?.to) {
      // closing (click-outside / Esc): keep whatever's been picked so far
      props.onChange({ from: toDateString(draft.from), to: toDateString(draft.to) });
    }
    setOpen(next);
  };

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          id={props.id}
          disabled={props.disabled}
          aria-invalid={props['aria-invalid']}
          aria-label={props['aria-label']}
          aria-required={props['aria-required'] ?? props.required}
          className={cn(
            'flex w-full cursor-pointer items-center gap-x-2 truncate rounded-xl border px-3 py-2 text-left text-sm shadow-sm transition-all',
            'bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--border-strong)]',
            'outline outline-offset-2 outline-0 focus-visible:outline-2 focus-visible:outline-gold-400',
            'disabled:cursor-not-allowed disabled:bg-[var(--surface-100)] disabled:text-[var(--text-muted)]',
            props.hasError ? 'border-red-500' : 'border-[var(--border-default)]'
          )}
        >
          <CalendarIcon className="size-4 shrink-0 text-[var(--text-muted)]" />
          <span className={cn('truncate', !committedLabel && 'text-[var(--text-muted)]')}>
            {committedLabel || props.placeholder || 'Select date range'}
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content align={props.align ?? 'center'} sideOffset={4} className="z-50 max-w-[95vw]">
          {/* Chrome lives on this inner card (not Content) so the pop animation can't stall radix's unmount. */}
          <div
            className={cn(
              'overflow-hidden rounded-xl border border-[var(--border-default)]',
              'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-lg',
              closing && 'nl-picker-pop'
            )}
          >
            <div className="flex flex-col overflow-x-auto sm:flex-row sm:items-start">
              {props.presets && props.presets.length > 0 ? (
                <ul className="flex gap-1 overflow-auto border-b border-[var(--border-default)] p-2 sm:w-40 sm:flex-col sm:border-b-0 sm:border-r">
                  {props.presets.map((preset) => (
                    <li key={preset.label} className="sm:w-full">
                      <button
                        type="button"
                        onClick={() => finalize(preset.dateRange)}
                        className="w-full whitespace-nowrap rounded-md px-2.5 py-1.5 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-100)]"
                      >
                        {preset.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="overflow-x-auto">
                <Calendar
                  mode="range"
                  selected={draft}
                  onSelect={handleSelect}
                  month={month}
                  onMonthChange={setMonth}
                  numberOfMonths={2}
                  enableYearNavigation={props.enableYearNavigation ?? true}
                  fromDate={parseDate(props.min)}
                  toDate={parseDate(props.max)}
                  initialFocus
                  classNames={{
                    months: 'flex flex-row divide-x divide-[var(--border-default)] overflow-x-auto',
                  }}
                />
                <div className="flex items-center justify-between border-t border-[var(--border-default)] p-3">
                  <p className="text-sm tabular-nums text-[var(--text-primary)]">
                    <span className="text-[var(--text-secondary)]">Range: </span>
                    <span className="font-medium">
                      {draft?.from || draft?.to ? `${fmt(draft.from)} – ${fmt(draft.to)}` : '—'}
                    </span>
                  </p>
                  {draft?.from || committed?.from ? (
                    <button
                      type="button"
                      onClick={clear}
                      className="rounded-lg px-3 py-1 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-200)] hover:text-[var(--text-primary)]"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
