import { Fragment, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { cn } from '@/utils/cn';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ActionMenuItem {
  /** Unique key for the item */
  key: string;
  /** Display label */
  label: string;
  /** Icon to display */
  icon?: LucideIcon;
  /** Click handler */
  onClick: () => void;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Whether the item has destructive styling (red) */
  destructive?: boolean;
  /** Divider before this item */
  divider?: boolean;
}

export interface ActionMenuProps {
  /** List of menu items */
  items: ActionMenuItem[];
  /** Custom trigger button */
  trigger?: ReactNode;
  /** Label for the trigger (if not using custom trigger) */
  triggerLabel?: string;
  /** Alignment of the dropdown */
  align?: 'left' | 'right';
  /** Size of the trigger */
  size?: 'sm' | 'md' | 'lg';
  /** Additional class names for the trigger */
  className?: string;
  /** Whether to show the more icon (three dots) as trigger */
  moreIcon?: boolean;
}

/**
 * ActionMenu - A dropdown menu for actions (edit, delete, etc.).
 * 
 * Use this for:
 * - Table row actions
 * - Card actions
 * - Quick action buttons
 * - Contextual menus
 * 
 * @example
 * ```tsx
 * <ActionMenu
 *   items={[
 *     { key: 'edit', label: 'Edit', icon: Edit, onClick: handleEdit },
 *     { key: 'delete', label: 'Delete', icon: Trash, onClick: handleDelete, destructive: true },
 *   ]}
 * />
 * ```
 */
export function ActionMenu({
  items,
  trigger,
  triggerLabel = 'Actions',
  align = 'right',
  size = 'md',
  className,
  moreIcon = false,
}: ActionMenuProps) {
  const sizes = {
    sm: 'h-7 text-xs px-2 gap-1',
    md: 'h-8 text-sm px-3 gap-1.5',
    lg: 'h-10 text-sm px-4 gap-2',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Remove consecutive or leading dividers
  const cleanedItems = items.filter((item, index, arr) => {
    if (!item.divider) return true;
    if (index === 0) return false;
    const prevItem = arr[index - 1];
    return !prevItem.divider;
  });

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          {trigger ? (
            <Menu.Button as={Fragment}>{trigger}</Menu.Button>
          ) : moreIcon ? (
            <Menu.Button
              className={cn(
                'p-1.5 rounded-lg text-[var(--text-muted)] transition-colors',
                'hover:bg-[var(--surface-100)] hover:text-[var(--text-primary)]',
                'focus:outline-none focus:ring-2 focus:ring-gold-400/20',
                className
              )}
            >
              <MoreHorizontal className={iconSizes[size]} />
            </Menu.Button>
          ) : (
            <Menu.Button
              className={cn(
                'inline-flex items-center justify-center rounded-lg',
                'bg-[var(--surface-100)] text-[var(--text-primary)]',
                'hover:bg-[var(--surface-200)]',
                'focus:outline-none focus:ring-2 focus:ring-gold-400/20',
                'transition-colors',
                sizes[size],
                className
              )}
            >
              {triggerLabel}
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-[var(--text-muted)] transition-transform',
                  open && 'rotate-180'
                )}
              />
            </Menu.Button>
          )}

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className={cn(
                'absolute z-50 mt-1 w-48 rounded-xl bg-white dark:bg-gray-900 border border-[var(--border-light)] shadow-lg focus:outline-none overflow-hidden',
                align === 'right' && 'right-0',
                align === 'left' && 'left-0'
              )}
            >
              <div className="py-1">
                {cleanedItems.map((item) => (
                  <Fragment key={item.key}>
                    {item.divider && (
                      <div className="h-px bg-gray-200 dark:bg-[rgb(52,52,52)] my-1 mx-2" />
                    )}
                    <Menu.Item disabled={item.disabled}>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={item.onClick}
                          className={cn(
                            'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors',
                            active && 'bg-[var(--surface-100)]',
                            item.destructive
                              ? 'text-red-500 hover:text-red-600'
                              : 'text-[var(--text-primary)]',
                            item.disabled && 'opacity-50 cursor-not-allowed'
                          )}
                          disabled={item.disabled}
                        >
                          {item.icon && (
                            <item.icon
                              className={cn(
                                'w-4 h-4',
                                item.destructive ? 'text-red-500' : 'text-[var(--text-muted)]'
                              )}
                            />
                          )}
                          {item.label}
                        </button>
                      )}
                    </Menu.Item>
                  </Fragment>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
