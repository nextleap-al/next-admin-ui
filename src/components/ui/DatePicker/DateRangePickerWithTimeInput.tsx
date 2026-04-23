// DateRangePickerWithTimeInput Component - DateRangePicker with time input support

import * as React from 'react';
import * as PopoverPrimitives from '@radix-ui/react-popover';
import { RiCalendar2Fill } from '@remixicon/react';
import { format, type Locale, setHours, setMinutes } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from '@/utils/cn';
import { Calendar, type Matcher } from './Calendar';
import { Button } from '../Button';

// Focus ring styles
const focusRing = [
  'outline outline-offset-2 outline-0 focus-visible:outline-2',
  'outline-gold-400',
];

// Trigger styles
const triggerStyles = cn(
  // base
  'peer flex w-full cursor-pointer appearance-none items-center gap-x-2 truncate rounded-xl border px-3 py-2 shadow-xs outline-hidden transition-all text-sm',
  // background color
  'bg-[var(--bg-primary)]',
  // border color
  'border-[var(--border-default)]',
  // text color
  'text-[var(--text-primary)]',
  // placeholder color
  'placeholder-[var(--text-muted)]',
  // hover
  'hover:border-[var(--border-strong)]',
  // focus
  focusRing,
  // disabled
  'disabled:bg-[var(--surface-100)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed'
);

// Date Range type
export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

interface TriggerProps extends React.ComponentProps<'button'> {
  placeholder?: string;
  hasError?: boolean;
}

const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, children, placeholder, hasError, disabled, ...props }, forwardedRef) => {
    return (
      <PopoverPrimitives.Trigger asChild>
        <button
          ref={forwardedRef}
          disabled={disabled}
          className={cn(
            triggerStyles,
            hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        >
          <RiCalendar2Fill className="size-5 shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
          <span className={cn('flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left', !children && 'text-[var(--text-muted)]')}>
            {children ?? placeholder}
          </span>
        </button>
      </PopoverPrimitives.Trigger>
    );
  }
);

Trigger.displayName = 'DateRangePickerWithTimeInput.Trigger';

// Calendar Popover
const CalendarPopover = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitives.Content>,
  React.ComponentProps<typeof PopoverPrimitives.Content>
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <PopoverPrimitives.Portal>
      <PopoverPrimitives.Content
        ref={forwardedRef}
        sideOffset={10}
        side="bottom"
        align="center"
        avoidCollisions
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn(
          // base
          'relative z-50 overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg',
          // widths
          'min-w-[calc(var(--radix-select-trigger-width)-2px)] max-w-[95vw]',
          // animation
          'will-change-[transform,opacity]',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className
        )}
        {...props}
      >
        {children}
      </PopoverPrimitives.Content>
    </PopoverPrimitives.Portal>
  );
});

CalendarPopover.displayName = 'DateRangePickerWithTimeInput.CalendarPopover';

// Preset types and container
export interface DateRangePreset {
  label: string;
  dateRange: DateRange;
}

interface PresetContainerProps {
  presets: DateRangePreset[];
  onSelect: (range: DateRange) => void;
  currentValue?: DateRange;
}

