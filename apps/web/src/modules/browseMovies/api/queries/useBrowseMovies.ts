import { useMemo } from 'react';

import { useDeepCompareMemoize } from 'use-deep-compare-effect';

import { GetMovieFiltersDTO } from '@movies/shared/communication';

import { useDebouncedQuery } from '@/hooks/useDebouncedQuery';

import { browseMoviesAPI } from '../browseMoviesAPIService';

export function useBrowseMovies(filters: GetMovieFiltersDTO) {
  const memoFilters = useDeepCompareMemoize(filters);

  return useDebouncedQuery(
    useMemo(
      () => ({
        queryFn: () => browseMoviesAPI.getMovies(memoFilters),
        queryKey: ['movies', memoFilters],
      }),
      [memoFilters]
    )
  );
}
