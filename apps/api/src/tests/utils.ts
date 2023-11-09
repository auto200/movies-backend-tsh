import cloneDeep from 'lodash/cloneDeep';

import { initApp } from '@/app';
import { MoviesSearchEngineServiceMock } from '@/common/infrastructure/moviesSearchEngine/MoviesSearchEngineService.mock';
import { DatabaseSchema } from '@/config/database/connectJSONDb';
import { AuthService, authMiddleware } from '@/modules/auth';
import { MoviesService } from '@/modules/movies';
import { MockMoviesRepository } from '@/modules/movies/services/moviesRepository/moviesRepository.mock';
import { UsersService } from '@/modules/users';
import { MockUsersRepository } from '@/modules/users/services/usersRepository/usersRepository.mock';

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
  users: [],
};

export function createTestingApp(testSpecificData?: Partial<DatabaseSchema>) {
  const dbData = cloneDeep({ ...initialData, ...testSpecificData });

  const moviesRepository = MockMoviesRepository({ genres: dbData.genres, movies: dbData.movies });
  const moviesSearchEngineService = MoviesSearchEngineServiceMock();
  const moviesService = MoviesService(moviesRepository, moviesSearchEngineService);

  const usersRepository = MockUsersRepository(dbData.users);
  const usersService = UsersService(usersRepository);

  const authService = AuthService(usersRepository);

  return {
    app: initApp({
      authMiddleware,
      authService,
      moviesSearchEngineService,
      moviesService,
      usersService,
    }),
    initialData,
  };
}
