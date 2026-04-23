import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 hover:shadow-glow disabled:opacity-50',
      secondary:
        'bg-[var(--surface-200)] text-[var(--text-primary)] hover:bg-[var(--surface-300)] disabled:opacity-50',
      outline:
        'border border-[var(--border-default)] text-[var(--text-primary)] hover:border-gold-400 hover:text-gold-400 hover:bg-[var(--secondary-light)] disabled:opacity-50',
      ghost:
        'text-[var(--text-secondary)] hover:bg-[var(--surface-200)] hover:text-[var(--text-primary)] disabled:opacity-50',
      danger:
        'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:opacity-50',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed whitespace-nowrap',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
