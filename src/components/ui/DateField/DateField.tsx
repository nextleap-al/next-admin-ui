import type { ReactElement } from 'react';

import type { DatePreset, DateRangePreset } from '@/components/ui/DatePicker';
import { cn } from '@/utils/cn';

import { DateCalendarField } from './DateCalendarField';
import { DateTimeCalendarField } from './DateTimeCalendarField';
import { DateTimeRangeCalendarField } from './DateTimeRangeCalendarField';
import { makeAheadDatePresets, makeAheadDateRangePresets, type TimePreset } from './datePresets';
import { RangeCalendarField } from './RangeCalendarField';
import { TimeSelectField } from './TimeSelectField';

/** A from–to value, each side in the same string format the single modes use (`''` = empty). */
export interface DateRangeValue {
  from: string;
  to: string;
}

export type SingleMode = 'date' | 'datetime' | 'time';
export type RangeMode = 'date-range' | 'datetime-range';

interface CommonProps {
  label?: string;
  /** Helper text under the field (hidden while an error is showing). */
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Class for the field wrapper (label + control + message). */
  className?: string;
  id?: string;
  align?: 'start' | 'center' | 'end';
  /** Earliest selectable day, `YYYY-MM-DD`. */
  min?: string;
  /** Latest selectable day, `YYYY-MM-DD`. */
  max?: string;
  enableYearNavigation?: boolean;
  'aria-label'?: string;
}

interface SingleFieldProps extends CommonProps {
  mode?: SingleMode;
  value: string;
  onChange: (value: string) => void;
  /** `true` = the built-in "Today / Tomorrow / A week from now …" shortcuts; or pass your own. */
  presets?: boolean | DatePreset[];
}

interface RangeFieldProps extends CommonProps {
  mode: RangeMode;
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  presets?: boolean | DateRangePreset[];
  /** Time shortcuts for `datetime-range` (the time-preset rail is hidden when omitted). */
  timePresets?: TimePreset[];
}

export type DateFieldProps = SingleFieldProps | RangeFieldProps;

function isRange(props: DateFieldProps): props is RangeFieldProps {
  return props.mode === 'date-range' || props.mode === 'datetime-range';
}

function resolveDatePresets(presets: SingleFieldProps['presets']): DatePreset[] | undefined {
  if (presets === true) return makeAheadDatePresets();
  return Array.isArray(presets) ? presets : undefined;
}

function resolveRangePresets(presets: RangeFieldProps['presets']): DateRangePreset[] | undefined {
  if (presets === true) return makeAheadDateRangePresets();
  return Array.isArray(presets) ? presets : undefined;
}

/**
 * One picker for every date/time need: a single date, a date + time, a time, a from–to range, or a
 * from–to range with time — each with optional preset shortcuts, and each auto-committing + pop-closing
 * the instant the selection is complete (no Apply, unlike `DatePicker`/`DateRangePicker`).
 *
 * **String in, string out** (local, timezone-naive — the same `YYYY-MM-DD` / `YYYY-MM-DDTHH:mm` / `HH:mm`
 * the native inputs emit; see the `dateValue` utils), so it drops straight into form state in place of
 * `<input type="date|datetime-local|time">`. For range modes the value is `{ from, to }`. To bind it to
 * react-hook-form use `FormDateField` / `FormDateRangeField`.
 */
export function DateField(props: DateFieldProps): ReactElement {
  const { label, hint, error, required, id, className } = props;
  const invalid = Boolean(error);

  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]"
        >
          {label}
          {required ? <span className="text-red-500"> *</span> : null}
        </label>
      ) : null}

      {isRange(props) ? <RangeControl {...props} /> : <SingleControl {...props} />}

      {invalid ? (
        <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}

function SingleControl(props: SingleFieldProps): ReactElement {
  const mode = props.mode ?? 'date';
  if (mode === 'time') return <TimeControl {...props} />;
  if (mode === 'datetime') return <DateTimeControl {...props} />;
  return <DateControl {...props} />;
}

function DateControl(props: SingleFieldProps): ReactElement {
  return (
    <DateCalendarField
      value={props.value}
      onChange={props.onChange}
      presets={resolveDatePresets(props.presets)}
      disabled={props.disabled}
      placeholder={props.placeholder}
      align={props.align}
      hasError={Boolean(props.error)}
      id={props.id}
      min={props.min}
      max={props.max}
      enableYearNavigation={props.enableYearNavigation ?? true}
      required={props.required}
      aria-invalid={Boolean(props.error) || undefined}
      aria-label={props['aria-label']}
      aria-required={props.required}
    />
  );
}

function TimeControl(props: SingleFieldProps): ReactElement {
  return (
    <TimeSelectField
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
      placeholder={props.placeholder}
      align={props.align}
      hasError={Boolean(props.error)}
      id={props.id}
      required={props.required}
      aria-invalid={Boolean(props.error) || undefined}
      aria-label={props['aria-label']}
      aria-required={props.required}
    />
  );
}

function DateTimeControl(props: SingleFieldProps): ReactElement {
  return (
    <DateTimeCalendarField
      value={props.value}
      onChange={props.onChange}
      presets={resolveDatePresets(props.presets)}
      disabled={props.disabled}
      placeholder={props.placeholder}
      align={props.align}
      hasError={Boolean(props.error)}
      id={props.id}
      min={props.min}
      max={props.max}
      enableYearNavigation={props.enableYearNavigation ?? true}
      required={props.required}
      aria-invalid={Boolean(props.error) || undefined}
      aria-label={props['aria-label']}
      aria-required={props.required}
    />
  );
}

function RangeControl(props: RangeFieldProps): ReactElement {
  // Both range modes commit + close as soon as the whole range is set (dates for date-range; dates + both
  // times for datetime-range) — no Apply.
  const shared = {
    value: props.value,
    onChange: props.onChange,
    presets: resolveRangePresets(props.presets),
    disabled: props.disabled,
    placeholder: props.placeholder,
    align: props.align,
    hasError: Boolean(props.error),
    id: props.id,
    min: props.min,
    max: props.max,
    enableYearNavigation: props.enableYearNavigation ?? true,
    required: props.required,
    'aria-invalid': Boolean(props.error) || undefined,
    'aria-label': props['aria-label'],
    'aria-required': props.required,
  };

  return props.mode === 'datetime-range' ? (
    <DateTimeRangeCalendarField {...shared} timePresets={props.timePresets} />
  ) : (
    <RangeCalendarField {...shared} />
  );
}
