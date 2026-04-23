import { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { 
  FileX, 
  Search, 
  AlertCircle, 
  Users, 
  FolderOpen,
  Inbox,
  Calendar,
  Trophy,
} from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'compact';
  className?: string;
}

const EmptyState = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  className,
}: EmptyStateProps) => {
  const isCompact = variant === 'compact';

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        isCompact ? 'py-8 px-4' : 'py-16 px-6',
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-[var(--surface-100)] text-[var(--text-muted)]',
            isCompact ? 'w-12 h-12 mb-3' : 'w-16 h-16 mb-4'
          )}
        >
          {icon}
        </div>
      )}
      <h3
        className={cn(
          'font-semibold text-[var(--text-primary)]',
          isCompact ? 'text-base' : 'text-lg'
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            'text-[var(--text-secondary)] max-w-sm',
            isCompact ? 'text-sm mt-1' : 'text-sm mt-2'
          )}
        >
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className={cn('flex gap-3', isCompact ? 'mt-4' : 'mt-6')}>
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button variant="primary" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// Preset empty states
const NoResults = ({ onClear }: { onClear?: () => void }) => (
  <EmptyState
    icon={<Search className="w-7 h-7" />}
    title="No results found"
    description="Try adjusting your search or filter criteria"
    action={onClear ? { label: 'Clear filters', onClick: onClear } : undefined}
  />
);

const NoData = ({ entity = 'items', onCreate }: { entity?: string; onCreate?: () => void }) => (
  <EmptyState
    icon={<FolderOpen className="w-7 h-7" />}
    title={`No ${entity} yet`}
    description={`Get started by creating your first ${entity.slice(0, -1)}`}
    action={onCreate ? { label: `Create ${entity.slice(0, -1)}`, onClick: onCreate } : undefined}
  />
);

const NoUsers = ({ onInvite }: { onInvite?: () => void }) => (
  <EmptyState
    icon={<Users className="w-7 h-7" />}
    title="No users found"
    description="Invite team members to collaborate"
    action={onInvite ? { label: 'Invite user', onClick: onInvite } : undefined}
  />
);

const NoNotifications = () => (
  <EmptyState
    icon={<Inbox className="w-7 h-7" />}
    title="All caught up!"
    description="You have no new notifications"
    variant="compact"
  />
);

const NoEvents = ({ onAdd }: { onAdd?: () => void }) => (
  <EmptyState
    icon={<Calendar className="w-7 h-7" />}
    title="No events scheduled"
    description="Create an event to get started"
    action={onAdd ? { label: 'Create event', onClick: onAdd } : undefined}
  />
);

const NoCompetitions = ({ onAdd }: { onAdd?: () => void }) => (
  <EmptyState
    icon={<Trophy className="w-7 h-7" />}
    title="No competitions yet"
    description="Create your first competition to get started"
    action={onAdd ? { label: 'Create competition', onClick: onAdd } : undefined}
  />
);

const ErrorState = ({ message, onRetry }: { message?: string; onRetry?: () => void }) => (
  <EmptyState
    icon={<AlertCircle className="w-7 h-7 text-red-500" />}
    title="Something went wrong"
    description={message || 'An error occurred while loading the data'}
    action={onRetry ? { label: 'Try again', onClick: onRetry } : undefined}
  />
);

const FileNotFound = () => (
  <EmptyState
    icon={<FileX className="w-7 h-7" />}
    title="File not found"
    description="The file you're looking for doesn't exist or has been removed"
  />
);

export { 
  EmptyState, 
  NoResults, 
  NoData, 
  NoUsers, 
  NoNotifications, 
  NoEvents, 
  NoCompetitions,
  ErrorState, 
  FileNotFound 
};
