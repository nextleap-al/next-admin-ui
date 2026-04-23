import { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableItemProps {
  id: number;
  children: ReactNode;
  disabled?: boolean;
}

export function SortableItem({ id, children, disabled }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'cursor-grabbing' : ''}`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`flex-shrink-0 p-1 rounded hover:bg-[var(--surface-200)] transition-colors ${
            disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
          }`}
          {...attributes}
          {...listeners}
          disabled={disabled}
        >
          <GripVertical className="w-4 h-4 text-[var(--text-muted)]" />
        </button>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
