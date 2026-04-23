// DatePicker Component with year navigation and presets support

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

Trigger.displayName = 'DatePicker.Trigger';

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

CalendarPopover.displayName = 'DatePicker.CalendarPopover';

// Preset types and container
export interface DatePreset {
  label: string;
  date: Date;
}

interface PresetContainerProps {
  presets: DatePreset[];
  onSelect: (date: Date) => void;
  currentValue?: Date;
}

const PresetContainer = ({ presets, onSelect, currentValue }: PresetContainerProps) => {
  const compareDates = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const matchesCurrent = (preset: DatePreset) => {
    return currentValue && compareDates(currentValue, preset.date);
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
            onClick={() => onSelect(preset.date)}
            aria-label={`Select ${preset.label}`}
          >
            <span>{preset.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

PresetContainer.displayName = 'DatePicker.PresetContainer';

// Format date helper
const formatDate = (date: Date, locale: Locale): string => {
  return format(date, 'dd MMM, yyyy', { locale });
};

// Translations
interface Translations {
  cancel?: string;
  apply?: string;
}

// Main DatePicker props
export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  presets?: DatePreset[];
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

const DatePicker = ({
  defaultValue,
  value,
  onChange,
  presets,
  disabled,
  disabledDays,
  disableNavigation,
  className,
  placeholder = 'Select date',
  hasError,
  translations,
  enableYearNavigation = false,
  locale = enUS,
  align = 'center',
  fromDate,
  toDate,
  ...props
}: DatePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value ?? defaultValue ?? undefined);
  const [month, setMonth] = React.useState<Date | undefined>(date);

  const initialDate = React.useMemo(() => {
    return date;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  React.useEffect(() => {
    setDate(value ?? defaultValue ?? undefined);
  }, [value, defaultValue]);

  React.useEffect(() => {
    if (date) {
      setMonth(date);
    }
  }, [date]);

  React.useEffect(() => {
    if (!open) {
      setMonth(date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onCancel = () => {
    setDate(initialDate);
    setOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onCancel();
    }
    setOpen(open);
  };

  const onDateChange = (date: Date | undefined) => {
    setDate(date);
  };

  const formattedDate = React.useMemo(() => {
    if (!date) {
      return null;
    }
    return formatDate(date, locale);
  }, [date, locale]);

  const onApply = () => {
    setOpen(false);
    onChange?.(date);
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
        {formattedDate}
      </Trigger>
      <CalendarPopover align={align}>
        <div className="flex">
          <div className="flex flex-col sm:flex-row sm:items-start">
            {presets && presets.length > 0 && (
              <div
                className={cn(
                  'relative flex h-14 w-full items-center sm:h-full sm:w-40',
                  'border-b border-[var(--border-default)] sm:border-r sm:border-b-0',
                  'overflow-auto'
                )}
              >
                <div className="absolute px-2 pr-2 sm:inset-0 sm:left-0 sm:py-2">
                  <PresetContainer currentValue={date} presets={presets} onSelect={onDateChange} />
                </div>
              </div>
            )}
            <div>
              <Calendar
                mode="single"
                month={month}
                onMonthChange={setMonth}
                selected={date}
                onSelect={onDateChange}
                disabled={disabledDays}
                locale={locale}
                enableYearNavigation={enableYearNavigation}
                disableNavigation={disableNavigation}
                fromDate={fromDate}
                toDate={toDate}
                initialFocus
                {...props}
              />
              <div className="flex items-center gap-x-2 border-t border-[var(--border-default)] p-3">
                <Button variant="ghost" className="h-8 w-full" type="button" onClick={onCancel}>
                  {translations?.cancel ?? 'Cancel'}
                </Button>
                <Button className="h-8 w-full" type="button" onClick={onApply}>
                  {translations?.apply ?? 'Apply'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CalendarPopover>
    </PopoverPrimitives.Root>
  );
};

DatePicker.displayName = 'DatePicker';

export { DatePicker };
