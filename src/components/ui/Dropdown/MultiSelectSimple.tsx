import { Fragment, ReactNode } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { cn } from '@/utils/cn';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';

export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  divider?: boolean;
}

export interface MultiSelectSimpleProps {
  /** Current selected values */
  value: (string | number)[];
  /** List of options to display */
  options: DropdownOption[];
  /** Called when selection changes */
  onChange: (value: (string | number)[]) => void;
  /** Placeholder text when no values selected */
  placeholder?: string;
  /** Label displayed above the dropdown */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Hint text displayed below the dropdown */
  hint?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the dropdown is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Custom render function for the selected label */
  renderLabel?: (options: DropdownOption[]) => ReactNode;
  /** Maximum visible selected items in display (show +N more) */
  maxDisplayItems?: number;
  /** Allow selected label text to wrap to multiple lines */
  multilineLabel?: boolean;
  /** Render dropdown options in a grid instead of a single list */
  gridOptions?: boolean;
  /** Number of columns when gridOptions is enabled */
  gridColumns?: 2 | 3 | 4;
}

/**
 * MultiSelectSimple - A multi-select dropdown with checkboxes but without search.
 * 
 * Use this for:
 * - Selecting multiple items from small option lists (<10 items)
 * - Multi-selection without filtering needed
 * - Static options like status filters
 * 
 * @example
 * ```tsx
 * <MultiSelectSimple
 *   label="Select Statuses"
 *   value={selectedStatuses}
 *   onChange={setSelectedStatuses}
 *   options={[
 *     { value: 'pending', label: 'Pending' },
 *     { value: 'approved', label: 'Approved' },
 *     { value: 'rejected', label: 'Rejected' },
 *   ]}
 * />
 * ```
 */
export function MultiSelectSimple({
  value,
  options,
  onChange,
  placeholder = 'Select...',
  label,
  error,
  hint,
  size = 'md',
  disabled = false,
  className,
  renderLabel,
  maxDisplayItems = 2,
  multilineLabel = false,
  gridOptions = false,
  gridColumns = 3,
}: MultiSelectSimpleProps) {
  const selectedOptions = options.filter(
    (opt) => !opt.divider && value.includes(opt.value)
  );

  const sizes = multilineLabel
    ? {
        sm: 'min-h-8 py-1.5 text-sm px-3',
        md: 'min-h-10 py-2 text-sm px-3',
        lg: 'min-h-12 py-2.5 text-base px-4',
      }
    : {
        sm: 'h-8 text-sm px-3',
        md: 'h-10 text-sm px-3',
        lg: 'h-12 text-base px-4',
      };

  const inputId = label?.toLowerCase().replace(/\s+/g, '-');

  const getDisplayLabel = () => {
    if (renderLabel) return renderLabel(selectedOptions);
    if (selectedOptions.length === 0) return placeholder;
    if (selectedOptions.length <= maxDisplayItems) {
      return selectedOptions.map((o) => o.label).join(', ');
    }
    return `${selectedOptions.slice(0, maxDisplayItems).map((o) => o.label).join(', ')} +${selectedOptions.length - maxDisplayItems} more`;
  };

  // Remove consecutive or trailing dividers
  const cleanedOptions = options.filter((opt, index, arr) => {
    if (!opt.divider) return true;
    const nextNonDivider = arr.slice(index + 1).find((o) => !o.divider);
    const prevNonDivider = arr.slice(0, index).reverse().find((o) => !o.divider);
    return prevNonDivider && nextNonDivider;
  });

  const toggleOption = (optionValue: string | number) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const isSelected = (optionValue: string | number) => value.includes(optionValue);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
        >
          {label}
        </label>
      )}

      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              id={inputId}
              disabled={disabled}
              className={cn(
                'w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)] transition-all duration-150',
                'hover:border-[var(--border-strong)]',
                'focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20',
                'disabled:bg-[var(--surface-100)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed',
                'flex items-center justify-between gap-2',
                error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                open && 'border-gold-400 ring-2 ring-gold-400/20',
                sizes[size]
              )}
              aria-invalid={!!error}
              aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            >
              <span
                className={cn(
                  selectedOptions.length === 0 && 'text-[var(--text-muted)]',
                  multilineLabel ? 'whitespace-normal break-words text-left' : 'truncate'
                )}
              >
                {getDisplayLabel()}
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-[var(--text-muted)] transition-transform flex-shrink-0',
                  open && 'rotate-180'
                )}
              />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Popover.Panel className="absolute z-50 mt-1 w-full rounded-xl bg-white dark:bg-[#2b2b2b] border border-[var(--border-light)] shadow-lg focus:outline-none overflow-hidden max-h-60 overflow-y-auto">
                <div className="py-1">
                  <div
                    className={cn(
                      gridOptions && 'grid gap-1 px-2',
                      gridOptions && gridColumns === 2 && 'grid-cols-2',
                      gridOptions && gridColumns === 3 && 'grid-cols-3',
                      gridOptions && gridColumns === 4 && 'grid-cols-4'
                    )}
                  >
                    {cleanedOptions.map((option, index) => {
                      if (option.divider) {
                        return (
                          <div
                            key={`divider-${index}`}
                            className={cn(
                              'h-px bg-gray-200 dark:bg-[rgb(52,52,52)] my-1',
                              gridOptions ? 'col-span-full mx-0' : 'mx-2'
                            )}
                          />
                        );
                      }

                      const selected = isSelected(option.value);

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => toggleOption(option.value)}
                          disabled={option.disabled}
                          className={cn(
                            'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors rounded-md',
                            'hover:bg-[var(--surface-100)]',
                            !gridOptions && 'rounded-none',
                            option.disabled && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          <div
                            className={cn(
                              'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                              selected
                                ? 'bg-gold-400 border-gold-400'
                                : 'border-[var(--border-strong)] bg-[var(--surface-50)]'
                            )}
                          >
                            {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                          </div>
                          <span className={cn('truncate', selected && 'text-gold-400')}>
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer with count */}
                {selectedOptions.length > 0 && (
                  <div className="px-3 py-2 border-t border-[var(--border-light)] text-xs text-[var(--text-muted)] flex items-center justify-between">
                    <span>{selectedOptions.length} selected</span>
                    <button
                      type="button"
                      onClick={() => onChange([])}
                      className="text-gold-400 hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>

      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-[var(--text-muted)]">
          {hint}
        </p>
      )}
    </div>
  );
}
