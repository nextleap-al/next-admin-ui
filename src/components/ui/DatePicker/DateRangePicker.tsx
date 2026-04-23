// DateRangePicker Component with year navigation and presets support

import * as React from 'react';
import * as PopoverPrimitives from '@radix-ui/react-popover';
import { RiCalendar2Fill } from '@remixicon/react';
import { format, type Locale } from 'date-fns';
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

Trigger.displayName = 'DateRangePicker.Trigger';

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

CalendarPopover.displayName = 'DateRangePicker.CalendarPopover';

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

PresetContainer.displayName = 'DateRangePicker.PresetContainer';

// Format date helper
const formatDate = (date: Date, locale: Locale): string => {
  return format(date, 'dd MMM, yyyy', { locale });
};

// Translations
interface Translations {
  cancel?: string;
  apply?: string;
  range?: string;
  start?: string;
  end?: string;
}

// Main DateRangePicker props
export interface DateRangePickerProps {
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
  'aria-invalid'?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-required'?: boolean;
}

const DateRangePicker = ({
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
  ...props
}: DateRangePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<DateRange | undefined>(value ?? defaultValue ?? undefined);
  const [month, setMonth] = React.useState<Date | undefined>(range?.from);

  const initialRange = React.useMemo(() => {
    return range;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  React.useEffect(() => {
    setRange(value ?? defaultValue ?? undefined);
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

  const onRangeChange = (range: DateRange | undefined) => {
    setRange(range);
  };

  const onCancel = () => {
    setRange(initialRange);
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
    return `${range.from ? formatDate(range.from, locale) : ''} - ${range.to ? formatDate(range.to, locale) : ''}`;
  }, [range, locale]);

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

DateRangePicker.displayName = 'DateRangePicker';

export { DateRangePicker };
