import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { PageHeader } from './PageHeader';

export interface ListViewProps<T> {
  title: string;
  /** Optional icon shown beside the title (PageHeader's title is text-only, so ListView renders it). */
  icon?: ReactNode;
  description?: string;
  headerActions?: ReactNode;
  columns: ColumnDef<T, unknown>[];
  items: T[] | undefined;
  total: number | undefined;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading: boolean;
  /** Any error value — a string, an `Error`, or an object with `message`/`error`; surfaced in the table. */
  error?: unknown;
  onRetry?: () => void;
  /** Provide both to enable the server-driven search box; omit for lists without server search. */
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  rowActions?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  /** Rows requested by the "All" option. Defaults to 100 — set to your backend's page-size cap. */
  maxPageSize?: number;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const DEFAULT_MAX_PAGE_SIZE = 100;

/** Best-effort message from an unknown error value (string / Error / `{ message }` / `{ error }`). */
function getErrorMessage(error: unknown): string {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object') {
    const e = error as { message?: unknown; error?: unknown };
    if (typeof e.message === 'string') return e.message;
    if (typeof e.error === 'string') return e.error;
  }
  return 'Something went wrong.';
}

/**
 * Rows-per-page control with an "All" option — replaces the DataTable's built-in select, which can't offer
 * "All". "All" is stored as `maxPageSize` so it stays a distinct, explicit choice: the control reflects the
 * actual page size rather than collapsing to "All" whenever a page happens to hold every row of a short list.
 *
 * Built on a headless Listbox (rather than SimpleDropdown) so we can read its open state: the menu opens
 * downward, and this control lives in the table's bottom footer, so on a full page the lower options would
 * fall past the viewport with no scroll room. While open we append a spacer to <body> to grow the document,
 * making every option (down to "All") reachable by scrolling.
 */
function PageSizeSelect({
  pageSize,
  onChange,
  maxPageSize,
}: {
  pageSize: number;
  onChange: (n: number) => void;
  maxPageSize: number;
}) {
  const isAll = pageSize >= maxPageSize;
  const value: string | number = isAll ? 'all' : pageSize;
  // Surface a non-standard current size (e.g. from a shared URL) so the control always has a matching option.
  const custom =
    !isAll && !PAGE_SIZE_OPTIONS.includes(pageSize)
      ? [{ value: pageSize, label: `${pageSize} / page` }]
      : [];
  const options: { value: string | number; label: string }[] = [
    ...custom,
    ...PAGE_SIZE_OPTIONS.map((s) => ({ value: s, label: `${s} / page` })),
    { value: 'all', label: 'All' },
  ];
  const current = options.find((o) => o.value === value);

  return (
    <Listbox value={value} onChange={(v) => onChange(v === 'all' ? maxPageSize : Number(v))}>
      {({ open }) => (
        <div className="relative">
          <ListboxButton className="group flex h-8 w-36 items-center justify-between gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 text-sm text-[var(--text-primary)] hover:border-[var(--border-strong)] focus:outline-none">
            <span>{current?.label ?? value}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-data-[open]:rotate-180" />
          </ListboxButton>
          <ListboxOptions className="absolute z-50 mt-1 w-full rounded-xl border border-[var(--border-light)] bg-white p-1 shadow-lg focus:outline-none dark:bg-[#2b2b2b]">
            {options.map((o) => (
              <ListboxOption
                key={o.value}
                value={o.value}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] data-[focus]:bg-[var(--surface-100)] data-[selected]:text-gold-400"
              >
                {({ selected }) => (
                  <>
                    <span>{o.label}</span>
                    {selected ? <Check className="h-4 w-4 text-gold-400" /> : null}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
          {/* Grow the document while open so the downward panel is reachable by scrolling (see doc comment). */}
          {open ? createPortal(<div aria-hidden className="h-60 w-px" />, document.body) : null}
        </div>
      )}
    </Listbox>
  );
}

/**
 * Pagination footer that mirrors the DataTable's built-in one but swaps its fixed page-size select for the
 * All-capable PageSizeSelect. It attaches to the bottom of the table card (see the `.nl-list-datatable`
 * rule in the library stylesheet) so the two read as one card.
 */
function ListFooter({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  maxPageSize,
}: {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  maxPageSize: number;
}) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="nl-list-footer flex flex-col items-center justify-between gap-4 rounded-b-xl border border-[var(--border-light)] bg-[var(--surface-50)] px-4 py-3 sm:flex-row">
      <div className="text-sm text-[var(--text-secondary)]">
        Showing <span className="font-medium text-[var(--text-primary)]">{start}</span> to{' '}
        <span className="font-medium text-[var(--text-primary)]">{end}</span> of{' '}
        <span className="font-medium text-[var(--text-primary)]">{total}</span> results
      </div>
      <div className="flex items-center gap-2">
        <PageSizeSelect pageSize={pageSize} onChange={onPageSizeChange} maxPageSize={maxPageSize} />
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            leftIcon={<ChevronLeft className="h-4 w-4" />}
          />
          <span className="px-3 text-sm text-[var(--text-primary)]">
            {page} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            leftIcon={<ChevronRight className="h-4 w-4" />}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * A server-driven paginated list page: `PageHeader` + `DataTable` speaking `{ items, page, pageSize, total }`,
 * with its own footer that adds an "All" page-size option (which `DataTable`'s built-in pagination can't).
 * Pair it with `useListParams` to bind page/size/search to the URL. Feed it the current page of rows — never
 * paginate or filter client-side.
 */
export function ListView<T>(props: ListViewProps<T>) {
  const {
    title,
    icon,
    description,
    headerActions,
    columns,
    items,
    total,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    isLoading,
    error,
    onRetry,
    search,
    onSearchChange,
    searchPlaceholder,
    rowActions,
    onRowClick,
    maxPageSize = DEFAULT_MAX_PAGE_SIZE,
  } = props;

  const totalCount = total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));

  return (
    <div className="space-y-6">
      {icon ? (
        <div className="flex items-start gap-2">
          <span className="mt-0.5 shrink-0 text-[var(--text-secondary)]">{icon}</span>
          <div className="flex-1">
            <PageHeader title={title} description={description} actions={headerActions} />
          </div>
        </div>
      ) : (
        <PageHeader title={title} description={description} actions={headerActions} />
      )}
      {/* No `pagination` prop → the DataTable renders no footer; ListFooter below is our own. */}
      <div className="nl-list-table">
        <DataTable
          className="nl-list-datatable"
          data={items ?? []}
          columns={columns}
          searchValue={onSearchChange ? search : undefined}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          isLoading={isLoading}
          error={error ? getErrorMessage(error) : undefined}
          onRetry={onRetry}
          rowActions={rowActions}
          onRowClick={onRowClick}
        />
        <ListFooter
          page={page}
          pageSize={pageSize}
          total={totalCount}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          maxPageSize={maxPageSize}
        />
      </div>
    </div>
  );
}
