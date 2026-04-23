import { Fragment, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { cn } from '@/utils/cn';

export type DropdownItem = {
  label: string;
  value?: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
};

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown = ({ trigger, items, align = 'right', className }: DropdownProps) => {
  return (
    <Menu as="div" className={cn('relative inline-block text-left', className)}>
      <Menu.Button as={Fragment}>{trigger}</Menu.Button>

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
            'absolute z-50 mt-2 w-56 rounded-xl bg-white dark:bg-[#2b2b2b] border border-[var(--border-light)] shadow-lg focus:outline-none overflow-hidden',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          <div className="py-1">
            {items.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={index}
                    className="h-px bg-[var(--border-light)] my-1"
                  />
                );
              }

              return (
                <Menu.Item key={index} disabled={item.disabled}>
                  {({ active }) => (
                    <button
                      onClick={item.onClick}
                      disabled={item.disabled}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors',
                        active && 'bg-[var(--surface-100)]',
                        item.disabled && 'opacity-50 cursor-not-allowed',
                        item.danger
                          ? 'text-red-500'
                          : 'text-[var(--text-primary)]'
                      )}
                    >
                      {item.icon && (
                        <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
                      )}
                      {item.label}
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
