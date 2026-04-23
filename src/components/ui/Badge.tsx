import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-[var(--surface-200)] text-[var(--text-secondary)]',
      success: 'bg-green-500/10 text-green-500',
      warning: 'bg-[var(--warning-light)] text-[var(--warning)]',
      error: 'bg-[var(--error-light)] text-[var(--error)]',
      info: 'bg-[var(--info-light)] text-[var(--info)]',
      primary: 'bg-[var(--secondary-light)] text-gold-400',
      outline: 'border border-[var(--border-default)] text-[var(--text-secondary)] bg-transparent',
    };

    const sizes = {
      sm: 'text-2xs px-1.5 py-0.5',
      md: 'text-xs px-2 py-0.5',
      lg: 'text-sm px-2.5 py-1',
    };

    const dotColors = {
      default: 'bg-[var(--text-muted)]',
      success: 'bg-green-500',
      warning: 'bg-[var(--warning)]',
      error: 'bg-[var(--error)]',
      info: 'bg-[var(--info)]',
      primary: 'bg-gold-400',
      outline: 'bg-[var(--text-muted)]',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Preset badges for common statuses
export const StatusBadge = ({ status }: { status?: string | null }) => {
  // Normalize status to lowercase for matching, with fallback
  const normalizedStatus = (status || 'draft').toLowerCase();
  
  const statusConfig: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    // Lowercase variants (legacy/normalized)
    draft: { variant: 'default', label: 'Draft' },
    pending: { variant: 'warning', label: 'Pending' },
    pending_school_approval: { variant: 'warning', label: 'Pending Approval' },
    pending_approval: { variant: 'warning', label: 'Pending Approval' },
    pending_payment: { variant: 'warning', label: 'Pending Payment' },
    submitted: { variant: 'info', label: 'Submitted' },
    approved: { variant: 'success', label: 'Approved' },
    confirmed: { variant: 'success', label: 'Confirmed' },
    rejected: { variant: 'error', label: 'Rejected' },
    cancelled: { variant: 'default', label: 'Cancelled' },
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'default', label: 'Inactive' },
    completed: { variant: 'info', label: 'Completed' },
    in_progress: { variant: 'primary', label: 'In Progress' },
    submission_open: { variant: 'success', label: 'Open' },
    submission_closed: { variant: 'error', label: 'Closed' },
    paid: { variant: 'success', label: 'Paid' },
    unpaid: { variant: 'warning', label: 'Unpaid' },
    present: { variant: 'success', label: 'Present' },
    absent: { variant: 'error', label: 'Absent' },
    late: { variant: 'warning', label: 'Late' },
  };

  const config = statusConfig[normalizedStatus] || { variant: 'default' as const, label: status };

  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
};

export { Badge };
