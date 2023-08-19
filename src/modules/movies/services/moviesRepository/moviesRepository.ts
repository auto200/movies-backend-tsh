import { DbConnection } from "@config/database/connectJSONDb";

import { AddMovieRequestDTO, Movie } from "../../models/movie";
import { Sampler, isNumberInTolerance, sample } from "@common/utils";

export type MoviesRepository = {
  findByTitle(title: string): Promise<Movie | null>;
  getGenres(): Promise<string[]>;
  getRandomMovie(sampler?: Sampler): Promise<Movie | null>;
  addMovie(movieToAdd: AddMovieRequestDTO): Promise<void>;
  getMoviesByDuration(runtime: number, variation: number): Promise<Movie[]>;
  getMoviesByGenres(genres: string[]): Promise<Movie[]>;
  getMoviesByGenresAndDuration(
    genres: string[],
    duration: number,
    durationVariation: number,
  ): Promise<Movie[]>;
};

export const MoviesRepository = (db: DbConnection): MoviesRepository => {
  const filterMoviesByDuration = (movies: Movie[], duration: number, runtimeVariation: number) =>
    movies.filter((movie) => isNumberInTolerance(duration, movie.runtime, runtimeVariation));

  const filterMoviesByGenres = (movies: Movie[], genres: string[]) =>
    movies.filter((movie) => movie.genres.find((movieGenre) => genres.includes(movieGenre)));

  return {
    findByTitle: async (title) => {
      const movie = db.data.movies.find((movie) => movie.title === title);

      return movie ?? null;
    },

    getRandomMovie: async (sampler = sample) => sampler(db.data.movies) ?? null,

    getGenres: async () => db.data.genres,

    addMovie: async (movieToAdd) => {
      db.data.movies.push({ ...movieToAdd, id: db.data.movies.length + 1 });
      await db.write();
    },

    getMoviesByDuration: async (duration, variation) => {
      const movies = db.data.movies.filter((movie) =>
        isNumberInTolerance(duration, movie.runtime, variation),
      );

      return movies;
    },

    getMoviesByGenres: async (genres) => filterMoviesByGenres(db.data.movies, genres),

    getMoviesByGenresAndDuration: async (genres, duration, durationVariation) => {
      const genreFilteredMovies = filterMoviesByGenres(db.data.movies, genres);
      const durationFilteredMovies = filterMoviesByDuration(
        genreFilteredMovies,
        duration,
        durationVariation,
      );

      return durationFilteredMovies;
    },
  };
};
