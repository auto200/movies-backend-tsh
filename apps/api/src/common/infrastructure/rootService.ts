import { DbConnection } from '@/config/database/connectJSONDb';
import { MoviesRelevanceService, MoviesRepository, MoviesService } from '@/modules/movies';

import { MoviesSearchEngineService } from './moviesSearchEngine/MoviesSearchEngineService';

export type RootService = {
  moviesSearchEngineService: MoviesSearchEngineService;
  moviesService: MoviesService;
};

export function createRootService(db: DbConnection): RootService {
  const moviesRepository = MoviesRepository(db);
  const moviesRelevanceService = MoviesRelevanceService();

  const moviesSearchEngineService = MoviesSearchEngineService();
  const moviesService = MoviesService(
    moviesRepository,
    moviesRelevanceService,
    moviesSearchEngineService
  );

  return { moviesSearchEngineService, moviesService };
}
