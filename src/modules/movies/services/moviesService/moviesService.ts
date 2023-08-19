import { Sampler, isNumberInTolerance, sample, toArray } from "@common/utils";

import { MoviesRepository } from "../moviesRepository";
import { AddMovieRequestDTO, GetMovieFilters, Movie } from "../../models/movie";
import { InvalidGenreError } from "../../errors/invalidGenreError";
import { DuplicateMovieError } from "../../errors/duplicateMovieError";
import { MoviesRatingService } from "../moviesRatingService";

export type MoviesService = {
  addMovie(movieToAdd: AddMovieRequestDTO): Promise<void>;
  getRandomMovie(sampler?: Sampler): Promise<Movie[]>;
  getMoviesWithFilters(filters: GetMovieFilters, runtimeVariation?: number): Promise<Movie[]>;
};

const DEFAULT_RUNTIME_VARIATION = 10;

export const MoviesService = (
  moviesRepository: MoviesRepository,
  moviesRatingService: MoviesRatingService,
): MoviesService => {
  const assertValidGenres = async (movie: AddMovieRequestDTO) => {
    const validGenres = await moviesRepository.getGenres();
    const areValid = movie.genres.every((genre) => validGenres.includes(genre));

    if (!areValid) {
      throw new InvalidGenreError(`Invalid genre. Available genres are: ${validGenres.join(", ")}`);
    }
  };

  const assertNoDuplicates = async (movie: AddMovieRequestDTO) => {
    const movieFromDb = await moviesRepository.findByTitle(movie.title);
    if (!movieFromDb) return;

    if (movie.director === movieFromDb.director && movie.year === movieFromDb.year) {
      throw new DuplicateMovieError("This movie is already in our database");
    }
  };

  const filterMoviesByDuration = (movies: Movie[], duration: number, runtimeVariation: number) =>
    movies.filter((movie) => isNumberInTolerance(duration, movie.runtime, runtimeVariation));

  const filterMoviesByGenres = (movies: Movie[], genres: string[]) =>
    movies.filter((movie) => movie.genres.find((movieGenre) => genres.includes(movieGenre)));

  const getMoviesByDuration = async (duration: number, durationVariation: number) => {
    const allMovies = await moviesRepository.getAllMovies();
    return filterMoviesByDuration(allMovies, duration, durationVariation);
  };

  const getMoviesByGenres = async (genres: string[]) => {
    const allMovies = await moviesRepository.getAllMovies();
    const filteredMovies = filterMoviesByGenres(allMovies, genres);

    return moviesRatingService.sortMoviesByGenresRelevance(filteredMovies, genres);
  };

  const getMoviesByGenresAndDuration = async (
    genres: string[],
    duration: number,
    durationVariation: number,
  ) => {
    const genreFilteredMovies = await getMoviesByGenres(genres);
    const durationFilteredMovies = filterMoviesByDuration(
      genreFilteredMovies,
      duration,
      durationVariation,
    );

    return durationFilteredMovies;
  };

  return {
    addMovie: async (movieToAdd) => {
      await assertValidGenres(movieToAdd);
      await assertNoDuplicates(movieToAdd);
      await moviesRepository.addMovie(movieToAdd);
    },

    getRandomMovie: async (sampler = sample) => {
      const movies = await moviesRepository.getAllMovies();
      const randomMovie = sampler(movies);

      return randomMovie ? [randomMovie] : [];
    },

    getMoviesWithFilters: async (filters, runtimeVariation = DEFAULT_RUNTIME_VARIATION) => {
      const filterNames = Object.keys(filters);

      if (filterNames.length === 1 && filters.duration) {
        return await getMoviesByDuration(filters.duration, runtimeVariation);
      }

      if (filterNames.length === 1 && filters.genres) {
        return await getMoviesByGenres(toArray(filters.genres) as string[]);
      }

      if (filterNames.length === 2 && filters.genres && filters.duration) {
        return await getMoviesByGenresAndDuration(
          toArray(filters.genres) as string[],
          filters.duration,
          DEFAULT_RUNTIME_VARIATION,
        );
      }

      return [];
    },
  };
};
