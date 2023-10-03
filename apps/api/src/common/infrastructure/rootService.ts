import { DbConnection } from '@/config/database/connectJSONDb';
import { MoviesRelevanceService, MoviesRepository, MoviesService } from '@/modules/movies';

import { SearchEngineService } from './searchEngine/searchEngineService';

export type RootService = {
  moviesService: MoviesService;
  searchEngineService: SearchEngineService;
};

export function createRootService(db: DbConnection): RootService {
  const moviesRepository = MoviesRepository(db);
  const moviesRelevanceService = MoviesRelevanceService();

  const searchEngineService = SearchEngineService();
  const moviesService = MoviesService(
    moviesRepository,
    moviesRelevanceService,
    searchEngineService
  );

  return { moviesService, searchEngineService };
}
