import 'dotenv/config';

import { MoviesSearchEngineService } from '@/common/infrastructure/moviesSearchEngine/MoviesSearchEngineService';
import { connectJSONDb } from '@/config/database/connectJSONDb';
import { MoviesRepository } from '@/modules/movies';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const conn = await connectJSONDb();
  const moviesRepository = MoviesRepository(conn);

  const moviesSearchEngineService = MoviesSearchEngineService();

  const allMovies = await moviesRepository.getAllMovies();

  await moviesSearchEngineService.waitForTask(await moviesSearchEngineService.createMoviesIndex());

  const task = await moviesSearchEngineService.addDocuments(allMovies);
  const {
    details: { indexedDocuments },
  } = await moviesSearchEngineService.waitForTask(task);
  // eslint-disable-next-line no-console
  console.log(`Successfully added ${indexedDocuments} documents`);
})();
