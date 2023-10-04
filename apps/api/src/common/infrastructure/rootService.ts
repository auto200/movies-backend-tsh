import { DbConnection } from '@/config/database/connectJSONDb';
import { MoviesRepository, MoviesService } from '@/modules/movies';

import { MoviesSearchEngineService } from './moviesSearchEngine/MoviesSearchEngineService';

export type RootService = {
  moviesSearchEngineService: MoviesSearchEngineService;
  moviesService: MoviesService;
};

export function createRootService(db: DbConnection): RootService {
  const moviesRepository = MoviesRepository(db);

  const moviesSearchEngineService = MoviesSearchEngineService();
  const moviesService = MoviesService(moviesRepository, moviesSearchEngineService);

  return { moviesSearchEngineService, moviesService };
}
