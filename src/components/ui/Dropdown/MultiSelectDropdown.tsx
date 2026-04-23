import { Fragment, useState, useMemo, ReactNode } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { cn } from '@/utils/cn';
import { ChevronDown, Check, Search, X, AlertCircle } from 'lucide-react';

export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  divider?: boolean;
}

export interface MultiSelectDropdownProps {
  /** Current selected values */
  value: (string | number)[];
  /** List of options to display */
  options: DropdownOption[];
  /** Called when selection changes */
  onChange: (value: (string | number)[]) => void;
  /** Placeholder text when no values selected */
  placeholder?: string;
  /** Placeholder for the search input */
  searchPlaceholder?: string;
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
  /** Whether the dropdown is loading */
  loading?: boolean;
  /** Additional class names */
  className?: string;
  /** Custom render function for the selected label */
  renderLabel?: (options: DropdownOption[]) => ReactNode;
  /** Custom filter function */
  filterFn?: (option: DropdownOption, query: string) => boolean;
  /** Maximum visible selected items in display (show +N more) */
  maxDisplayItems?: number;
  /** Show "Select All" option at the top */
  showSelectAll?: boolean;
  /** Label for the "Select All" option */
  selectAllLabel?: string;
}

/**
 * MultiSelectDropdown - A multi-select dropdown with checkboxes and search functionality.
 * 
 * Use this for:
 * - Selecting multiple items from large option lists
 * - Multi-selection with search/filtering needed
 * - Options loaded from database/API
 * 
 * @example
 * ```tsx
 * <MultiSelectDropdown
 *   label="Select Categories"
 *   value={selectedCategories}
 *   onChange={setSelectedCategories}
 *   options={categories.map(c => ({ value: c.id, label: c.name }))}
 *   searchPlaceholder="Search categories..."
 * />
 * ```
 */
export function MultiSelectDropdown({
  value,
  options,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  label,
  error,
  hint,
  size = 'md',
  disabled = false,
  loading = false,
  className,
  renderLabel,
  filterFn,
  maxDisplayItems = 2,
  showSelectAll = false,
  selectAllLabel = 'All',
}: MultiSelectDropdownProps) {
  const [query, setQuery] = useState('');
  
  const selectableOptions = options.filter((opt) => !opt.divider && !opt.disabled);
  const allOptionValues = selectableOptions.map((opt) => opt.value);
  const isAllSelected = allOptionValues.length > 0 && allOptionValues.every((v) => value.includes(v));
  
  const selectedOptions = options.filter(
    (opt) => !opt.divider && value.includes(opt.value)
  );

  const sizes = {
    sm: 'h-8 text-sm px-3',
    md: 'h-10 text-sm px-3',
    lg: 'h-12 text-base px-4',
  };

  const inputId = label?.toLowerCase().replace(/\s+/g, '-');

  const getDisplayLabel = () => {
    if (loading) return 'Loading...';
    if (renderLabel) return renderLabel(selectedOptions);
    if (selectedOptions.length === 0) return placeholder;
    if (showSelectAll && isAllSelected) return selectAllLabel;
    if (selectedOptions.length <= maxDisplayItems) {
      return selectedOptions.map((o) => o.label).join(', ');
    }
    return `${selectedOptions.slice(0, maxDisplayItems).map((o) => o.label).join(', ')} +${selectedOptions.length - maxDisplayItems} more`;
  };

  const defaultFilter = (option: DropdownOption, q: string) =>
    option.label.toLowerCase().includes(q.toLowerCase());

  const filterFunction = filterFn || defaultFilter;

  // Remove consecutive or trailing dividers and filter by query
  const filteredOptions = useMemo(() => {
    const filtered = options.filter((opt) => {
      if (opt.divider) return true;
      return filterFunction(opt, query);
    });

    return filtered.filter((opt, index, arr) => {
      if (!opt.divider) return true;
      const nextNonDivider = arr.slice(index + 1).find((o) => !o.divider);
      const prevNonDivider = arr.slice(0, index).reverse().find((o) => !o.divider);
      return prevNonDivider && nextNonDivider;
    });
  }, [options, query, filterFunction]);

  const toggleOption = (optionValue: string | number) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const toggleAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(allOptionValues);
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
              <span className={cn(selectedOptions.length === 0 && 'text-[var(--text-muted)]', 'truncate')}>
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
              afterLeave={() => setQuery('')}
            >
              <Popover.Panel className="absolute z-50 mt-1 w-full rounded-xl bg-white dark:bg-[#2b2b2b] border border-[var(--border-light)] shadow-lg focus:outline-none overflow-hidden">
                {/* Search input */}
                <div className="p-2 border-b border-[var(--border-light)]">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      className={cn(
                        'w-full pl-8 pr-8 py-2 text-sm rounded-lg',
                        'bg-[var(--surface-50)] text-[var(--text-primary)]',
                        'border border-[var(--border-primary)] focus:outline-none focus:ring-1 focus:ring-gold-400/50',
                        'placeholder:text-[var(--text-muted)]'
                      )}
                      placeholder={searchPlaceholder}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-[var(--surface-200)] rounded"
                      >
                        <X className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Options list */}
                <div className="max-h-60 overflow-y-auto py-1">
                  {/* Select All option */}
                  {showSelectAll && !query && selectableOptions.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={toggleAll}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors',
                          'hover:bg-[var(--surface-100)]'
                        )}
                      >
                        <div
                          className={cn(
                            'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                            isAllSelected
                              ? 'bg-gold-400 border-gold-400'
                              : 'border-[var(--border-strong)] bg-[var(--surface-50)]'
                          )}
                        >
                          {isAllSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <span className={cn('font-medium', isAllSelected && 'text-gold-400')}>
                          {selectAllLabel}
                        </span>
                      </button>
                      <div className="h-px bg-gray-200 dark:bg-[rgb(52,52,52)] my-1 mx-2" />
                    </>
                  )}

                  {filteredOptions.length === 0 ? (
                    <div className="px-3 py-6 text-sm text-[var(--text-muted)] text-center">
                      No results found
                    </div>
                  ) : (
                    filteredOptions.map((option, index) => {
                      if (option.divider) {
                        return (
                          <div
                            key={`divider-${index}`}
                            className="h-px bg-gray-200 dark:bg-[rgb(52,52,52)] my-1 mx-2"
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
                            'w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors',
                            'hover:bg-[var(--surface-100)]',
                            option.disabled && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          {/* Checkbox */}
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
                    })
                  )}
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
