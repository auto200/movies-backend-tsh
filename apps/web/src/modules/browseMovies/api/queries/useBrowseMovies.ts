import { useMemo } from 'react';

import { useDeepCompareMemoize } from 'use-deep-compare-effect';

import { useDebouncedQuery } from '@/hooks/useDebouncedQuery';

import { GetMovieSearchFilters } from '../../schema';
import { browseMoviesAPI } from '../BrowseMoviesAPIService';
import { moviesSearchEngine } from '../SearchEngineMoviesApiService';

// TODO: add checkbox to toggle between search engine and regular backend api
// TODO: reimplement sorting by relevance when using search engine

export function useBrowseMovies(filters: GetMovieSearchFilters, useSearchEngine = true) {
  const memoFilters = useDeepCompareMemoize(filters);

  return useDebouncedQuery(
    useMemo(
      () => ({
        queryFn: async () =>
          useSearchEngine
            ? moviesSearchEngine.getMovies(memoFilters)
            : browseMoviesAPI.getMovies(memoFilters),
        queryKey: ['movies', memoFilters, useSearchEngine],
      }),
      [memoFilters, useSearchEngine]
    )
  );
}
