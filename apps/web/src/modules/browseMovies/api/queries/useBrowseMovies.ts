import { useMemo } from 'react';

import { useDeepCompareMemoize } from 'use-deep-compare-effect';

import { MovieDTO } from '@movies/shared/communication';
import { MoviesRelevance } from '@movies/shared/utils';

import { useDebouncedQuery } from '@/hooks/useDebouncedQuery';

import { GetMovieSearchFilters } from '../../schema';
import { browseMoviesAPI } from '../BrowseMoviesAPIService';
import { moviesSearchEngine } from '../SearchEngineMoviesApiService';

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
        select: useSearchEngine
          ? (a: MovieDTO[]) => MoviesRelevance.sortMoviesByGenresRelevance(a, memoFilters.genres)
          : undefined,
      }),
      [memoFilters, useSearchEngine]
    )
  );
}
