import { EnqueuedTask, IndexOptions, MeiliSearch, Task } from 'meilisearch';

import { searchEngineConfig } from '@/config/searchEngineConfig';

import { SearchEngineIndexName, Movie_SearchableModel } from './models';

type AddDocumentsToIndexParams = {
  data: Movie_SearchableModel[];
  indexName: SearchEngineIndexName.movies;
};

export type SearchEngineService = {
  addDocumentsToIndex: ({ data, indexName }: AddDocumentsToIndexParams) => Promise<EnqueuedTask>;
  createIndex: (name: string, options?: IndexOptions) => Promise<EnqueuedTask>;
  setupSearchRules: () => Promise<void>;
  waitForTask: (task: EnqueuedTask) => Promise<Task>;
};

export const SearchEngineService = (): SearchEngineService => {
  const client = new MeiliSearch({
    host: searchEngineConfig.SE_HOST,
  });

  const waitForTask = (task: EnqueuedTask) => client.waitForTask(task.taskUid);

  return {
    addDocumentsToIndex: async ({ data, indexName }) => {
      const index = await client.getIndex(indexName);
      return await index.addDocuments(data);
    },

    createIndex: (indexName, options) => client.createIndex(indexName, options),

    setupSearchRules: async () => {
      const moviesIndex = await client.getIndex(SearchEngineIndexName.movies);

      // https://www.meilisearch.com/docs/reference/api/settings#update-settings
      await waitForTask(await moviesIndex.resetSettings());
      await waitForTask(await moviesIndex.updateSettings({ searchableAttributes }));

      return Promise.resolve();
    },

    waitForTask,
  };
};

// ordered by importance
const searchableAttributes: Array<keyof Movie_SearchableModel> = [
  'title',
  'genres',
  'director',
  'actors',
  'plot',
  'year',
];
