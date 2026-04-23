// Calendar Component based on Tremor patterns (compatible with react-day-picker v8)

import * as React from 'react';
import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
} from '@remixicon/react';
import { addYears, format, isSameMonth } from 'date-fns';
import {
  DayPicker,
  useDayPicker,
  useDayRender,
  useNavigation,
  type DayPickerRangeProps,
  type DayPickerSingleProps,
  type DayProps,
  type Matcher,
} from 'react-day-picker';
import { cn } from '@/utils/cn';

// Focus ring styles
const focusRing = [
  'outline outline-offset-2 outline-0 focus-visible:outline-2',
  'outline-gold-400',
];

interface NavigationButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  icon: React.ElementType;
  disabled?: boolean;
}

const NavigationButton = React.forwardRef<HTMLButtonElement, NavigationButtonProps>(
  ({ onClick, icon: Icon, disabled, ...props }, forwardedRef) => {
    return (
      <button
        ref={forwardedRef}
        type="button"
        disabled={disabled}
        className={cn(
          'flex size-8 shrink-0 select-none items-center justify-center rounded border p-1 outline-none transition sm:size-[30px]',
          'border-[var(--border-default)]',
          'text-[var(--text-secondary)]',
          'hover:bg-[var(--surface-100)]',
          'disabled:pointer-events-none disabled:opacity-50',
          focusRing
        )}
        onClick={onClick}
        {...props}
      >
        <Icon className="size-4" />
      </button>
    );
  }
);

NavigationButton.displayName = 'NavigationButton';

type OmitKeys<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

type KeysToOmit = 'captionLayout' | 'mode';

type SingleProps = OmitKeys<DayPickerSingleProps, KeysToOmit>;
type RangeProps = OmitKeys<DayPickerRangeProps, KeysToOmit>;

type CalendarProps =
  | ({
      mode: 'single';
    } & SingleProps)
  | ({
      mode?: undefined;
    } & SingleProps)
  | ({
      mode: 'range';
    } & RangeProps);

interface CalendarComponentProps extends Omit<CalendarProps, 'mode'> {
  mode?: 'single' | 'range';
  enableYearNavigation?: boolean;
}

