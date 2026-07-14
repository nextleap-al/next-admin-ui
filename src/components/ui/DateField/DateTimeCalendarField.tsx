import { useEffect, useRef, useState, type ReactElement } from 'react';

import * as Popover from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar, type DatePreset } from '@/components/ui/DatePicker';
import { cn } from '@/utils/cn';
import { splitDateTime, toDate as parseDate, toDateString } from '@/utils/dateValue';
import { HOURS, MINUTES, TimeColumn, pad2 } from './TimeColumn';

/** Keep in sync with the `.nl-picker-pop` animation duration in the library stylesheet. */
const CLOSE_DELAY_MS = 300;

export interface DateTimeCalendarFieldProps {
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

function parseValue(value: string): { date?: Date; hour: number | null; minute: number | null } {
  const { date, time } = splitDateTime(value);
  const parsed = parseDate(date);
  let hour: number | null = null;
  let minute: number | null = null;
  if (time) {
    const [h, m] = time.split(':');
    const hn = Number(h);
    const mn = Number(m);
    hour = Number.isNaN(hn) ? null : hn;
    minute = Number.isNaN(mn) ? null : mn;
  }
  return { date: parsed, hour, minute };
}

/**
 * Combined date + time picker in a single field/popover. Flow: pick a date → the time columns appear →
 * pick the hour, then the minute; picking the minute commits + pop-closes (no Apply). String in / string
 * out (`YYYY-MM-DDTHH:mm`). Used for `DateField`'s `mode="datetime"`.
 */
export function DateTimeCalendarField(props: DateTimeCalendarFieldProps): ReactElement {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [day, setDay] = useState<Date | undefined>(() => parseValue(props.value).date);
  const [hour, setHour] = useState<number | null>(() => parseValue(props.value).hour);
  const [minute, setMinute] = useState<number | null>(() => parseValue(props.value).minute);
  const [month, setMonth] = useState<Date | undefined>(() => parseValue(props.value).date);
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

  const parsed = parseValue(props.value);
  const label =
    parsed.date && parsed.hour != null && parsed.minute != null
      ? `${fmt(parsed.date)} ${pad2(parsed.hour)}:${pad2(parsed.minute)}`
      : '';

  // Emit only when the whole datetime is present — a datetime field has no meaning half-filled.
  const commit = (d: Date | undefined, h: number | null, m: number | null): void => {
    if (d && h != null && m != null) {
      props.onChange(`${toDateString(d)}T${pad2(h)}:${pad2(m)}`);
    }
  };

  // Apply a full (date, hour, minute) triple, then close as soon as all three are set — whether this pick
  // completed a fresh selection or changed an already-complete one (any single edit re-commits and closes).
  const applySelection = (d: Date | undefined, h: number | null, m: number | null): void => {
    clearTimer();
    setDay(d);
    setHour(h);
    setMinute(m);
    commit(d, h, m);
    if (d && h != null && m != null) {
      setClosing(true);
      closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
    }
  };

  const pickDate = (picked: Date | undefined): void => applySelection(picked, hour, minute);
  const pickHour = (h: number): void => applySelection(day, h, minute);
  const pickMinute = (m: number): void => applySelection(day, hour, m);

  const clear = (): void => {
    clearTimer();
    setClosing(false);
    setDay(undefined);
    setHour(null);
    setMinute(null);
    props.onChange(''); // empty it but keep the popover open to pick date & time again
  };

  const onOpenChange = (next: boolean): void => {
    clearTimer();
    if (next) {
      setClosing(false);
      const p = parseValue(props.value);
      setDay(p.date);
      setHour(p.hour);
      setMinute(p.minute);
      setMonth(p.date);
    } else if (day) {
      // closing (click-outside / Esc): keep what's picked so far, defaulting a missing time part to 00
      props.onChange(`${toDateString(day)}T${pad2(hour ?? 0)}:${pad2(minute ?? 0)}`);
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
          <span className={cn('truncate', !label && 'text-[var(--text-muted)]')}>
            {label || props.placeholder || 'Select date & time'}
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
                        onClick={() => pickDate(preset.date)}
                        className="w-full whitespace-nowrap rounded-md px-2.5 py-1.5 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-100)]"
                      >
                        {preset.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="overflow-x-auto">
                <div className="flex items-start">
                  <Calendar
                    mode="single"
                    selected={day}
                    onSelect={pickDate}
                    month={month}
                    onMonthChange={setMonth}
                    enableYearNavigation={props.enableYearNavigation ?? true}
                    fromDate={parseDate(props.min)}
                    toDate={parseDate(props.max)}
                    initialFocus
                  />
                  <div className="flex border-l border-[var(--border-default)]">
                    <TimeColumn
                      title="Hr"
                      items={HOURS}
                      selected={hour}
                      onPick={pickHour}
                      scrollFallback={8}
                    />
                    <TimeColumn
                      title="Min"
                      items={MINUTES}
                      selected={minute}
                      onPick={pickMinute}
                      scrollFallback={0}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-[var(--border-default)] px-3 py-2">
                  <span className="text-sm tabular-nums text-[var(--text-primary)]">
                    {day ? fmt(day) : '—'} {hour != null ? pad2(hour) : '--'}:
                    {minute != null ? pad2(minute) : '--'}
                  </span>
                  <button
                    type="button"
                    onClick={clear}
                    className="rounded-lg px-3 py-1 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-200)] hover:text-[var(--text-primary)]"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
