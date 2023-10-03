import { EnqueuedTask, Task } from 'meilisearch';

import { Movie_SearchableModel, SearchEngineIndexName } from './models';
import { type SearchEngineService } from './searchEngineService';

export const SearchEngineServiceMock = (): SearchEngineService => {
  const indexes: { [SearchEngineIndexName.movies]: Movie_SearchableModel[] } = {
    [SearchEngineIndexName.movies]: [],
  };

  return {
    addDocumentsToIndex: ({ data, indexName }) => {
      indexes[indexName].push(...data);
      return Promise.resolve({} as EnqueuedTask);
    },

    createIndex: (_name, _options) => Promise.resolve({} as EnqueuedTask),

    setupSearchRules: () => Promise.resolve(),

    waitForTask: (_task) => Promise.resolve({} as Task),
  };
};
