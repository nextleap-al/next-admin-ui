import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SidebarShellProps {
  /** Content rendered at the top (typically a Logo) */
  header?: ReactNode;
  /** Main scrollable content (typically nav sections) */
  children: ReactNode;
  /** Content rendered at the bottom (typically collapse/logout buttons) */
  footer?: ReactNode;
  /** Collapsed (icon-only) state */
  collapsed?: boolean;
  /** Width when collapsed (default: 72px) */
  collapsedWidth?: number;
  /** Width when expanded (default: 260px) */
  expandedWidth?: number;
  /** Mobile-only: whether the off-canvas sidebar is open */
  mobileOpen?: boolean;
  /** Mobile-only: called when the close button or backdrop is clicked */
  onMobileClose?: () => void;
  /** Optional extra content shown at the top on mobile only (e.g. user card) */
  mobileHeaderExtra?: ReactNode;
  className?: string;
}

/**
 * Generic sidebar container used for application shells.
 * Provides desktop (fixed, optionally collapsed) and mobile (off-canvas)
 * layouts. The consumer provides the actual navigation items.
 *
 * @example
 * <SidebarShell
 *   collapsed={collapsed}
 *   header={<Logo sources={logos} collapsed={collapsed} href="/dashboard" />}
 *   footer={
 *     <SidebarFooterActions
 *       collapsed={collapsed}
 *       onCollapse={() => setCollapsed(!collapsed)}
 *       onLogout={logout}
 *     />
 *   }
 * >
 *   <SidebarSection label="Main" collapsed={collapsed}>
 *     <SidebarNavItem icon={<Home />} label="Dashboard" href="/dashboard" active />
 *   </SidebarSection>
 * </SidebarShell>
 */
export function SidebarShell({
  header,
  children,
  footer,
  collapsed = false,
  collapsedWidth = 72,
  expandedWidth = 260,
  mobileOpen = false,
  onMobileClose,
  mobileHeaderExtra,
  className,
}: SidebarShellProps) {
  return (
    <>
      <aside
        style={{ width: collapsed ? collapsedWidth : expandedWidth }}
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-[var(--bg-elevated)] border-r border-[var(--border-light)] transition-all duration-300 hidden lg:flex flex-col',
          className,
        )}
      >
        {header && (
          <div
            className={cn(
              'h-16 flex items-center border-b border-[var(--border-light)]',
              collapsed ? 'px-3 justify-center' : 'px-4',
            )}
          >
            {header}
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">{children}</nav>

        {footer && <div className="border-t border-[var(--border-light)] p-3">{footer}</div>}
      </aside>

      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-[280px] bg-[var(--bg-elevated)] border-r border-[var(--border-light)] transition-transform duration-300 lg:hidden flex flex-col',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border-light)]">
          {header}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-100)]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {mobileHeaderExtra && (
          <div className="px-4 py-3 border-b border-[var(--border-light)]">{mobileHeaderExtra}</div>
        )}

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">{children}</nav>

        {footer && <div className="border-t border-[var(--border-light)] p-3">{footer}</div>}
      </aside>
    </>
  );
}
