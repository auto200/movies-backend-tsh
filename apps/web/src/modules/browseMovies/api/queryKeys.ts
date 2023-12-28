import { GetMovieSearchFilters } from '../schema';

export const queryKeys = {
  filtersMetadata: ['filters-metadata'],
  movies: (filters: GetMovieSearchFilters, provider: 'api' | 'searchEngine') => [
    'movies',
    provider,
    filters,
  ],
} as const;
