import { ReactNode, useState, useMemo, useCallback } from 'react';
import { Checkbox } from './Checkbox';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  VisibilityState,
  RowSelectionState,
  Updater,
} from '@tanstack/react-table';
import { cn } from '@/utils/cn';
import { Button } from './Button';
import { Input } from './Input';
import { Dropdown } from './Dropdown';
import { Skeleton } from './Skeleton';
import { NoResults } from './EmptyState';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Check,
  X,
  Loader2,
  Plus,
} from 'lucide-react';
import { PaginationMeta } from '@/types';

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  // Pagination
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  // Sorting
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  // Selection
  enableSelection?: boolean;
  selectedRows?: RowSelectionState;
  onSelectionChange?: (selection: RowSelectionState) => void;
  // Column visibility
  enableColumnVisibility?: boolean;
  // Loading & Error states
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  // Row actions
  rowActions?: (row: TData) => ReactNode;
  // Inline create
  enableInlineCreate?: boolean;
  onInlineCreate?: () => void;
  createLabel?: string;
  // Custom toolbar
  toolbar?: ReactNode;
  // Styling
  compact?: boolean;
  className?: string;
  // Empty state
  emptyTitle?: string;
  emptyDescription?: string;
  // Row click
  onRowClick?: (row: TData) => void;
  // Per-row class name
  getRowClassName?: (row: TData) => string | undefined;
}

