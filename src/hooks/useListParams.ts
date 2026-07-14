import { useQueryParams } from './useQueryParams';

export interface ListParams {
  page: number;
  pageSize: number;
  search: string;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (value: string) => void;
}

export interface UseListParamsOptions {
  /** Rows per page when the URL carries no explicit `pageSize` (default 10). */
  defaultPageSize?: number;
}

/**
 * Binds server-driven list state (page / pageSize / search) to the URL query string, so lists are
 * shareable and back-button safe. A thin, opinionated layer over `useQueryParams`:
 *
 * - reads the raw params so an absent `pageSize` falls back to `defaultPageSize` (rather than
 *   `useQueryParams`' generic default), while a real value in the URL is honored;
 * - changing the page size or the search term resets to page 1 in a single URL update.
 *
 * Requires `react-router-dom` (via `useQueryParams`). Feed the result to `ListView`.
 */
export function useListParams(options: UseListParamsOptions = {}): ListParams {
  const { defaultPageSize = 10 } = options;
  const { params, setParam, setParams } = useQueryParams();

  return {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? defaultPageSize,
    search: (params.search as string) ?? '',
    setPage: (p) => setParam('page', p),
    // Set pageSize and reset page in ONE update. Two sequential setParam calls would each read the
    // current-render params and clobber the other, dropping one of the two changes.
    setPageSize: (s) => setParams({ pageSize: s, page: 1 }),
    setSearch: (v) => setParams({ search: v || undefined, page: 1 }),
  };
}
