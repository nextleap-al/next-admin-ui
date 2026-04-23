import { ReactNode } from 'react';
import { Sun, Moon, Search, Bell } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ThemeToggleButtonProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

export function ThemeToggleButton({ isDark, onToggle, className }: ThemeToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'p-2 rounded-xl text-[var(--text-secondary)] hover:text-gold-400 hover:bg-[var(--surface-100)] transition-colors',
        className,
      )}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

export interface SearchTriggerButtonProps {
  onClick: () => void;
  label?: string;
  /** Keyboard shortcut hint (e.g. `⌘K`) */
  shortcut?: string;
  className?: string;
}

export function SearchTriggerButton({
  onClick,
  label = 'Search',
  shortcut = '⌘K',
  className,
}: SearchTriggerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 h-9 px-3 rounded-xl bg-[var(--surface-100)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors',
        className,
      )}
    >
      <Search className="w-4 h-4" />
      <span className="hidden sm:block text-sm">{label}</span>
      {shortcut && (
        <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-[var(--bg-elevated)] border border-[var(--border-light)] rounded">
          {shortcut}
        </kbd>
      )}
    </button>
  );
}

export interface NotificationBellProps {
  /** Number of unread notifications */
  count?: number;
  onClick?: () => void;
  /** Optional content rendered inside a Popover (the consumer wires the popover) */
  children?: ReactNode;
  className?: string;
}

/**
 * Bell icon button with an unread-count badge. Low-level primitive; pair it
 * with your own popover/panel for the actual notifications list.
 */
export function NotificationBell({ count = 0, onClick, className }: NotificationBellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative p-2 rounded-xl text-[var(--text-secondary)] hover:text-gold-400 hover:bg-[var(--surface-100)] transition-colors',
        className,
      )}
      aria-label="Notifications"
    >
      <Bell className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-xs font-medium text-white bg-red-500 rounded-full">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
