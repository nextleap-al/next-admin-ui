import { useEffect, useRef, useState, type ReactElement } from 'react';
import { createPortal } from 'react-dom';

import * as Popover from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar, type DateRange, type DateRangePreset } from '@/components/ui/DatePicker';
import { cn } from '@/utils/cn';
import { splitDateTime, toDate as parseDate, toDateString } from '@/utils/dateValue';
import type { DateRangeValue } from './DateField';
import type { TimePreset } from './datePresets';
import { HOURS, MINUTES, TimeColumn, pad2 } from './TimeColumn';

/** Keep in sync with the `.nl-picker-pop` animation duration in the library stylesheet. */
const CLOSE_DELAY_MS = 300;

export interface DateTimeRangeCalendarFieldProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  presets?: DateRangePreset[];
  timePresets?: TimePreset[];
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

function parseSide(value: string): { date?: Date; h: number | null; m: number | null } {
  const { date, time } = splitDateTime(value);
  const d = parseDate(date);
  let h: number | null = null;
  let m: number | null = null;
  if (time) {
    const [hh, mm] = time.split(':');
    const hn = Number(hh);
    const mn = Number(mm);
    h = Number.isNaN(hn) ? null : hn;
    m = Number.isNaN(mn) ? null : mn;
  }
  return { date: d, h, m };
}

const triggerLabel = (value: string): string => {
  const { date, time } = splitDateTime(value);
  const d = parseDate(date);
  if (!d) return '';
  return `${format(d, 'd MMM yyyy')}${time ? ` ${time}` : ''}`;
};

const previewSide = (d: Date | undefined, h: number | null, m: number | null): string =>
  `${d ? format(d, 'd MMM') : '—'} ${h != null ? pad2(h) : '--'}:${m != null ? pad2(m) : '--'}`;

/** True below the Tailwind `sm` breakpoint (640px) — where this wide panel is repositioned + narrowed. */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const onChange = (): void => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isMobile;
}

/** A labelled Hr + Min column pair for one end of the range. */
function TimeGroup({
  title,
  hour,
  minute,
  onHour,
  onMinute,
}: {
  title: string;
  hour: number | null;
  minute: number | null;
  onHour: (n: number) => void;
  onMinute: (n: number) => void;
}): ReactElement {
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-[var(--text-secondary)]">{title}</div>
      <div className="flex w-fit rounded-lg border border-[var(--border-default)]">
        <TimeColumn
          title="Hr"
          items={HOURS}
          selected={hour}
          onPick={onHour}
          heightClass="h-[150px]"
          scrollFallback={8}
        />
        <TimeColumn
          title="Min"
          items={MINUTES}
          selected={minute}
          onPick={onMinute}
          heightClass="h-[150px]"
          scrollFallback={0}
        />
      </div>
    </div>
  );
}

/**
 * From–to date **and** time picker in a single popover — the datetime sibling of `RangeCalendarField`.
 * Pick the two dates on the calendar, then the start/end hour + minute; once all four pieces (both dates,
 * both times) are set it commits + pop-closes. Any later single change re-commits and closes. No Apply.
 * String in / string out (each side `YYYY-MM-DDTHH:mm`). Used for `DateField`'s `mode="datetime-range"`.
 */
