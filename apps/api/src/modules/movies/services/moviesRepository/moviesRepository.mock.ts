import { DatabaseSchema } from '@/config/database/connectJSONDb';

import { MoviesRepository } from './moviesRepository';

type InitialDbData = Pick<DatabaseSchema, 'movies' | 'genres'>;

export const MockMoviesRepository = (initialData?: InitialDbData): MoviesRepository => {
  // make sure data is not shared between instances
  const movies: DatabaseSchema['movies'] = initialData?.movies ?? [];
  const genres: DatabaseSchema['genres'] = initialData?.genres ?? [];

  return {
    addMovie: async (movie) => {
      const movieWithId = { ...movie, id: movies.length + 1 };
      movies.push(movieWithId);

      return Promise.resolve(movieWithId);
    },
    findByTitle: async (title) =>
      Promise.resolve(movies.find((movie) => movie.title === title) ?? null),
    getAllMovies: async () => Promise.resolve(movies),
    getGenres: async () => Promise.resolve(genres),
  };
};
