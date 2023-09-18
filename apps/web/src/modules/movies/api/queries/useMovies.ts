import { useMemo } from 'react';

import { useDeepCompareMemoize } from 'use-deep-compare-effect';

import { GetMovieFiltersDTO } from '@movies/shared/communication';

import { useDebouncedQuery } from '@/common/hooks/useDebouncedQuery';

import { moviesAPI } from '../moviesAPIService';

export function useMovies(filters: GetMovieFiltersDTO) {
  const memoFilters = useDeepCompareMemoize(filters);

  return useDebouncedQuery(
    useMemo(
      () => ({
        queryFn: () => moviesAPI.getMovies(memoFilters),
        queryKey: ['movies', memoFilters],
      }),
      [memoFilters]
    )
  );
}
