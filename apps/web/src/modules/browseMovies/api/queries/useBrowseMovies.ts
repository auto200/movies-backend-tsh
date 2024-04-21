import { useMemo } from 'react';

import { MovieDTO } from '@movies/shared/communication';
import { MoviesRelevance } from '@movies/shared/utils';

import { useDebouncedQuery } from '@/hooks/useDebouncedQuery';

import { GetMovieSearchFilters } from '../../schema';
import { browseMoviesAPI } from '../BrowseMoviesAPIService';
import { queryKeys } from '../queryKeys';
import { moviesSearchEngine } from '../SearchEngineMoviesApiService';

export function useBrowseMovies(filters: GetMovieSearchFilters, isUsingSearchEngine: boolean) {
  return useDebouncedQuery(
    useMemo(
      () =>
        isUsingSearchEngine
          ? {
              queryFn: async () => moviesSearchEngine.getMovies(filters),
              queryKey: queryKeys.movies(filters, 'searchEngine'),
              select: (a: MovieDTO[]) =>
                MoviesRelevance.sortMoviesByGenresRelevance(a, filters.genres),
            }
          : {
              queryFn: async () => browseMoviesAPI.getMovies(filters),
              queryKey: queryKeys.movies(filters, 'api'),
            },
      [filters, isUsingSearchEngine]
    )
  );
}