const PresetContainer = ({ presets, onSelect, currentValue }: PresetContainerProps) => {
  const compareDates = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const compareRanges = (range1: DateRange, range2: DateRange) => {
    const from1 = range1.from;
    const from2 = range2.from;
    let equalFrom = false;
    if (from1 && from2) {
      equalFrom = compareDates(from1, from2);
    }

    const to1 = range1.to;
    const to2 = range2.to;
    let equalTo = false;
    if (to1 && to2) {
      equalTo = compareDates(to1, to2);
    }

    return equalFrom && equalTo;
  };

  const matchesCurrent = (preset: DateRangePreset) => {
    return currentValue && compareRanges(currentValue, preset.dateRange);
  };

  return (
    <ul className="flex items-start gap-x-2 sm:flex-col">
      {presets.map((preset) => (
        <li key={`preset-${preset.label}`} className="sm:w-full sm:py-px">
          <button
            type="button"
            title={preset.label}
            className={cn(
              // base
              'relative w-full overflow-hidden rounded-md border px-2.5 py-1.5 text-left text-base text-ellipsis whitespace-nowrap shadow-xs outline-hidden transition-all sm:border-none sm:py-2 sm:text-sm sm:shadow-none',
              // text color
              'text-[var(--text-secondary)]',
              // border color
              'border-[var(--border-default)]',
              // focus
              focusRing,
              // background color
              'focus-visible:bg-[var(--surface-100)]',
              'hover:bg-[var(--surface-100)]',
              {
                'bg-[var(--surface-100)]': matchesCurrent(preset),
              }
            )}
            onClick={() => onSelect(preset.dateRange)}
            aria-label={`Select ${preset.label}`}
          >
            <span>{preset.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

PresetContainer.displayName = 'DateRangePickerWithTimeInput.PresetContainer';

// Time Input Component
interface TimeInputProps {
  value: { hours: number; minutes: number };
  onChange: (value: { hours: number; minutes: number }) => void;
  label?: string;
  disabled?: boolean;
}

const TimeInput = ({ value, onChange, label, disabled }: TimeInputProps) => {
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hours = Math.min(23, Math.max(0, parseInt(e.target.value) || 0));
    onChange({ ...value, hours });
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
    onChange({ ...value, minutes });
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
      )}
      <div className="flex items-center gap-1">
        <input
          type="number"
          min="0"
          max="23"
          value={value.hours.toString().padStart(2, '0')}
          onChange={handleHoursChange}
          disabled={disabled}
          className={cn(
            'w-12 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] px-2 py-1.5 text-center text-sm',
            'focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20',
            'disabled:bg-[var(--surface-100)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed'
          )}
          placeholder="HH"
        />
        <span className="text-[var(--text-muted)] font-medium">:</span>
        <input
          type="number"
          min="0"
          max="59"
          value={value.minutes.toString().padStart(2, '0')}
          onChange={handleMinutesChange}
          disabled={disabled}
          className={cn(
            'w-12 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] px-2 py-1.5 text-center text-sm',
            'focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20',
            'disabled:bg-[var(--surface-100)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed'
          )}
          placeholder="MM"
        />
      </div>
    </div>
  );
};

TimeInput.displayName = 'DateRangePickerWithTimeInput.TimeInput';

// Format date helper
const formatDate = (date: Date, locale: Locale, showTime: boolean = false): string => {
  if (showTime) {
    return format(date, 'dd MMM, yyyy HH:mm', { locale });
  }
  return format(date, 'dd MMM, yyyy', { locale });
};

// Translations
interface Translations {
  cancel?: string;
  apply?: string;
  range?: string;
  start?: string;
  end?: string;
  startTime?: string;
  endTime?: string;
}

// Main DateRangePickerWithTimeInput props
export interface DateRangePickerWithTimeInputProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  presets?: DateRangePreset[];
  disabled?: boolean;
  disabledDays?: Matcher | Matcher[];
  disableNavigation?: boolean;
  className?: string;
  placeholder?: string;
  enableYearNavigation?: boolean;
  hasError?: boolean;
  locale?: Locale;
  translations?: Translations;
  align?: 'center' | 'end' | 'start';
  fromDate?: Date;
  toDate?: Date;
  fromYear?: number;
  toYear?: number;
  required?: boolean;
  id?: string;
  showTimePicker?: boolean;
  'aria-invalid'?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-required'?: boolean;
}

const DateRangePickerWithTimeInput = ({
  defaultValue,
  value,
  onChange,
  presets,
  disabled,
  disableNavigation,
  disabledDays,
  enableYearNavigation = false,
  locale = enUS,
  placeholder = 'Select date range',
  hasError,
  translations,
  align = 'center',
  className,
  fromDate,
  toDate,
  showTimePicker = true,
  ...props
}: DateRangePickerWithTimeInputProps) => {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<DateRange | undefined>(value ?? defaultValue ?? undefined);
  const [month, setMonth] = React.useState<Date | undefined>(range?.from);

  // Time states
  const [startTime, setStartTime] = React.useState<{ hours: number; minutes: number }>({
    hours: range?.from ? range.from.getHours() : 9,
    minutes: range?.from ? range.from.getMinutes() : 0,
  });
  const [endTime, setEndTime] = React.useState<{ hours: number; minutes: number }>({
    hours: range?.to ? range.to.getHours() : 17,
    minutes: range?.to ? range.to.getMinutes() : 0,
  });

  const initialRange = React.useMemo(() => {
    return range;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const initialStartTime = React.useMemo(() => {
    return startTime;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const initialEndTime = React.useMemo(() => {
    return endTime;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  React.useEffect(() => {
    const newRange = value ?? defaultValue ?? undefined;
    setRange(newRange);
    if (newRange?.from) {
      setStartTime({
        hours: newRange.from.getHours(),
        minutes: newRange.from.getMinutes(),
      });
    }
    if (newRange?.to) {
      setEndTime({
        hours: newRange.to.getHours(),
        minutes: newRange.to.getMinutes(),
      });
    }
  }, [value, defaultValue]);

  React.useEffect(() => {
    if (range) {
      setMonth(range.from);
    }
  }, [range]);

  React.useEffect(() => {
    if (!open) {
      setMonth(range?.from);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onRangeChange = (newRange: DateRange | undefined) => {
    if (newRange && showTimePicker) {
      // Apply current time values to the selected dates
      let fromWithTime = newRange.from;
      let toWithTime = newRange.to;

      if (fromWithTime) {
        fromWithTime = setHours(setMinutes(fromWithTime, startTime.minutes), startTime.hours);
      }
      if (toWithTime) {
        toWithTime = setHours(setMinutes(toWithTime, endTime.minutes), endTime.hours);
      }

      setRange({ from: fromWithTime, to: toWithTime });
    } else {
      setRange(newRange);
    }
  };

  const onStartTimeChange = (time: { hours: number; minutes: number }) => {
    setStartTime(time);
    if (range?.from) {
      const newFrom = setHours(setMinutes(range.from, time.minutes), time.hours);
      setRange({ ...range, from: newFrom });
    }
  };

  const onEndTimeChange = (time: { hours: number; minutes: number }) => {
    setEndTime(time);
    if (range?.to) {
      const newTo = setHours(setMinutes(range.to, time.minutes), time.hours);
      setRange({ ...range, to: newTo });
    }
  };

  const onCancel = () => {
    setRange(initialRange);
    setStartTime(initialStartTime);
    setEndTime(initialEndTime);
    setOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onCancel();
    }
    setOpen(open);
  };

  const displayRange = React.useMemo(() => {
    if (!range) {
      return null;
    }
    return `${range.from ? formatDate(range.from, locale, showTimePicker) : ''} - ${range.to ? formatDate(range.to, locale, showTimePicker) : ''}`;
  }, [range, locale, showTimePicker]);

  const onApply = () => {
    setOpen(false);
    onChange?.(range);
  };

  return (
    <PopoverPrimitives.Root open={open} onOpenChange={onOpenChange}>
      <Trigger
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        hasError={hasError}
        aria-required={props.required || props['aria-required']}
        aria-invalid={props['aria-invalid']}
        aria-label={props['aria-label']}
        aria-labelledby={props['aria-labelledby']}
      >
        {displayRange}
      </Trigger>
      <CalendarPopover align={align}>
        <div className="flex">
          <div className="flex flex-col overflow-x-auto sm:flex-row sm:items-start">
            {presets && presets.length > 0 && (
              <div
                className={cn(
                  'relative flex h-16 w-full items-center sm:h-full sm:w-40',
                  'border-b border-[var(--border-default)] sm:border-r sm:border-b-0',
                  'overflow-auto'
                )}
              >
                <div className="absolute px-3 sm:inset-0 sm:left-0 sm:p-2">
                  <PresetContainer currentValue={range} presets={presets} onSelect={onRangeChange} />
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <Calendar
                mode="range"
                selected={range}
                onSelect={onRangeChange}
                month={month}
                onMonthChange={setMonth}
                numberOfMonths={2}
                disabled={disabledDays}
                disableNavigation={disableNavigation}
                enableYearNavigation={enableYearNavigation}
                locale={locale}
                fromDate={fromDate}
                toDate={toDate}
                initialFocus
                classNames={{
                  months: 'flex flex-row divide-x divide-[var(--border-default)] overflow-x-auto',
                }}
                {...props}
              />

              {/* Time Inputs Section */}
              {showTimePicker && (
                <div className="border-t border-[var(--border-default)] p-3">
                  <div className="flex items-center justify-center gap-6">
                    <TimeInput
                      label={translations?.startTime ?? 'Start Time'}
                      value={startTime}
                      onChange={onStartTimeChange}
                      disabled={!range?.from}
                    />
                    <span className="text-[var(--text-muted)] mt-5">→</span>
                    <TimeInput
                      label={translations?.endTime ?? 'End Time'}
                      value={endTime}
                      onChange={onEndTimeChange}
                      disabled={!range?.to}
                    />
                  </div>
                </div>
              )}

              <div className="border-t border-[var(--border-default)] p-3 sm:flex sm:items-center sm:justify-between">
                <p className="text-[var(--text-primary)] tabular-nums">
                  <span className="text-[var(--text-secondary)]">{translations?.range ?? 'Range'}:</span>{' '}
                  <span className="font-medium">{displayRange}</span>
                </p>
                <div className="mt-2 flex items-center gap-x-2 sm:mt-0">
                  <Button variant="ghost" className="h-8 w-full sm:w-fit" type="button" onClick={onCancel}>
                    {translations?.cancel ?? 'Cancel'}
                  </Button>
                  <Button className="h-8 w-full sm:w-fit" type="button" onClick={onApply}>
                    {translations?.apply ?? 'Apply'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CalendarPopover>
    </PopoverPrimitives.Root>
  );
};

DateRangePickerWithTimeInput.displayName = 'DateRangePickerWithTimeInput';

export { DateRangePickerWithTimeInput };
