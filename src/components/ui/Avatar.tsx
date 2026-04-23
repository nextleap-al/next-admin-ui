import { cn } from '@/utils/cn';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const getInitials = (name: string): string => {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getColorFromName = (name: string): string => {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-gold-500',
    'bg-gold-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

const Avatar = ({ src, alt, name = '', size = 'md', className }: AvatarProps) => {
  const sizes = {
    xs: 'w-6 h-6 text-2xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={cn(
          'rounded-full object-cover shrink-0',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-medium text-white shrink-0',
        sizes[size],
        getColorFromName(name),
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
};

// Avatar group for showing multiple avatars
export interface AvatarGroupProps {
  users: { name: string; src?: string }[];
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}

const AvatarGroup = ({ users, max = 4, size = 'md', className }: AvatarGroupProps) => {
  const visibleUsers = users.slice(0, max);
  const extraCount = users.length - max;

  const overlapSizes = {
    xs: '-ml-1.5',
    sm: '-ml-2',
    md: '-ml-2.5',
    lg: '-ml-3',
    xl: '-ml-4',
  };

  return (
    <div className={cn('flex items-center', className)}>
      {visibleUsers.map((user, index) => (
        <Avatar
          key={index}
          src={user.src}
          name={user.name}
          size={size}
          className={cn(
            'ring-2 ring-[var(--bg-primary)]',
            index > 0 && overlapSizes[size]
          )}
        />
      ))}
      {extraCount > 0 && (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-medium bg-[var(--surface-200)] text-[var(--text-secondary)] ring-2 ring-[var(--bg-primary)]',
            {
              xs: 'w-6 h-6 text-2xs',
              sm: 'w-8 h-8 text-xs',
              md: 'w-10 h-10 text-xs',
              lg: 'w-12 h-12 text-sm',
              xl: 'w-16 h-16 text-base',
            }[size],
            overlapSizes[size]
          )}
        >
          +{extraCount}
        </div>
      )}
    </div>
  );
};

export { Avatar, AvatarGroup };
