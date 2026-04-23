import { forwardRef, type InputHTMLAttributes } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Controlled checked state */
  checked?: boolean;
  /** Indeterminate state (e.g. "select all" when only some are selected) */
  indeterminate?: boolean;
  /** Label text displayed beside the checkbox */
  label?: string;
  /** Smaller helper text below the label */
  description?: string;
  /** Visual size */
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { box: 'w-3.5 h-3.5', icon: 'w-2.5 h-2.5', label: 'text-xs', desc: 'text-xs' },
  md: { box: 'w-4 h-4', icon: 'w-3 h-3', label: 'text-sm', desc: 'text-xs' },
  lg: { box: 'w-5 h-5', icon: 'w-3.5 h-3.5', label: 'text-base', desc: 'text-sm' },
};

/**
 * Styled checkbox that works in both light and dark mode.
 *
 * Uses a hidden native `<input type="checkbox">` for accessibility (keyboard,
 * forms, screen-readers) and renders a custom visual box with a check/minus
 * icon on top.
 *
 * @example
 * <Checkbox checked={val} onChange={e => setVal(e.target.checked)} label="Active" />
 *
 * @example
 * // Indeterminate "select all"
 * <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked = false,
      indeterminate = false,
      disabled = false,
      label,
      description,
      size = 'md',
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const s = sizeMap[size];
    const isActive = checked || indeterminate;
    const inputId = id ?? (label ? `cb-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-start gap-2 select-none',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          className,
        )}
      >
        {/* Hidden native input for a11y + form support */}
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="sr-only peer"
          {...rest}
        />

        {/* Custom visual box */}
        <span
          aria-hidden
          className={cn(
            s.box,
            'relative shrink-0 mt-0.5 rounded border-2 transition-all duration-150',
            'flex items-center justify-center',
            isActive
              ? 'bg-primary-500 border-primary-500 text-white shadow-[0_0_0_1px_rgba(68,210,105,0.3)]'
              : 'bg-[var(--surface-100)] border-[var(--border-default)]',
            !disabled && !isActive && 'hover:border-primary-400 hover:bg-[var(--surface-200)]',
            !disabled && isActive && 'hover:bg-primary-600 hover:border-primary-600',
          )}
        >
          {indeterminate ? (
            <Minus className={cn(s.icon, 'stroke-[3]')} />
          ) : checked ? (
            <Check className={cn(s.icon, 'stroke-[3]')} />
          ) : null}
        </span>

        {/* Label + description */}
        {(label || description) && (
          <span className="flex flex-col">
            {label && (
              <span className={cn(s.label, 'font-medium text-[var(--text-primary)] leading-snug')}>
                {label}
              </span>
            )}
            {description && (
              <span className={cn(s.desc, 'text-[var(--text-muted)] leading-snug')}>
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
