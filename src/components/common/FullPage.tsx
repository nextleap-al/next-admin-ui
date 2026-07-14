import { ErrorState } from '@/components/ui/EmptyState';

export interface SpinnerProps {
  /** Sizing classes for the ring (default `h-6 w-6`). */
  className?: string;
}

/** A minimal spinning ring, colored with the `--primary` token. */
export function Spinner({ className = 'h-6 w-6' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      style={{ color: 'var(--primary)' }}
    />
  );
}

/** Full-viewport centered `Spinner` — for the initial load of a page/route. */
export function FullPageSpinner() {
  return (
    <div
      className="flex h-screen w-full items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
    >
      <Spinner className="h-8 w-8" />
    </div>
  );
}

export interface FullPageErrorProps {
  message?: string;
  onRetry?: () => void;
}

/** Full-viewport centered `ErrorState` with an optional retry — for a page/route that failed to load. */
export function FullPageError({ message, onRetry }: FullPageErrorProps) {
  return (
    <div className="flex h-screen w-full items-center justify-center p-6">
      <ErrorState message={message ?? 'Something went wrong while loading this page.'} onRetry={onRetry} />
    </div>
  );
}
