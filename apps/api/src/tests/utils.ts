import { initApp } from '@/app';
import { MoviesSearchEngineServiceMock } from '@/common/infrastructure/moviesSearchEngine/MoviesSearchEngineService.mock';
import { DatabaseSchema } from '@/config/database/connectJSONDb';
import { MoviesService } from '@/modules/movies';
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
  const moviesSearchEngineService = MoviesSearchEngineServiceMock();
  const moviesService = MoviesService(moviesRepository, moviesSearchEngineService);

  return {
    app: initApp({ moviesSearchEngineService, moviesService }),
    initialData,
  };
}
