import { useEffect, useRef, useState, type ReactElement } from 'react';

import * as Popover from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar, type DatePreset } from '@/components/ui/DatePicker';
import { cn } from '@/utils/cn';
import { toDate as parseDate, toDateString } from '@/utils/dateValue';

/** Keep in sync with the `.nl-picker-pop` animation duration in the library stylesheet. */
const CLOSE_DELAY_MS = 300;

export interface DateCalendarFieldProps {
  value: string;
  onChange: (value: string) => void;
  presets?: DatePreset[];
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

const fmt = (date: Date | undefined): string => (date ? format(date, 'd MMM yyyy') : '');

/**
 * Single date picker that commits + closes the moment a day (or preset) is picked — no Apply step
 * (unlike `DatePicker`, which fires onChange only on an explicit Apply). String in / string out
 * (`YYYY-MM-DD`). Used for `DateField`'s `mode="date"`.
 */
export function DateCalendarField(props: DateCalendarFieldProps): ReactElement {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(() => parseDate(props.value));
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

  const selected = parseDate(props.value);

  // Commit right away, then hold the panel for a beat (with the "pop") before it closes.
  const finalize = (day: Date): void => {
    clearTimer();
    props.onChange(toDateString(day));
    setClosing(true);
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  const handleSelect = (day: Date | undefined): void => {
    clearTimer();
    if (day) finalize(day);
  };

  const clear = (): void => {
    clearTimer();
    setClosing(false);
    props.onChange(''); // empty it but keep the popover open so a new date can be picked
  };

  const onOpenChange = (next: boolean): void => {
    clearTimer();
    if (next) {
      setClosing(false);
      setMonth(parseDate(props.value));
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
          <span className={cn('truncate', !selected && 'text-[var(--text-muted)]')}>
            {fmt(selected) || props.placeholder || 'Select date'}
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
                        onClick={() => finalize(preset.date)}
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
                  mode="single"
                  selected={selected}
                  onSelect={handleSelect}
                  month={month}
                  onMonthChange={setMonth}
                  enableYearNavigation={props.enableYearNavigation ?? true}
                  fromDate={parseDate(props.min)}
                  toDate={parseDate(props.max)}
                  initialFocus
                />
                {selected ? (
                  <div className="flex items-center justify-end border-t border-[var(--border-default)] p-2">
                    <button
                      type="button"
                      onClick={clear}
                      className="rounded-lg px-3 py-1 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-200)] hover:text-[var(--text-primary)]"
                    >
                      Clear
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
