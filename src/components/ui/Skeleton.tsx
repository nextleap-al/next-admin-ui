import { cn } from '@/utils/cn';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton = ({
  className,
  variant = 'text',
  width,
  height,
  animation = 'wave',
}: SkeletonProps) => {
  const variants = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const animations = {
    pulse: 'animate-pulse bg-[var(--surface-200)]',
    wave: 'skeleton',
    none: 'bg-[var(--surface-200)]',
  };

  return (
    <div
      className={cn(variants[variant], animations[animation], className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};

// Preset skeleton components for common use cases
const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        className={i === lines - 1 ? 'w-3/4' : 'w-full'}
      />
    ))}
  </div>
);

const SkeletonCard = () => (
  <div className="p-4 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-elevated)]">
    <div className="flex items-start gap-3">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-1/3 h-5" />
        <Skeleton variant="text" className="w-2/3" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-4/5" />
    </div>
  </div>
);

const SkeletonTable = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="rounded-xl border border-[var(--border-light)] overflow-hidden">
    {/* Header */}
    <div className="flex gap-4 p-3 bg-[var(--surface-100)] border-b border-[var(--border-light)]">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} variant="text" className="flex-1 h-4" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div
        key={rowIndex}
        className="flex gap-4 p-3 border-b border-[var(--border-light)] last:border-b-0"
      >
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" className="flex-1 h-4" />
        ))}
      </div>
    ))}
  </div>
);

const SkeletonList = ({ items = 5 }: { items?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="flex-1 space-y-1.5">
          <Skeleton variant="text" className="w-1/3 h-4" />
          <Skeleton variant="text" className="w-2/3 h-3" />
        </div>
      </div>
    ))}
  </div>
);

export { Skeleton, SkeletonText, SkeletonCard, SkeletonTable, SkeletonList };