const Calendar = ({
  mode = 'single',
  weekStartsOn = 1,
  numberOfMonths = 1,
  enableYearNavigation = false,
  disableNavigation,
  locale,
  className,
  classNames,
  ...props
}: CalendarComponentProps) => {
  return (
    <DayPicker
      mode={mode}
      weekStartsOn={weekStartsOn}
      numberOfMonths={numberOfMonths}
      locale={locale}
      showOutsideDays={numberOfMonths === 1}
      className={cn(className)}
      classNames={{
        months: 'flex space-x-4',
        month: 'space-y-4 w-full',
        nav: 'gap-1 flex items-center rounded-full size-full justify-between p-4',
        table: 'w-full border-collapse space-y-1',
        head_cell: cn(
          'w-9 font-medium text-sm sm:text-xs text-center pb-2',
          'text-[var(--text-muted)]'
        ),
        row: 'w-full',
        cell: cn(
          'relative p-0 text-center focus-within:relative',
          '[&:has([aria-selected])]:rounded-md',
          '[&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md',
          '[&:has([aria-selected].day-outside)]:bg-transparent'
        ),
        day: cn(
          'size-9 rounded text-sm text-[var(--text-primary)]',
          'hover:bg-[var(--surface-100)]',
          focusRing
        ),
        day_today: 'font-semibold',
        day_selected: cn(
          'rounded bg-gold-400 text-white',
          'hover:bg-gold-500'
        ),
        day_disabled: 'text-[var(--text-muted)] line-through disabled:hover:bg-transparent',
        day_outside: 'text-[var(--text-muted)]',
        day_range_middle: cn(
          'aria-selected:!bg-[var(--surface-100)] aria-selected:text-[var(--text-primary)]'
        ),
        day_range_start: 'rounded-r-none rounded-l',
        day_range_end: 'rounded-l-none rounded-r',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Day: (dayProps: DayProps) => {
          const buttonRef = React.useRef<HTMLButtonElement>(null);
          const { activeModifiers, buttonProps, divProps, isButton, isHidden } =
            useDayRender(
              dayProps.date,
              dayProps.displayMonth,
              buttonRef as React.RefObject<HTMLButtonElement>,
            );

          const { selected, today, disabled, range_middle } = activeModifiers;

          if (isHidden) {
            return <></>;
          }

          if (!isButton) {
            return (
              <div
                {...divProps}
                className={cn(
                  'flex items-center justify-center',
                  divProps.className
                )}
              />
            );
          }

          const { children: buttonChildren, className: buttonClassName, ...buttonPropsRest } = buttonProps;

          return (
            <button ref={buttonRef} {...buttonPropsRest} type="button" className={cn('relative', buttonClassName)}>
              {buttonChildren}
              {today && (
                <span
                  className={cn(
                    'absolute inset-x-1/2 bottom-1.5 h-0.5 w-4 -translate-x-1/2 rounded-[2px]',
                    {
                      'bg-gold-400': !selected,
                      'bg-white': selected,
                      'bg-[var(--text-muted)]': selected && range_middle,
                      'bg-[var(--text-muted)] opacity-50': disabled,
                    }
                  )}
                />
              )}
            </button>
          );
        },
        Caption: ({ displayMonth }) => {
          const { goToMonth, nextMonth, previousMonth, currentMonth, displayMonths } = useNavigation();
          const { numberOfMonths: numMonths, fromDate, toDate } = useDayPicker();

          const displayIndex = displayMonths.findIndex((month) => isSameMonth(displayMonth, month));
          const isFirst = displayIndex === 0;
          const isLast = displayIndex === displayMonths.length - 1;

          const hideNextButton = numMonths > 1 && (isFirst || !isLast);
          const hidePreviousButton = numMonths > 1 && (isLast || !isFirst);

          const goToPreviousYear = () => {
            const targetMonth = addYears(currentMonth, -1);
            if (previousMonth && (!fromDate || targetMonth.getTime() >= fromDate.getTime())) {
              goToMonth(targetMonth);
            }
          };

          const goToNextYear = () => {
            const targetMonth = addYears(currentMonth, 1);
            if (nextMonth && (!toDate || targetMonth.getTime() <= toDate.getTime())) {
              goToMonth(targetMonth);
            }
          };

          return (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {enableYearNavigation && !hidePreviousButton && (
                  <NavigationButton
                    disabled={disableNavigation || !previousMonth || (fromDate && addYears(currentMonth, -1).getTime() < fromDate.getTime())}
                    aria-label="Go to previous year"
                    onClick={goToPreviousYear}
                    icon={RiArrowLeftDoubleLine}
                  />
                )}
                {!hidePreviousButton && (
                  <NavigationButton
                    disabled={disableNavigation || !previousMonth}
                    aria-label="Go to previous month"
                    onClick={() => previousMonth && goToMonth(previousMonth)}
                    icon={RiArrowLeftSLine}
                  />
                )}
              </div>

              <div
                role="presentation"
                aria-live="polite"
                className="text-sm font-medium capitalize tabular-nums text-[var(--text-primary)]"
              >
                {format(displayMonth, 'LLLL yyy', { locale })}
              </div>

              <div className="flex items-center gap-1">
                {!hideNextButton && (
                  <NavigationButton
                    disabled={disableNavigation || !nextMonth}
                    aria-label="Go to next month"
                    onClick={() => nextMonth && goToMonth(nextMonth)}
                    icon={RiArrowRightSLine}
                  />
                )}
                {enableYearNavigation && !hideNextButton && (
                  <NavigationButton
                    disabled={disableNavigation || !nextMonth || (toDate && addYears(currentMonth, 1).getTime() > toDate.getTime())}
                    aria-label="Go to next year"
                    onClick={goToNextYear}
                    icon={RiArrowRightDoubleLine}
                  />
                )}
              </div>
            </div>
          );
        },
      }}
      disableNavigation={disableNavigation}
      {...(props as SingleProps & RangeProps)}
    />
  );
};

Calendar.displayName = 'Calendar';

export { Calendar, type Matcher };
