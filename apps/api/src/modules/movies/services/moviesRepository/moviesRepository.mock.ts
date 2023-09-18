/* eslint-disable @typescript-eslint/require-await */
import { DatabaseSchema } from '@/config/database/connectJSONDb';

import { MoviesRepository } from './moviesRepository';

export const createMockMoviesRepository = (initialData: DatabaseSchema): MoviesRepository => {
  const db = initialData;

  return {
    addMovie: async (movie) => {
      db.movies.push({ ...movie, id: db.movies.length + 1 });
    },
    findByTitle: async (title) => db.movies.find((movie) => movie.title === title) ?? null,
    getAllMovies: async () => db.movies,
    getGenres: async () => db.genres,
  };
};
