import { DatabaseSchema } from "@config/database/connectJSONDb";

import { MoviesRepository } from "./moviesRepository";

export const createMockMoviesRepository = (initialData: DatabaseSchema): MoviesRepository => {
  const db = initialData;

  return {
    addMovie: async (movie) => {
      db.movies.push({ ...movie, id: db.movies.length + 1 });
    },
    findByTitle: async (title: string) => db.movies.find((movie) => movie.title === title) ?? null,
    getGenres: async () => db.genres,
    getMovie: async () => db.movies[0] ?? null,
  };
};
