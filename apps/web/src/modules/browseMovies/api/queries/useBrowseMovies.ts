import { useMemo } from 'react';

import { useDeepCompareMemoize } from 'use-deep-compare-effect';

import { MovieDTO } from '@movies/shared/communication';
import { MoviesRelevance } from '@movies/shared/utils';

import { useDebouncedQuery } from '@/hooks/useDebouncedQuery';

import { GetMovieSearchFilters } from '../../schema';
import { browseMoviesAPI } from '../BrowseMoviesAPIService';
import { queryKeys } from '../queryKeys';
import { moviesSearchEngine } from '../SearchEngineMoviesApiService';

export function useBrowseMovies(filters: GetMovieSearchFilters, isUsingSearchEngine = true) {
  const memoFilters = useDeepCompareMemoize(filters);

  return useDebouncedQuery(
    useMemo(
      () => ({
        queryFn: async () =>
          isUsingSearchEngine
            ? moviesSearchEngine.getMovies(memoFilters)
            : browseMoviesAPI.getMovies(memoFilters),
        queryKey: queryKeys.movies(memoFilters, isUsingSearchEngine),
        select: isUsingSearchEngine
          ? (a: MovieDTO[]) => MoviesRelevance.sortMoviesByGenresRelevance(a, memoFilters.genres)
          : undefined,
      }),
      [memoFilters, isUsingSearchEngine]
    )
  );
}
