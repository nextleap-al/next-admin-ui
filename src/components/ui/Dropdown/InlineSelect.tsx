import type { ComponentProps } from 'react';

import { SimpleDropdown } from './SimpleDropdown';

type SimpleDropdownProps = ComponentProps<typeof SimpleDropdown>;

export interface InlineSelectProps extends Omit<SimpleDropdownProps, 'label'> {
  /** Shown to the left of the control, on the same line. */
  label: string;
  /** Tailwind width class for the control (default `w-[200px]`). */
  width?: string;
}

/**
 * A labelled `SimpleDropdown` laid out inline — label on the left, control on the right. For page/toolbar
 * scope pickers and list filters, where a stacked label would waste vertical space. The control keeps its
 * own `w-full` and fills a fixed-width wrapper, so `width` sets the size without fighting that class.
 */
export function InlineSelect({
  label,
  width = 'w-[200px]',
  size = 'sm',
  ...dropdown
}: InlineSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="whitespace-nowrap text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </span>
      <div className={width}>
        <SimpleDropdown size={size} {...dropdown} />
      </div>
    </div>
  );
}
