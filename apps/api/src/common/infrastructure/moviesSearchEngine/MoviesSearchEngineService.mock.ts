import { EnqueuedTask, Task } from 'meilisearch';

import { Movie_SearchableModel } from '@movies/shared/searchEngine';

import { MoviesSearchEngineService } from './MoviesSearchEngineService';

export const MoviesSearchEngineServiceMock = (): MoviesSearchEngineService => {
  const index: Movie_SearchableModel[] = [];

  return {
    addDocuments: (movies) => {
      index.push(...movies);
      return Promise.resolve({} as EnqueuedTask);
    },

    createMoviesIndex: (_options) => Promise.resolve({} as EnqueuedTask),

    setupSearchRules: () => Promise.resolve(),

    waitForTask: (_task) => Promise.resolve({} as Task),
  };
};
