import { ReactNode, MouseEventHandler } from 'react';
import { cn } from '@/utils/cn';
import { Tooltip } from '../ui/Tooltip';

export interface SidebarNavItemProps {
  icon?: ReactNode;
  label: string;
  /** Navigate to URL. If provided, item becomes an anchor. */
  href?: string;
  /** Currently active */
  active?: boolean;
  /** Whether the sidebar is collapsed (icon-only) */
  collapsed?: boolean;
  /** onClick handler (use with or without href) */
  onClick?: MouseEventHandler<HTMLElement>;
  /** Optional trailing content (badges, counts, etc.) */
  trailing?: ReactNode;
  /**
   * Optional Link component (e.g. `NavLink` from `react-router-dom`).
   * Receives `to`, `className`, `onClick`, `children`.
   */
  LinkComponent?: React.ComponentType<{
    to: string;
    className?: string;
    onClick?: MouseEventHandler<HTMLElement>;
    children?: ReactNode;
  }>;
  className?: string;
}

function DefaultLink({
  to,
  className,
  onClick,
  children,
}: {
  to: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  children?: ReactNode;
}) {
  return (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

/**
 * Generic sidebar navigation item. Shows only the icon when `collapsed`
 * and wraps in a tooltip so the label is still discoverable.
 */
export function SidebarNavItem({
  icon,
  label,
  href,
  active = false,
  collapsed = false,
  onClick,
  trailing,
  LinkComponent = DefaultLink,
  className,
}: SidebarNavItemProps) {
  const classes = cn(
    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
    active
      ? 'bg-gold-400/10 text-gold-400'
      : 'text-[var(--text-secondary)] hover:text-gold-400 hover:bg-[var(--surface-100)]',
    collapsed && 'justify-center px-2',
    className,
  );

  const body = (
    <>
      {icon && <span className={cn(active && 'text-gold-400')}>{icon}</span>}
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && trailing && <span className="ml-auto">{trailing}</span>}
      {!collapsed && active && !trailing && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400" />
      )}
    </>
  );

  const content = href ? (
    <LinkComponent to={href} className={classes} onClick={onClick}>
      {body}
    </LinkComponent>
  ) : (
    <button type="button" onClick={onClick} className={cn(classes, 'w-full text-left')}>
      {body}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip content={label} position="right">
        {content}
      </Tooltip>
    );
  }

  return content;
}
