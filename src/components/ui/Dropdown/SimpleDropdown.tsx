import { Fragment, ReactNode } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { cn } from '@/utils/cn';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';

export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  divider?: boolean;
}

export interface SimpleDropdownProps {
  /** Current selected value */
  value: string | number | null;
  /** List of options to display */
  options: DropdownOption[];
  /** Called when selection changes */
  onChange: (value: string | number) => void;
  /** Placeholder text when no value selected */
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
  renderLabel?: (option: DropdownOption | null) => ReactNode;
}

/**
 * SimpleDropdown - A dropdown component without search functionality.
 * 
 * Use this for:
 * - Static options with few items (<10)
 * - Simple form selects
 * - Quick selections that don't need filtering
 * 
 * @example
 * ```tsx
 * <SimpleDropdown
 *   label="Select Status"
 *   value={status}
 *   onChange={setStatus}
 *   options={[
 *     { value: 'active', label: 'Active' },
 *     { value: 'inactive', label: 'Inactive' },
 *   ]}
 * />
 * ```
 */
export function SimpleDropdown({
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
}: SimpleDropdownProps) {
  // Find selected option - handle null/undefined/empty string equivalence
  const selectedOption = options.find((opt) => {
    if (opt.divider) return false;
    // Handle null/undefined/empty string as equivalent
    const normalizedValue = value === null || value === undefined ? '' : value;
    const normalizedOptValue = opt.value === null || opt.value === undefined ? '' : opt.value;
    return normalizedOptValue === normalizedValue;
  });

  const sizes = {
    sm: 'h-8 text-sm px-3',
    md: 'h-10 text-sm px-3',
    lg: 'h-12 text-base px-4',
  };

  const inputId = label?.toLowerCase().replace(/\s+/g, '-');

  const displayLabel = renderLabel
    ? renderLabel(selectedOption || null)
    : selectedOption?.label || placeholder;

  // Remove consecutive or trailing dividers
  const cleanedOptions = options.filter((opt, index, arr) => {
    if (!opt.divider) return true;
    const nextNonDivider = arr.slice(index + 1).find((o) => !o.divider);
    const prevNonDivider = arr.slice(0, index).reverse().find((o) => !o.divider);
    return prevNonDivider && nextNonDivider;
  });

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

      <Listbox value={value ?? undefined} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button
              id={inputId}
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
              <span className={cn(!selectedOption && 'text-[var(--text-muted)]')}>
                {displayLabel}
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-[var(--text-muted)] transition-transform flex-shrink-0',
                  open && 'rotate-180'
                )}
              />
            </Listbox.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Listbox.Options className="absolute z-50 mt-1 w-full rounded-xl bg-white dark:bg-[#2b2b2b] border border-[var(--border-light)] shadow-lg focus:outline-none overflow-hidden max-h-60 overflow-y-auto">
                <div className="py-1">
                  {cleanedOptions.map((option, index) => {
                    if (option.divider) {
                      return (
                        <div
                          key={`divider-${index}`}
                          className="h-px bg-gray-200 dark:bg-[rgb(52,52,52)] my-1 mx-2"
                        />
                      );
                    }

                    return (
                      <Listbox.Option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        className={({ active, selected }) =>
                          cn(
                            'w-full flex items-center justify-between px-3 py-2 text-sm cursor-pointer',
                            active && 'bg-[var(--surface-100)]',
                            selected && 'text-gold-400',
                            option.disabled && 'opacity-50 cursor-not-allowed'
                          )
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span>{option.label}</span>
                            {selected && <Check className="w-4 h-4 text-gold-400" />}
                          </>
                        )}
                      </Listbox.Option>
                    );
                  })}
                </div>
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>

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
