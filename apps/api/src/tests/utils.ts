import { initApp } from '@/app';
import { DatabaseSchema } from '@/config/database/connectJSONDb';
import { MoviesRelevanceService, MoviesService } from '@/modules/movies';
import { createMockMoviesRepository } from '@/modules/movies/services/moviesRepository/moviesRepository.mock';

const initialData: DatabaseSchema = {
  genres: ['Action', 'Crime'],
  movies: [
    {
      director: 'Johnny',
      genres: ['Action'],
      id: 1,
      runtime: 123,
      title: 'Rose',
      year: 2005,
    },
    {
      director: 'James A',
      genres: ['Crime'],
      id: 2,
      runtime: 83,
      title: 'Twelling jo',
      year: 1992,
    },
  ],
};

export function createTestingApp() {
  const moviesRepository = createMockMoviesRepository(initialData);
  const moviesRelevanceService = MoviesRelevanceService();
  const moviesService = MoviesService(moviesRepository, moviesRelevanceService);

  return { app: initApp({ moviesService }), initialData };
}
