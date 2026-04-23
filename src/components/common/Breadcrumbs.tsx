import { ReactNode } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  homeHref?: string;
  homeIcon?: ReactNode;
  separator?: ReactNode;
  /**
   * Optional link component. Defaults to a plain `<a>`.
   * Pass your framework's `Link` (e.g. `react-router-dom`'s `Link`) to
   * integrate with client-side navigation.
   */
  LinkComponent?: React.ComponentType<{ to: string; className?: string; children?: ReactNode }>;
}

function DefaultLink({ to, className, children }: { to: string; className?: string; children?: ReactNode }) {
  return (
    <a href={to} className={className}>
      {children}
    </a>
  );
}

/**
 * Generic breadcrumbs component. Fully controlled: the consumer provides
 * the `items` list.
 *
 * @example
 * <Breadcrumbs items={[{ label: 'Users', href: '/users' }, { label: 'John' }]} />
 */
export function Breadcrumbs({
  items,
  className,
  homeHref = '/',
  homeIcon,
  separator,
  LinkComponent = DefaultLink,
}: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  const Separator = separator ?? <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />;
  const HomeIcon = homeIcon ?? <Home className="w-4 h-4" />;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center gap-1 text-sm">
        <li>
          <LinkComponent
            to={homeHref}
            className="flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            {HomeIcon}
          </LinkComponent>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            {Separator}
            {item.href && index < items.length - 1 ? (
              <LinkComponent
                to={item.href}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {item.label}
              </LinkComponent>
            ) : (
              <span className="text-[var(--text-primary)] font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
