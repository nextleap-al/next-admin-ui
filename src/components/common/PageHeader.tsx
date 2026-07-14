import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  /**
   * Drop the built-in `mb-6` bottom margin. Use when the page already owns its vertical rhythm with a
   * `space-y-*` container (so the gap under the title isn't double-counted).
   */
  flush?: boolean;
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  flush = false,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn(!flush && 'mb-6', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
