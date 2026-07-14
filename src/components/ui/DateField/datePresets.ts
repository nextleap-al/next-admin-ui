/**
 * Ready-made preset factories for `DateField`.
 *
 * These are factory functions (not constants) so the dates are computed relative to
 * "now" at render time — a preset list built once at module load would drift stale if
 * the tab stays open past midnight. Pass the result to `DateField`'s `presets` prop, or
 * just pass `presets` (the "ahead" set is the default when you pass `presets`).
 */
import { addDays, addMonths, addYears, endOfMonth, startOfDay, startOfMonth, subDays } from 'date-fns';

import type { DatePreset, DateRangePreset } from '@/components/ui/DatePicker';

/** "Today, Tomorrow, A week from now …" — forward-looking shortcuts for a single date. */
export function makeAheadDatePresets(now: Date = new Date()): DatePreset[] {
  const base = startOfDay(now);
  return [
    { label: 'Today', date: base },
    { label: 'Tomorrow', date: addDays(base, 1) },
    { label: 'A week from now', date: addDays(base, 7) },
    { label: 'A month from now', date: addMonths(base, 1) },
    { label: '3 months from now', date: addMonths(base, 3) },
    { label: '6 months from now', date: addMonths(base, 6) },
    { label: 'A year from now', date: addYears(base, 1) },
  ];
}

/** Same shortcuts as a range that runs from today up to each target (deadline pickers). */
export function makeAheadDateRangePresets(now: Date = new Date()): DateRangePreset[] {
  const base = startOfDay(now);
  const until = (to: Date): DateRangePreset['dateRange'] => ({ from: base, to });
  return [
    { label: 'Today', dateRange: until(base) },
    { label: 'Tomorrow', dateRange: until(addDays(base, 1)) },
    { label: 'A week from now', dateRange: until(addDays(base, 7)) },
    { label: 'A month from now', dateRange: until(addMonths(base, 1)) },
    { label: '3 months from now', dateRange: until(addMonths(base, 3)) },
    { label: '6 months from now', dateRange: until(addMonths(base, 6)) },
    { label: 'A year from now', dateRange: until(addYears(base, 1)) },
  ];
}

/** Backward-looking ranges for reports/filters: "Last 7 days, This month, …". */
export function makeRecentDateRangePresets(now: Date = new Date()): DateRangePreset[] {
  const today = startOfDay(now);
  return [
    { label: 'Today', dateRange: { from: today, to: today } },
    { label: 'Last 7 days', dateRange: { from: subDays(today, 6), to: today } },
    { label: 'Last 30 days', dateRange: { from: subDays(today, 29), to: today } },
    { label: 'This month', dateRange: { from: startOfMonth(today), to: endOfMonth(today) } },
    {
      label: 'Last month',
      dateRange: {
        from: startOfMonth(addMonths(today, -1)),
        to: endOfMonth(addMonths(today, -1)),
      },
    },
  ];
}

/** A start/end time pair (`HH:mm`), for the datetime-range picker's optional time presets. */
export interface TimePreset {
  label: string;
  from: string;
  to: string;
}
