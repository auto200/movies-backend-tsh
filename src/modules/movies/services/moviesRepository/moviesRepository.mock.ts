import { DatabaseSchema } from "@config/database/connectJSONDb";

import { MoviesRepository } from "./moviesRepository";
import { isNumberInTolerance, sample } from "@common/utils";
import { Movie } from "@modules/movies/models/movie";

export const createMockMoviesRepository = (initialData: DatabaseSchema): MoviesRepository => {
  const db = initialData;

  const filterMoviesByDuration = (movies: Movie[], duration: number, runtimeVariation: number) =>
    movies.filter((movie) => isNumberInTolerance(duration, movie.runtime, runtimeVariation));

  const filterMoviesByGenres = (movies: Movie[], genres: string[]) =>
    movies.filter((movie) => movie.genres.find((movieGenre) => genres.includes(movieGenre)));

  return {
    addMovie: async (movie) => {
      db.movies.push({ ...movie, id: db.movies.length + 1 });
    },
    findByTitle: async (title) => db.movies.find((movie) => movie.title === title) ?? null,
    getGenres: async () => db.genres,
    getRandomMovie: async (sampler = sample) => sampler(db.movies) ?? null,
    getMoviesByDuration: async (duration, variation) =>
      filterMoviesByDuration(db.movies, duration, variation),
    getMoviesByGenres: async (genres) => filterMoviesByGenres(db.movies, genres),
    getMoviesByGenresAndDuration: async (genres, duration, durationVariation) => {
      const genreFilteredMovies = filterMoviesByGenres(db.movies, genres);
      const durationFilteredMovies = filterMoviesByDuration(
        genreFilteredMovies,
        duration,
        durationVariation,
      );

      return durationFilteredMovies;
    },
  };
};
