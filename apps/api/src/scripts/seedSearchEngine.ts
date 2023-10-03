import 'dotenv/config';

import { SearchEngineIndexName } from '@/common/infrastructure/searchEngine/models';
import { SearchEngineService } from '@/common/infrastructure/searchEngine/searchEngineService';
import { connectJSONDb } from '@/config/database/connectJSONDb';
import { MoviesRepository } from '@/modules/movies';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const conn = await connectJSONDb();
  const moviesRepository = MoviesRepository(conn);

  const searchEngineService = SearchEngineService();

  const allMovies = await moviesRepository.getAllMovies();

  await searchEngineService.waitForTask(
    await searchEngineService.createIndex(SearchEngineIndexName.movies)
  );

  const task = await searchEngineService.addDocumentsToIndex({
    data: allMovies,
    indexName: SearchEngineIndexName.movies,
  });
  const {
    details: { indexedDocuments },
  } = await searchEngineService.waitForTask(task);
  // eslint-disable-next-line no-console
  console.log(`Successfully added ${indexedDocuments} documents`);
})();
