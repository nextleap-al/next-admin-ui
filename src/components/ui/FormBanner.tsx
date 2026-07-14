import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface FormBannerProps {
  /** `error` paints the error tokens; `success` the success tokens. */
  kind: 'error' | 'success';
  className?: string;
  children: ReactNode;
}

/**
 * Form-level message banner — for a top-level (non-field) API error or a success notice. Colors come
 * from the `--error*` / `--success*` theme tokens, so it re-themes with the rest of the library.
 * `FormModal` renders one automatically from its `error` prop.
 */
export function FormBanner({ kind, className, children }: FormBannerProps) {
  const isError = kind === 'error';
  return (
    <div
      role="alert"
      className={cn('rounded-md border px-3 py-2 text-sm', className)}
      style={{
        background: isError ? 'var(--error-light)' : 'var(--success-light)',
        borderColor: isError ? 'var(--error)' : 'var(--success)',
        color: isError ? 'var(--error)' : 'var(--success)',
      }}
    >
      {children}
    </div>
  );
}
