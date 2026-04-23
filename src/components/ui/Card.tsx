import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hover = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-[var(--bg-elevated)] border border-[var(--border-light)] shadow-glass',
      glass: 'bg-[var(--bg-glass)] backdrop-blur-xl border border-[var(--border-light)] shadow-glass',
      outline: 'border border-[var(--border-default)] bg-transparent',
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl',
          variants[variant],
          paddings[padding],
          hover && 'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, action, children, ...props }, ref) => {
    if (children) {
      return (
        <div ref={ref} className={cn('mb-4', className)} {...props}>
          {children}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex items-start justify-between mb-4', className)} {...props}>
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">{description}</p>
          )}
        </div>
        {action}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-light)]',
        className
      )}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
