import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface AppShellProps {
  /** Rendered as the fixed left sidebar (use `SidebarShell` or your own) */
  sidebar?: ReactNode;
  /** Rendered as the sticky top bar (use `TopbarShell` or your own) */
  topbar?: ReactNode;
  /** Main scrollable content */
  children: ReactNode;
  /** Width of sidebar when collapsed (default 72px) */
  sidebarCollapsedWidth?: number;
  /** Width of sidebar when expanded (default 260px) */
  sidebarExpandedWidth?: number;
  /** Whether the sidebar is currently collapsed */
  sidebarCollapsed?: boolean;
  /** Padding applied around the main content (Tailwind class). Default: `p-6` */
  contentClassName?: string;
  className?: string;
}

/**
 * Standard application shell combining a sidebar, topbar, and content area.
 * Handles the responsive left offset so content sits next to the sidebar on
 * desktop and takes full width on mobile.
 *
 * @example
 * <AppShell
 *   sidebarCollapsed={collapsed}
 *   sidebar={<MySidebar collapsed={collapsed} />}
 *   topbar={<MyTopbar onMenuClick={openMobileSidebar} />}
 * >
 *   <Outlet />
 * </AppShell>
 */
export function AppShell({
  sidebar,
  topbar,
  children,
  sidebarCollapsedWidth = 72,
  sidebarExpandedWidth = 260,
  sidebarCollapsed = false,
  contentClassName = 'p-6',
  className,
}: AppShellProps) {
  const leftOffset = sidebarCollapsed ? sidebarCollapsedWidth : sidebarExpandedWidth;

  return (
    <div className={cn('min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]', className)}>
      {sidebar}
      <div
        className="transition-[padding] duration-300"
        style={
          {
            '--nl-sidebar-offset': sidebar ? `${leftOffset}px` : '0px',
          } as React.CSSProperties
        }
      >
        <div className="lg:pl-[var(--nl-sidebar-offset)]">
          {topbar}
          <main className={cn('min-h-[calc(100vh-4rem)]', contentClassName)}>{children}</main>
        </div>
      </div>
    </div>
  );
}
