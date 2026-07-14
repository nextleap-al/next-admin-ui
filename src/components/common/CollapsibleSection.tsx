import { ChevronDown } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';

export interface CollapsibleSectionProps {
  title: string;
  /** Sub-line under the title. */
  description?: string;
  /** Representative icon; rendered in the accent color, left of the title. */
  icon?: ReactNode;
  /** Right-aligned control (e.g. an Add button); sits before the chevron and doesn't toggle. */
  action?: ReactNode;
  /** Whether the section starts open (default `true`). */
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * A section card whose body collapses behind a clickable header (icon + title + description + chevron).
 * Flat by design — a border, no shadow — so a stack of these reads as one panel. The header text is the
 * toggle; the optional `action` is a sibling control, so clicking it never expands/collapses.
 */
export function CollapsibleSection({
  title,
  description,
  icon,
  action,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();
  const toggle = () => setOpen((prev) => !prev);

  return (
    <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-elevated)]">
      <div className="flex items-start justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={contentId}
          className="flex min-w-0 flex-1 items-start gap-2 text-left transition-opacity hover:opacity-90"
        >
          {icon ? <span className="mt-0.5 shrink-0 text-gold-400">{icon}</span> : null}
          <span className="min-w-0">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
            {description ? (
              <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{description}</p>
            ) : null}
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          {open ? action : null}
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={contentId}
            aria-label={open ? 'Collapse section' : 'Expand section'}
            className="rounded p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-100)]"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      {open ? (
        <div id={contentId} className="px-4 pb-4 pt-1">
          {children}
        </div>
      ) : null}
    </div>
  );
}
