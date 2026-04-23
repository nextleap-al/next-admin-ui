import { ReactNode, useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import toast from 'react-hot-toast';

interface SortableListItem {
  id: number;
  sortOrder: number;
}

interface SortableListProps<T extends SortableListItem> {
  items: T[];
  renderItem: (item: T, isOverlay?: boolean) => ReactNode;
  onReorder: (items: T[]) => Promise<void>;
  disabled?: boolean;
  emptyMessage?: string;
}

export function SortableList<T extends SortableListItem>({
  items,
  renderItem,
  onReorder,
  disabled = false,
  emptyMessage = 'No items',
}: SortableListProps<T>) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [localItems, setLocalItems] = useState<T[]>(items);
  const [isReordering, setIsReordering] = useState(false);
  const [originalItems, setOriginalItems] = useState<T[]>(items);
  const [lastSuccessfulOrder, setLastSuccessfulOrder] = useState<number[] | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Update local items when props change, but preserve order after successful reorder
  useEffect(() => {
    if (isReordering) return;

    // If we just completed a successful reorder, check if incoming items match our expected order
    if (lastSuccessfulOrder) {
      const incomingIds = items.map(item => item.id);
      const orderMatches = lastSuccessfulOrder.every((id, index) => incomingIds[index] === id);
      
      if (orderMatches) {
        // Server confirmed our order, sync and clear the flag
        setLocalItems(items);
        setOriginalItems(items);
        setLastSuccessfulOrder(null);
        return;
      }
      
      // If items length changed or IDs are different, it's new data - sync it
      if (items.length !== lastSuccessfulOrder.length || 
          !items.every(item => lastSuccessfulOrder.includes(item.id))) {
        setLocalItems(items);
        setOriginalItems(items);
        setLastSuccessfulOrder(null);
        return;
      }
      
      // Otherwise, keep our local order until server catches up
      return;
    }

    // Normal sync when not in reordering state
    setLocalItems(items);
    setOriginalItems(items);
  }, [items, isReordering, lastSuccessfulOrder]);

  const handleDragStart = (event: DragStartEvent) => {
    if (disabled || isReordering) return;
    setActiveId(Number(event.active.id));
    setOriginalItems([...localItems]);
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (disabled || isReordering) return;
    
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localItems.findIndex((item) => item.id === Number(active.id));
    const newIndex = localItems.findIndex((item) => item.id === Number(over.id));

    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = [...localItems];
    const [movedItem] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, movedItem);

    setLocalItems(newItems);
  };

  const handleDragEnd = async (_event: DragEndEvent) => {
    if (disabled || isReordering) return;
    
    setActiveId(null);

    // Check if the order actually changed by comparing with originalItems
    const hasOrderChanged = localItems.some(
      (item, index) => item.id !== originalItems[index]?.id
    );

    if (!hasOrderChanged) {
      return;
    }

    // Create reordered items with updated sortOrder
    const reorderedItems = localItems.map((item, index) => ({
      ...item,
      sortOrder: index + 1,
    }));

    setLocalItems(reorderedItems);
    setIsReordering(true);

    try {
      await onReorder(reorderedItems);
      // Store the successful order to prevent reset on query refetch
      setLastSuccessfulOrder(reorderedItems.map(item => item.id));
      setOriginalItems(reorderedItems);
    } catch (error) {
      // Revert to original order on error
      toast.error('Failed to update order');
      setLocalItems(originalItems);
    } finally {
      setIsReordering(false);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setLocalItems(originalItems);
  };

  const activeItem = localItems.find((item) => item.id === activeId);

  if (!items || items.length === 0) {
    return (
      <div className="py-8 text-center text-[var(--text-muted)]">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`relative ${isReordering ? 'opacity-60 pointer-events-none' : ''}`}>
      {isReordering && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--surface)] bg-opacity-50 rounded-xl">
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-100)] rounded-lg shadow-lg">
            <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Updating order...</span>
          </div>
        </div>
      )}
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={localItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
          disabled={disabled || isReordering}
        >
          <div className="space-y-3">
            {localItems.map((item) => (
              <SortableItem key={item.id} id={item.id} disabled={disabled || isReordering}>
                {renderItem(item)}
              </SortableItem>
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeItem ? (
            <div className="opacity-90 shadow-2xl">{renderItem(activeItem, true)}</div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
