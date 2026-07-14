import { useEffect, useRef, useState, type ReactElement } from 'react';

import * as Popover from '@radix-ui/react-popover';
import { Clock } from 'lucide-react';

import { cn } from '@/utils/cn';
import { HOURS, MINUTES, TimeColumn, pad2 } from './TimeColumn';

/** Keep in sync with the `.nl-picker-pop` animation duration in the library stylesheet. */
const CLOSE_DELAY_MS = 300;

export interface TimeSelectFieldProps {
  /** `HH:mm`; `''` when unset. */
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  align?: 'start' | 'center' | 'end';
  hasError?: boolean;
  id?: string;
  required?: boolean;
  'aria-invalid'?: boolean;
  'aria-label'?: string;
  'aria-required'?: boolean;
}

function parse(value: string): { h: number | null; m: number | null } {
  const [hh, mm] = value.split(':');
  const h = Number(hh);
  const m = Number(mm);
  return { h: Number.isNaN(h) ? null : h, m: Number.isNaN(m) ? null : m };
}

/**
 * Standalone time picker — scrollable hour + minute columns in the same style as the datetime pickers.
 * Pick the hour, then the minute; once both are set it commits `HH:mm` and pop-closes (no Apply). Any later
 * single change re-commits and closes. String in / string out; used for `DateField`'s `mode="time"`.
 */
export function TimeSelectField(props: TimeSelectFieldProps): ReactElement {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [hour, setHour] = useState<number | null>(() => parse(props.value).h);
  const [minute, setMinute] = useState<number | null>(() => parse(props.value).m);
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

  const commit = (h: number | null, m: number | null): void => {
    if (h != null && m != null) props.onChange(`${pad2(h)}:${pad2(m)}`);
  };

  // Apply hour + minute, then close once both are set (fresh completion or any later single edit).
  const apply = (h: number | null, m: number | null): void => {
    clearTimer();
    setHour(h);
    setMinute(m);
    commit(h, m);
    if (h != null && m != null) {
      setClosing(true);
      closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
    }
  };

  const pickHour = (h: number): void => apply(h, minute);
  const pickMinute = (m: number): void => apply(hour, m);

  const clear = (): void => {
    clearTimer();
    setClosing(false);
    setHour(null);
    setMinute(null);
    props.onChange(''); // empty it but keep the popover open to pick again
  };

  const onOpenChange = (next: boolean): void => {
    clearTimer();
    if (next) {
      setClosing(false);
      const p = parse(props.value);
      setHour(p.h);
      setMinute(p.m);
    } else if (hour != null) {
      // closing (click-outside / Esc): keep what's picked so far, defaulting a missing minute to 00
      props.onChange(`${pad2(hour)}:${pad2(minute ?? 0)}`);
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
          <Clock className="size-4 shrink-0 text-[var(--text-muted)]" />
          <span className={cn('truncate', !props.value && 'text-[var(--text-muted)]')}>
            {props.value || props.placeholder || 'Select time'}
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
            <div className="flex divide-x divide-[var(--border-default)]">
              <TimeColumn
                title="Hr"
                items={HOURS}
                selected={hour}
                onPick={pickHour}
                scrollFallback={8}
                widthClass="w-24"
                heightClass="h-[200px]"
              />
              <TimeColumn
                title="Min"
                items={MINUTES}
                selected={minute}
                onPick={pickMinute}
                scrollFallback={0}
                widthClass="w-24"
                heightClass="h-[200px]"
              />
            </div>
            {hour != null || minute != null ? (
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
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
