import { useMemo } from 'react';

import { useDeepCompareMemoize } from 'use-deep-compare-effect';

import { MovieDTO } from '@movies/shared/communication';
import { MoviesRelevance } from '@movies/shared/utils';

import { useDebouncedQuery } from '@/hooks/useDebouncedQuery';

import { GetMovieSearchFilters } from '../../schema';
import { browseMoviesAPI } from '../BrowseMoviesAPIService';
import { queryKeys } from '../queryKeys';
import { moviesSearchEngine } from '../SearchEngineMoviesApiService';

export function useBrowseMovies(filters: GetMovieSearchFilters, isUsingSearchEngine: boolean) {
  const memoFilters = useDeepCompareMemoize(filters);

  return useDebouncedQuery(
    useMemo(
      () =>
        isUsingSearchEngine
          ? {
              queryFn: async () => moviesSearchEngine.getMovies(memoFilters),
              queryKey: queryKeys.movies(memoFilters, 'searchEngine'),
              select: (a: MovieDTO[]) =>
                MoviesRelevance.sortMoviesByGenresRelevance(a, memoFilters.genres),
            }
          : {
              queryFn: async () => browseMoviesAPI.getMovies(memoFilters),
              queryKey: queryKeys.movies(memoFilters, 'api'),
            },
      [memoFilters, isUsingSearchEngine]
    )
  );
}
