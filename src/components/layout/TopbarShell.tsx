import { ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface TopbarShellProps {
  /** Content rendered on the left (after the mobile menu button) */
  left?: ReactNode;
  /** Content rendered on the right (actions, user menu, etc.) */
  right?: ReactNode;
  /** Custom center content (optional) */
  center?: ReactNode;
  /** Called when the mobile menu button is clicked */
  onMenuClick?: () => void;
  /** Hide the mobile menu button */
  hideMenuButton?: boolean;
  className?: string;
}

/**
 * Generic sticky topbar for app shells. Provides a standard 16-unit height,
 * a mobile menu button, and left/center/right slots for custom content.
 *
 * @example
 * <TopbarShell
 *   onMenuClick={openMobileSidebar}
 *   left={<Breadcrumbs items={crumbs} className="hidden md:flex" />}
 *   right={
 *     <>
 *       <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} />
 *       <UserAvatarMenu user={user} onLogout={logout} />
 *     </>
 *   }
 * />
 */
export function TopbarShell({
  left,
  right,
  center,
  onMenuClick,
  hideMenuButton = false,
  className,
}: TopbarShellProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-16 bg-[var(--bg-elevated)]/80 backdrop-blur-xl border-b border-[var(--border-light)]',
        className,
      )}
    >
      <div className="h-full px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {!hideMenuButton && onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:text-gold-400 hover:bg-[var(--surface-100)] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          {left}
        </div>

        {center && <div className="flex-1 flex items-center justify-center">{center}</div>}

        {right && <div className="flex items-center gap-2">{right}</div>}
      </div>
    </header>
  );
}
