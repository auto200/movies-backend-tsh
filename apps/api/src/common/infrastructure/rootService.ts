import { RequestHandler } from 'express';

import { DbConnection } from '@/config/database/connectJSONDb';
import { AuthService, createAuthMiddleware } from '@/modules/auth';
import { MoviesRepository, MoviesService } from '@/modules/movies';
import { UsersRepository, UsersService } from '@/modules/users';

import { MoviesSearchEngineService } from './moviesSearchEngine/MoviesSearchEngineService';

export type RootService = {
  authMiddleware: RequestHandler;
  authService: AuthService;
  moviesSearchEngineService: MoviesSearchEngineService;
  moviesService: MoviesService;
  usersService: UsersService;
};

export function createRootService(db: DbConnection): RootService {
  const moviesRepository = MoviesRepository(db);

  const moviesSearchEngineService = MoviesSearchEngineService();
  const moviesService = MoviesService(moviesRepository, moviesSearchEngineService);

  const usersRepository = UsersRepository(db);
  const usersService = UsersService(usersRepository);

  const authService = AuthService(usersRepository);
  const authMiddleware = createAuthMiddleware(authService);

  return {
    authMiddleware,
    authService,
    moviesSearchEngineService,
    moviesService,
    usersService,
  };
}
