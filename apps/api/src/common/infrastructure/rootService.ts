import { RequestHandler } from 'express';

import { DbConnection } from '@/config/database/connectJSONDb';
import { AuthRepository, AuthService, authMiddleware } from '@/modules/auth';
import { MoviesRepository, MoviesService } from '@/modules/movies';

import { MoviesSearchEngineService } from './moviesSearchEngine/MoviesSearchEngineService';

export type RootService = {
  authMiddleware: RequestHandler;
  authService: AuthService;
  moviesSearchEngineService: MoviesSearchEngineService;
  moviesService: MoviesService;
};

export function createRootService(db: DbConnection): RootService {
  const moviesRepository = MoviesRepository(db);

  const moviesSearchEngineService = MoviesSearchEngineService();
  const moviesService = MoviesService(moviesRepository, moviesSearchEngineService);

  const authRepository = AuthRepository(db);
  const authService = AuthService(authRepository);

  return {
    authMiddleware,
    authService,
    moviesSearchEngineService,
    moviesService,
  };
}
