import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SidebarFooterActionsProps {
  collapsed?: boolean;
  /** Show/hide the collapse toggle (default: true) */
  showCollapseToggle?: boolean;
  /** Called when the user toggles the collapsed state */
  onCollapse?: () => void;
  /** If provided, renders a Log out button */
  onLogout?: () => void;
  /** Override logout label */
  logoutLabel?: string;
  /** Override collapse label (shown in the expanded state) */
  collapseLabel?: string;
  /** Optional extra slot (rendered between collapse and logout) */
  extra?: ReactNode;
  className?: string;
}

/**
 * Common sidebar footer with a collapse toggle and an optional logout button.
 * Drop this in as the `footer` of `SidebarShell`.
 */
export function SidebarFooterActions({
  collapsed = false,
  showCollapseToggle = true,
  onCollapse,
  onLogout,
  logoutLabel = 'Log out',
  collapseLabel = 'Collapse',
  extra,
  className,
}: SidebarFooterActionsProps) {
  return (
    <div className={className}>
      {showCollapseToggle && onCollapse && (
        <button
          type="button"
          onClick={onCollapse}
          className={cn(
            'flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-[var(--text-secondary)] hover:text-gold-400 hover:bg-[var(--surface-100)] transition-colors',
            collapsed && 'justify-center',
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>{collapseLabel}</span>
            </>
          )}
        </button>
      )}

      {extra}

      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          className={cn(
            'flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-colors',
            collapsed && 'justify-center',
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>{logoutLabel}</span>}
        </button>
      )}
    </div>
  );
}
