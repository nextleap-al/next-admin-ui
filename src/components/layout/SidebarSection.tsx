import { ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SidebarSectionProps {
  /** Label displayed above the section (hidden when collapsed) */
  label?: string;
  /** Whether the whole sidebar is collapsed */
  collapsed?: boolean;
  /** Whether the section is expanded by default */
  defaultExpanded?: boolean;
  /** Controlled expansion state */
  expanded?: boolean;
  /** Called when the user toggles the section */
  onExpandedChange?: (expanded: boolean) => void;
  /** Show the chevron toggle (default: true) */
  collapsible?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Named group of sidebar nav items with optional collapse/expand toggle.
 */
export function SidebarSection({
  label,
  collapsed = false,
  defaultExpanded = true,
  expanded: controlledExpanded,
  onExpandedChange,
  collapsible = true,
  children,
  className,
}: SidebarSectionProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;

  const toggle = () => {
    if (!collapsible) return;
    const next = !expanded;
    if (!isControlled) setInternalExpanded(next);
    onExpandedChange?.(next);
  };

  return (
    <div className={className}>
      {!collapsed && label && (
        <button
          type="button"
          onClick={toggle}
          disabled={!collapsible}
          className={cn(
            'flex items-center justify-between w-full px-3 mb-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider',
            collapsible && 'hover:text-[var(--text-secondary)]',
          )}
        >
          {label}
          {collapsible && (
            <ChevronDown className={cn('w-4 h-4 transition-transform', !expanded && '-rotate-90')} />
          )}
        </button>
      )}
      {(collapsed || expanded || !collapsible) && <div className="space-y-1">{children}</div>}
    </div>
  );
}