function DataTable<TData>({
  data,
  columns,
  pagination,
  onPageChange,
  onPageSizeChange,
  sorting,
  onSortingChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  enableSelection = false,
  selectedRows = {},
  onSelectionChange,
  enableColumnVisibility = false,
  isLoading = false,
  error,
  onRetry,
  rowActions,
  enableInlineCreate = false,
  onInlineCreate,
  createLabel = 'Add new',
  toolbar,
  compact = false,
  className,
  // emptyTitle and emptyDescription are declared for future use in custom empty states
  emptyTitle: _emptyTitle = 'No data found',
  emptyDescription: _emptyDescription,
  onRowClick,
  getRowClassName,
}: DataTableProps<TData>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);

  const effectiveSorting = sorting ?? internalSorting;
  const effectiveOnSortingChange = useCallback(
    (updater: Updater<SortingState>) => {
      const newSorting = typeof updater === 'function' ? updater(effectiveSorting) : updater;
      if (onSortingChange) {
        onSortingChange(newSorting);
      } else {
        setInternalSorting(newSorting);
      }
    },
    [effectiveSorting, onSortingChange]
  );
  
  const effectiveOnSelectionChange = useCallback(
    (updater: Updater<RowSelectionState>) => {
      if (onSelectionChange) {
        const newSelection = typeof updater === 'function' ? updater(selectedRows) : updater;
        onSelectionChange(newSelection);
      }
    },
    [onSelectionChange, selectedRows]
  );

  // Add selection and actions columns
  const finalColumns = useMemo(() => {
    const cols = [...columns];

    // Add selection column
    if (enableSelection) {
      cols.unshift({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
          />
        ),
        size: 40,
      });
    }

    // Add actions column
    if (rowActions) {
      cols.push({
        id: 'actions',
        header: '',
        cell: ({ row }) => rowActions(row.original),
        size: 60,
      });
    }

    return cols;
  }, [columns, enableSelection, rowActions]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      sorting: effectiveSorting,
      columnVisibility,
      rowSelection: selectedRows,
    },
    onSortingChange: effectiveOnSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: enableSelection ? effectiveOnSelectionChange : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: false,
    enableRowSelection: enableSelection,
  });

  const renderSortIcon = useCallback((columnId: string) => {
    const sort = effectiveSorting.find((s) => s.id === columnId);
    if (!sort) return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    return sort.desc ? (
      <ArrowDown className="w-4 h-4 text-gold-400" />
    ) : (
      <ArrowUp className="w-4 h-4 text-gold-400" />
    );
  }, [effectiveSorting]);

  const handleSort = useCallback(
    (columnId: string) => {
      const existing = effectiveSorting.find((s) => s.id === columnId);
      let newSorting: SortingState;

      if (!existing) {
        newSorting = [{ id: columnId, desc: false }];
      } else if (!existing.desc) {
        newSorting = [{ id: columnId, desc: true }];
      } else {
        newSorting = [];
      }

      effectiveOnSortingChange(newSorting);
    },
    [effectiveSorting, effectiveOnSortingChange]
  );

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-3 items-center">
          {onSearchChange && (
            <div className="relative w-full sm:w-64">
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                size="sm"
              />
            </div>
          )}
          {toolbar}
        </div>

        <div className="flex gap-2 items-center">
          {enableColumnVisibility && (
            <Dropdown
              trigger={
                <Button variant="ghost" size="sm">
                  <SlidersHorizontal className="w-4 h-4" />
                  Columns
                </Button>
              }
              items={table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => ({
                  label: col.id,
                  icon: col.getIsVisible() ? <Check className="w-4 h-4" /> : null,
                  onClick: () => col.toggleVisibility(),
                }))}
            />
          )}
          {enableInlineCreate && onInlineCreate && (
            <Button size="sm" onClick={onInlineCreate}>
              <Plus className="w-4 h-4" />
              {createLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[var(--border-light)] bg-[var(--bg-elevated)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    return (
                      <th
                        key={header.id}
                        className={cn(
                          'text-left font-semibold text-xs uppercase tracking-wider text-[var(--text-secondary)] bg-[var(--surface-100)] border-b border-[var(--border-light)]',
                          compact ? 'px-3 py-2' : 'px-4 py-3',
                          canSort && 'cursor-pointer select-none hover:text-[var(--text-primary)]'
                        )}
                        style={{ width: header.column.getSize() }}
                        onClick={canSort ? () => handleSort(header.id) : undefined}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && renderSortIcon(header.id)}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {finalColumns.map((_, j) => (
                      <td
                        key={j}
                        className={cn(
                          'border-b border-[var(--border-light)]',
                          compact ? 'px-3 py-2' : 'px-4 py-3'
                        )}
                      >
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={finalColumns.length}>
                    <NoResults onClear={onSearchChange ? () => onSearchChange('') : undefined} />
                  </td>
                </tr>
              ) : (
                // Data rows
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      'transition-colors hover:bg-[var(--surface-100)]',
                      row.getIsSelected() && 'bg-gold-400/5',
                      onRowClick && 'cursor-pointer',
                      getRowClassName?.(row.original)
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={cn(
                          'text-sm text-[var(--text-primary)] border-b border-[var(--border-light)]',
                          compact ? 'px-3 py-2' : 'px-4 py-3'
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-[var(--border-light)] bg-[var(--surface-50)]">
            <div className="text-sm text-[var(--text-secondary)]">
              Showing{' '}
              <span className="font-medium text-[var(--text-primary)]">
                {(pagination.page - 1) * pagination.pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium text-[var(--text-primary)]">
                {Math.min(pagination.page * pagination.pageSize, pagination.total)}
              </span>{' '}
              of{' '}
              <span className="font-medium text-[var(--text-primary)]">{pagination.total}</span>{' '}
              results
            </div>

            <div className="flex items-center gap-2">
              {onPageSizeChange && (
                <select
                  value={pagination.pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="h-8 px-2 text-sm rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                >
                  {[10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size} / page
                    </option>
                  ))}
                </select>
              )}

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={pagination.page <= 1}
                  onClick={() => onPageChange?.(pagination.page - 1)}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                />
                <span className="px-3 text-sm text-[var(--text-primary)]">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => onPageChange?.(pagination.page + 1)}
                  leftIcon={<ChevronRight className="w-4 h-4" />}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Inline editable cell component
export interface EditableCellProps {
  value: string;
  isEditing: boolean;
  isSaving?: boolean;
  error?: string | null;
  onStartEdit: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  type?: 'text' | 'number' | 'date';
}

const EditableCell = ({
  value,
  isEditing,
  isSaving,
  error,
  onStartEdit,
  onChange,
  onSave,
  onCancel,
  type = 'text',
}: EditableCellProps) => {
  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          autoFocus
          className={cn(
            'flex-1 h-7 px-2 text-sm rounded border bg-[var(--bg-primary)]',
            error ? 'border-red-500' : 'border-gold-400 ring-2 ring-gold-400/20'
          )}
        />
        {isSaving ? (
          <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
        ) : (
          <>
            <button
              onClick={onSave}
              className="p-1 rounded hover:bg-[var(--surface-200)] text-gold-400"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={onCancel}
              className="p-1 rounded hover:bg-[var(--surface-200)] text-[var(--text-muted)]"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onStartEdit}
      className="cursor-pointer hover:bg-[var(--surface-100)] -m-1 p-1 rounded transition-colors"
    >
      {value || <span className="text-[var(--text-muted)]">—</span>}
    </div>
  );
};

// Row actions dropdown
export interface RowActionsProps {
  items: Array<{
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    danger?: boolean;
    divider?: boolean;
  }>;
}

const RowActions = ({ items }: RowActionsProps) => (
  <Dropdown
    trigger={
      <button className="p-1.5 rounded-lg hover:bg-[var(--surface-200)] transition-colors">
        <MoreHorizontal className="w-4 h-4 text-[var(--text-muted)]" />
      </button>
    }
    items={items}
    align="right"
  />
);

export { DataTable, EditableCell, RowActions };
