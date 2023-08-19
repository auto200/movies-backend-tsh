import { DatabaseSchema } from "@config/database/connectJSONDb";

import { MoviesRepository } from "./moviesRepository";
import { isNumberInTolerance, sample } from "@common/utils";

export const createMockMoviesRepository = (initialData: DatabaseSchema): MoviesRepository => {
  const db = initialData;

  return {
    addMovie: async (movie) => {
      db.movies.push({ ...movie, id: db.movies.length + 1 });
    },
    findByTitle: async (title) => db.movies.find((movie) => movie.title === title) ?? null,
    getGenres: async () => db.genres,
    getRandomMovie: async (sampler = sample) => sampler(db.movies) ?? null,
    getMoviesByDuration: async (runtime, variation) =>
      db.movies.filter((movie) => isNumberInTolerance(runtime, movie.runtime, variation)),
    getMoviesByGenres: async (genres) =>
      db.movies.filter((movie) => movie.genres.find((movieGenre) => genres.includes(movieGenre))),
  };
};
