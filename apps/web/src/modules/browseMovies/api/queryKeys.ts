import { GetMovieSearchFilters } from '../schema';

export const queryKeys = {
  filtersMetadata: ['filters-metadata'],
  movies: (filters: GetMovieSearchFilters, isUsingSearchEngine: boolean) =>
    ['movies', filters, isUsingSearchEngine] as const,
} as const;
