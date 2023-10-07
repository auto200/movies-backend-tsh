import { EnqueuedTask, Index, IndexOptions, MeiliSearch, Task } from 'meilisearch';

import {
  FilterableAttributes,
  Movie_SearchableModel,
  MoviesSearchIndex,
  SearchableAttributes,
} from '@movies/shared/searchEngine';

import { searchEngineConfig } from '@/config/searchEngineConfig';

export type MoviesSearchEngineService = {
  addDocuments: (movies: Movie_SearchableModel[]) => Promise<EnqueuedTask>;
  createMoviesIndex: (options?: IndexOptions) => Promise<EnqueuedTask>;
  setupSearchRules: () => Promise<void>;
  waitForTask: (task: EnqueuedTask) => Promise<Task>;
};

export const MoviesSearchEngineService = (): MoviesSearchEngineService => {
  const client = new MeiliSearch({
    host: searchEngineConfig.SE_URL,
  });

  let cachedIndex: Index<Movie_SearchableModel> | null = null;

  const waitForTask = (task: EnqueuedTask) => client.waitForTask(task.taskUid);

  const getIndex = async () => {
    if (cachedIndex) return cachedIndex;
    cachedIndex = await client.getIndex(MoviesSearchIndex);
    return cachedIndex;
  };

  return {
    addDocuments: async (movies) => {
      const index = await getIndex();
      return await index.addDocuments(movies);
    },

    createMoviesIndex: (options) => client.createIndex(MoviesSearchIndex, options),

    setupSearchRules: async () => {
      const index = await getIndex();

      // https://www.meilisearch.com/docs/reference/api/settings#update-settings
      await waitForTask(await index.resetSettings());
      await waitForTask(
        await index.updateSettings({
          filterableAttributes: FilterableAttributes,
          searchableAttributes: SearchableAttributes,
        })
      );

      return Promise.resolve();
    },

    waitForTask,
  };
};
