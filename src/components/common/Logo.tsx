import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface LogoSources {
  /** Small square mark used in collapsed state */
  mark?: string;
  /** Stacked layout (light mode) */
  stacked?: string;
  /** Stacked layout (dark mode) */
  stackedDark?: string;
  /** Horizontal layout (light mode) */
  horizontal?: string;
  /** Horizontal layout (dark mode) */
  horizontalDark?: string;
}

export interface LogoProps {
  /** Asset URLs for the different variants */
  sources: LogoSources;
  /** Alt text for accessibility */
  alt?: string;
  /** Render only the square mark */
  collapsed?: boolean;
  /** Layout when not collapsed */
  variant?: 'horizontal' | 'stacked';
  /** Whether dark-mode assets should be used */
  isDark?: boolean;
  /** Link destination; if provided, renders the logo wrapped in a link */
  href?: string;
  /** Optional link component (e.g. react-router's `Link`). Defaults to `<a>`. */
  LinkComponent?: React.ComponentType<{ to: string; className?: string; children?: ReactNode }>;
  className?: string;
}

function DefaultLink({ to, className, children }: { to: string; className?: string; children?: ReactNode }) {
  return (
    <a href={to} className={className}>
      {children}
    </a>
  );
}

/**
 * Generic Logo component. The consumer provides the asset URLs via `sources`.
 * Supports collapsed (icon-only), horizontal, and stacked variants with
 * optional dark-mode overrides.
 */
export function Logo({
  sources,
  alt = 'Logo',
  collapsed = false,
  variant = 'horizontal',
  isDark = false,
  href,
  LinkComponent = DefaultLink,
  className,
}: LogoProps) {
  const content = collapsed ? (
    <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center overflow-hidden">
      {sources.mark && (
        <img src={sources.mark} alt={alt} className="w-full h-full object-contain" />
      )}
    </div>
  ) : variant === 'stacked' ? (
    <div className="h-10 flex items-center overflow-hidden">
      <img
        src={(isDark ? sources.stackedDark : sources.stacked) ?? sources.stacked}
        alt={alt}
        className="h-full object-contain"
      />
    </div>
  ) : (
    <div className="h-12 flex items-center overflow-hidden">
      <img
        src={(isDark ? sources.horizontalDark : sources.horizontal) ?? sources.horizontal}
        alt={alt}
        className="h-full object-contain"
      />
    </div>
  );

  if (href) {
    return (
      <LinkComponent to={href} className={cn('flex items-center transition-all', className)}>
        {content}
      </LinkComponent>
    );
  }

  return <div className={cn('flex items-center transition-all', className)}>{content}</div>;
}
