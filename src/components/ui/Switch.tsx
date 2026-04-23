import { forwardRef, useState, useCallback, useRef, useEffect } from 'react';
import { Switch as HeadlessSwitch } from '@headlessui/react';
import { cn } from '@/utils/cn';

export interface SwitchProps {
  checked: boolean;
  /** Sync or async onChange. If it returns a Promise, the switch will optimistically toggle,
   *  show a loading state, and revert on error. */
  onChange: (checked: boolean) => void | Promise<void>;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  className?: string;
  /** External loading flag (legacy support). Prefer async onChange for optimistic behavior. */
  loading?: boolean;
}

/**
 * Reusable Switch component with built-in optimistic updates.
 *
 * - **Sync onChange**: behaves like a normal controlled switch.
 * - **Async onChange** (returns a Promise): immediately toggles visually,
 *   shows a subtle loading pulse on the thumb, and reverts on error.
 *
 * @example
 * // Basic sync usage
 * <Switch checked={isActive} onChange={setIsActive} />
 *
 * @example
 * // Optimistic async usage
 * <Switch checked={rule.isActive} onChange={async (val) => {
 *   await updateRuleMutation.mutateAsync({ ruleId: rule.id, isActive: val });
 * }} />
 *
 * @example
 * // With label
 * <Switch checked={isActive} onChange={setIsActive} label="Active" />
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onChange, disabled = false, size = 'md', label, description, className, loading: externalLoading = false }, ref) => {
    // Internal optimistic state
    const [optimisticChecked, setOptimisticChecked] = useState(checked);
    const [isAsyncLoading, setIsAsyncLoading] = useState(false);
    const mountedRef = useRef(true);
    // Track the target value of the last completed async op so we don't flash
    // back to a stale prop before the query refetches.
    const pendingValueRef = useRef<boolean | null>(null);

    // Sync optimistic state from the external `checked` prop.
    // Skip while an async operation is in-flight AND also skip when the
    // async op just completed but the prop hasn't caught up yet (stale).
    useEffect(() => {
      if (isAsyncLoading) return; // in-flight – wait
      if (pendingValueRef.current !== null) {
        // We just finished an async op. Only sync once the prop
        // matches our target (query refetched) OR diverges from it
        // (meaning something else changed the value externally).
        if (checked === pendingValueRef.current) {
          // Prop caught up – clear pending and sync
          pendingValueRef.current = null;
          setOptimisticChecked(checked);
        }
        // Otherwise keep showing optimistic value until prop catches up
        return;
      }
      setOptimisticChecked(checked);
    }, [checked, isAsyncLoading]);

    useEffect(() => {
      mountedRef.current = true;
      return () => { mountedRef.current = false; };
    }, []);

    const handleChange = useCallback(async (newValue: boolean) => {
      if (isAsyncLoading) return;

      const result = onChange(newValue);

      // If onChange returns a Promise, handle optimistic update
      if (result && typeof (result as Promise<void>).then === 'function') {
        setOptimisticChecked(newValue);
        setIsAsyncLoading(true);
        pendingValueRef.current = null;
        try {
          await result;
          // Success: record the target value so we don't flash back
          if (mountedRef.current) {
            pendingValueRef.current = newValue;
          }
        } catch {
          // Revert on error
          if (mountedRef.current) {
            pendingValueRef.current = null;
            setOptimisticChecked(checked);
          }
        } finally {
          if (mountedRef.current) {
            setIsAsyncLoading(false);
          }
        }
      }
    }, [onChange, checked, isAsyncLoading]);

    const isLoading = externalLoading || isAsyncLoading;
    const isDisabled = disabled || isLoading;
    // Always use optimisticChecked so the visual state persists after
    // the async operation completes (no flash-back before query refetch).
    const displayChecked = optimisticChecked;

    const sizeClasses = {
      sm: {
        switch: 'h-5 w-9',
        thumb: 'h-3.5 w-3.5',
        translate: 'translate-x-4',
        translateOff: 'translate-x-0.5',
      },
      md: {
        switch: 'h-6 w-11',
        thumb: 'h-4 w-4',
        translate: 'translate-x-5',
        translateOff: 'translate-x-0.5',
      },
      lg: {
        switch: 'h-7 w-14',
        thumb: 'h-5 w-5',
        translate: 'translate-x-7',
        translateOff: 'translate-x-0.5',
      },
    };

    const sizes = sizeClasses[size];

    const switchElement = (
      <HeadlessSwitch
        ref={ref}
        checked={displayChecked}
        onChange={handleChange}
        disabled={isDisabled}
        className={cn(
          'relative inline-flex items-center shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',
          sizes.switch,
          displayChecked
            ? 'bg-primary-500'
            : 'bg-[#e9e9e9] dark:bg-[#313131]',
          isDisabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <span className="sr-only">{label || 'Toggle'}</span>
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
            sizes.thumb,
            displayChecked ? sizes.translate : sizes.translateOff,
            isLoading && 'animate-pulse'
          )}
        />
      </HeadlessSwitch>
    );

    if (!label && !description) {
      return switchElement;
    }

    return (
      <HeadlessSwitch.Group as="div" className="flex items-center gap-3">
        {switchElement}
        <div className="flex flex-col">
          {label && (
            <HeadlessSwitch.Label
              as="span"
              className={cn(
                'text-sm font-medium text-[var(--text-primary)]',
                isDisabled && 'opacity-50'
              )}
              passive
            >
              {label}
            </HeadlessSwitch.Label>
          )}
          {description && (
            <HeadlessSwitch.Description
              as="span"
              className={cn(
                'text-xs text-[var(--text-muted)]',
                isDisabled && 'opacity-50'
              )}
            >
              {description}
            </HeadlessSwitch.Description>
          )}
        </div>
      </HeadlessSwitch.Group>
    );
  }
);

Switch.displayName = 'Switch';

export interface StatusSwitchProps extends Omit<SwitchProps, 'checked' | 'onChange'> {
  isActive: boolean;
  onToggle: (isActive: boolean) => void;
  activeLabel?: string;
  inactiveLabel?: string;
  showLabel?: boolean;
}

/**
 * A specialized switch for active/inactive status toggles
 * 
 * @example
 * <StatusSwitch 
 *   isActive={user.isActive} 
 *   onToggle={(active) => toggleUserStatus(user.id, active)} 
 * />
 */
export function StatusSwitch({
  isActive,
  onToggle,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
  showLabel = false,
  ...props
}: StatusSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isActive}
        onChange={onToggle}
        {...props}
      />
      {showLabel && (
        <span className={cn(
          'text-sm',
          isActive ? 'text-primary-600 dark:text-primary-400' : 'text-[var(--text-muted)]'
        )}>
          {isActive ? activeLabel : inactiveLabel}
        </span>
      )}
    </div>
  );
}
