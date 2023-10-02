import cloneDeep from 'lodash/cloneDeep';

import { DatabaseSchema } from '@/config/database/connectJSONDb';

import { MoviesRepository } from './moviesRepository';

export const createMockMoviesRepository = (initialData: DatabaseSchema): MoviesRepository => {
  // make sure data is not shared between instances
  const db = cloneDeep(initialData);

  return {
    addMovie: async (movie) => {
      db.movies.push({ ...movie, id: db.movies.length + 1 });
      return Promise.resolve();
    },
    findByTitle: async (title) =>
      Promise.resolve(db.movies.find((movie) => movie.title === title) ?? null),
    getAllMovies: async () => Promise.resolve(db.movies),
    getGenres: async () => Promise.resolve(db.genres),
  };
};
