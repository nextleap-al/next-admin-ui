import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import type { QueryParams } from '../types';

/**
 * Controlled URL-search-params hook.
 *
 * NOTE: this hook depends on `react-router-dom`. It is only safe to use in
 * apps that wrap the tree in a `<BrowserRouter>` (or equivalent). Apps
 * using a different router should implement their own equivalent.
 */
export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo<QueryParams>(() => {
    const result: QueryParams = {};

    searchParams.forEach((value, key) => {
      if (key === 'page' || key === 'pageSize') {
        result[key] = parseInt(value, 10);
      } else {
        result[key] = value;
      }
    });

    return result;
  }, [searchParams]);

  const setParams = useCallback(
    (newParams: Partial<QueryParams>, replace = false) => {
      setSearchParams(prev => {
        const updated = replace ? new URLSearchParams() : new URLSearchParams(prev);

        Object.entries(newParams).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '') {
            updated.delete(key);
          } else {
            updated.set(key, String(value));
          }
        });

        return updated;
      });
    },
    [setSearchParams]
  );

  const setParam = useCallback(
    (key: string, value: string | number | boolean | undefined) => {
      setParams({ [key]: value });
    },
    [setParams]
  );

  const removeParam = useCallback(
    (key: string) => {
      setSearchParams(prev => {
        const updated = new URLSearchParams(prev);
        updated.delete(key);
        return updated;
      });
    },
    [setSearchParams]
  );

  const clearParams = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    params,
    setParams,
    setParam,
    removeParam,
    clearParams,
    page: params.page || 1,
    pageSize: params.pageSize || 20,
    search: (params.search as string) || '',
    sort: (params.sort as string) || '',
  };
}