export function DateTimeRangeCalendarField(props: DateTimeRangeCalendarFieldProps): ReactElement {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(() => parseSide(props.value.from).date);
  const [fromH, setFromH] = useState<number | null>(() => parseSide(props.value.from).h);
  const [fromM, setFromM] = useState<number | null>(() => parseSide(props.value.from).m);
  const [toDate, setToDate] = useState<Date | undefined>(() => parseSide(props.value.to).date);
  const [toH, setToH] = useState<number | null>(() => parseSide(props.value.to).h);
  const [toM, setToM] = useState<number | null>(() => parseSide(props.value.to).m);
  const [month, setMonth] = useState<Date | undefined>(() => parseSide(props.value.from).date);
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

  const isMobile = useIsMobile();

  const fromLabel = triggerLabel(props.value.from);
  const toLabel = triggerLabel(props.value.to);
  const label = fromLabel || toLabel ? `${fromLabel || '…'} – ${toLabel || '…'}` : '';

  const sideStr = (d: Date | undefined, h: number | null, m: number | null): string =>
    d && h != null && m != null ? `${toDateString(d)}T${pad2(h)}:${pad2(m)}` : '';

  // Emit each end independently — a side is only written once its date + hour + minute are all set.
  const commit = (
    fd: Date | undefined,
    fh: number | null,
    fm: number | null,
    td: Date | undefined,
    th: number | null,
    tm: number | null
  ): void => {
    props.onChange({ from: sideStr(fd, fh, fm), to: sideStr(td, th, tm) });
  };

  // Apply the whole (from date/time, to date/time) tuple, then close once every piece is set — a fresh
  // completion or any single edit of an already-complete range both commit and close.
  const apply = (
    fd: Date | undefined,
    fh: number | null,
    fm: number | null,
    td: Date | undefined,
    th: number | null,
    tm: number | null
  ): void => {
    clearTimer();
    setFromDate(fd);
    setFromH(fh);
    setFromM(fm);
    setToDate(td);
    setToH(th);
    setToM(tm);
    commit(fd, fh, fm, td, th, tm);
    if (fd && fh != null && fm != null && td && th != null && tm != null) {
      setClosing(true);
      closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
    }
  };

  const pickRange = (range: DateRange | undefined): void =>
    apply(range?.from, fromH, fromM, range?.to, toH, toM);
  const pickFromHour = (h: number): void => apply(fromDate, h, fromM, toDate, toH, toM);
  const pickFromMinute = (m: number): void => apply(fromDate, fromH, m, toDate, toH, toM);
  const pickToHour = (h: number): void => apply(fromDate, fromH, fromM, toDate, h, toM);
  const pickToMinute = (m: number): void => apply(fromDate, fromH, fromM, toDate, toH, m);

  // Date presets set only the dates (keeping any picked times); time presets set only the times (keeping
  // the picked dates) — so the two preset columns compose in either order.
  const applyDatePreset = (dr: DateRange): void => apply(dr.from, fromH, fromM, dr.to, toH, toM);

  const parseHM = (hm: string): [number, number] => {
    const [h, m] = hm.split(':');
    return [Number(h), Number(m)];
  };
  const applyTimePreset = (preset: TimePreset): void => {
    const [fh, fm] = parseHM(preset.from);
    const [th, tm] = parseHM(preset.to);
    apply(fromDate, fh, fm, toDate, th, tm);
  };

  const clear = (): void => {
    clearTimer();
    setClosing(false);
    setFromDate(undefined);
    setFromH(null);
    setFromM(null);
    setToDate(undefined);
    setToH(null);
    setToM(null);
    props.onChange({ from: '', to: '' }); // empty it but keep the popover open to pick again
  };

  const onOpenChange = (next: boolean): void => {
    clearTimer();
    if (next) {
      setClosing(false);
      const f = parseSide(props.value.from);
      const t = parseSide(props.value.to);
      setFromDate(f.date);
      setFromH(f.h);
      setFromM(f.m);
      setToDate(t.date);
      setToH(t.h);
      setToM(t.m);
      setMonth(f.date ?? t.date);
    } else if (fromDate || toDate) {
      // closing (click-outside / Esc): keep whatever's picked so far, defaulting a side's missing time to 00
      const soFar = (d: Date | undefined, h: number | null, m: number | null): string =>
        d ? `${toDateString(d)}T${pad2(h ?? 0)}:${pad2(m ?? 0)}` : '';
      props.onChange({ from: soFar(fromDate, fromH, fromM), to: soFar(toDate, toH, toM) });
    }
    setOpen(next);
  };

  const selectedRange: DateRange = { from: fromDate, to: toDate };

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
            {label || props.placeholder || 'Select date & time range'}
          </span>
        </button>
      </Popover.Trigger>

      {/* On mobile the panel is centered and nearly fills the screen, leaving almost no "outside" to tap
          (and radix's outside-detection is unreliable for a fixed-centered layer inside a modal). This
          backdrop gives a reliable tap-to-dismiss target and dims the busy background. It's rendered via its
          own portal — not inside Popover.Portal, whose asChild slot only accepts a single child. */}
      {open && isMobile
        ? createPortal(
            <div
              aria-hidden
              className="fixed inset-0 z-40 bg-black/40"
              onPointerDown={() => onOpenChange(false)}
            />,
            document.body
          )
        : null}
      <Popover.Portal>
        <Popover.Content
          align={props.align ?? 'center'}
          sideOffset={4}
          data-nl-picker="dtrange"
          className="z-50 max-w-[96vw] max-sm:w-[96vw]"
        >
          {/* Chrome lives on this inner card (not Content) so the pop animation can't stall radix's unmount. */}
          <div
            className={cn(
              'max-h-[85vh] overflow-auto rounded-xl border border-[var(--border-default)]',
              'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-lg',
              closing && 'nl-picker-pop'
            )}
          >
            <div className="flex flex-col">
              {/* Row 1: date presets (left) | calendar (right) */}
              <div className="flex">
                {props.presets && props.presets.length > 0 ? (
                  <ul className="flex w-28 shrink-0 flex-col gap-1 overflow-y-auto border-r border-[var(--border-default)] p-1 sm:w-40">
                    {props.presets.map((preset) => (
                      <li key={preset.label} className="w-full">
                        <button
                          type="button"
                          onClick={() => applyDatePreset(preset.dateRange)}
                          className="w-full rounded-md px-2 py-1 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-100)]"
                        >
                          {preset.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="min-w-0 overflow-x-auto max-sm:flex-1">
                  <Calendar
                    mode="range"
                    selected={selectedRange}
                    onSelect={pickRange}
                    month={month}
                    onMonthChange={setMonth}
                    numberOfMonths={isMobile ? 1 : 2}
                    enableYearNavigation={props.enableYearNavigation ?? true}
                    fromDate={parseDate(props.min)}
                    toDate={parseDate(props.max)}
                    initialFocus
                    classNames={{
                      months: 'flex flex-row divide-x divide-[var(--border-default)] overflow-x-auto',
                    }}
                  />
                </div>
              </div>

              {/* Row 2: time presets (left) | start/end time columns (right).
                  The border-t spans the whole card, continuing the date/time-preset divider to the edge. */}
              <div className="flex border-t border-[var(--border-default)]">
                {props.timePresets && props.timePresets.length > 0 ? (
                  <ul className="flex w-28 shrink-0 flex-col gap-1 overflow-y-auto border-r border-[var(--border-default)] p-1 sm:w-40">
                    {props.timePresets.map((preset) => (
                      <li key={preset.label} className="w-full">
                        <button
                          type="button"
                          onClick={() => applyTimePreset(preset)}
                          className="w-full rounded-md px-2 py-1 text-left hover:bg-[var(--surface-100)]"
                        >
                          <span className="block text-sm text-[var(--text-secondary)]">
                            {preset.label}
                          </span>
                          <span className="block text-xs tabular-nums text-[var(--text-muted)]">
                            {preset.from}–{preset.to}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="flex min-w-0 flex-nowrap gap-2 p-2 max-sm:flex-1">
                  <TimeGroup
                    title="Start time"
                    hour={fromH}
                    minute={fromM}
                    onHour={pickFromHour}
                    onMinute={pickFromMinute}
                  />
                  <TimeGroup
                    title="End time"
                    hour={toH}
                    minute={toM}
                    onHour={pickToHour}
                    onMinute={pickToMinute}
                  />
                </div>
              </div>

              {/* Footer — full width */}
              <div className="flex items-center justify-between gap-3 border-t border-[var(--border-default)] px-3 py-2">
                <span className="text-sm tabular-nums text-[var(--text-primary)]">
                  <span className="text-[var(--text-secondary)]">Range: </span>
                  {previewSide(fromDate, fromH, fromM)} – {previewSide(toDate, toH, toM)}
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
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
