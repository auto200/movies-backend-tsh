import { MoviesRepository } from ".././moviesRepository";
import { AddMovieRequestDTO, GetMovieFilters, Movie } from "../../models/movie";
import { InvalidGenreError } from "../../errors/invalidGenreError";
import { DuplicateMovieError } from "../../errors/duplicateMovieError";
import { Sampler, sample } from "@common/utils";

export type MoviesService = {
  addMovie(movieToAdd: AddMovieRequestDTO): Promise<void>;
  getRandomMovie(sampler?: Sampler): Promise<Movie[]>;
  getMoviesWithFilters(filters: GetMovieFilters, runtimeVariation?: number): Promise<Movie[]>;
};

const DEFAULT_RUNTIME_VARIATION = 10;

export const MoviesService = (moviesRepository: MoviesRepository): MoviesService => {
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

  const addMovie = async (movieToAdd: AddMovieRequestDTO) => {
    await assertValidGenres(movieToAdd);
    await assertNoDuplicates(movieToAdd);
    await moviesRepository.addMovie(movieToAdd);
  };

  const getRandomMovie = async (sampler: Sampler = sample) => {
    const movie = await moviesRepository.getRandomMovie(sampler);
    return movie ? [movie] : [];
  };

  const getMoviesWithFilters = async (
    filters: GetMovieFilters,
    runtimeVariation = DEFAULT_RUNTIME_VARIATION,
  ) => {
    const filterNames = Object.keys(filters);

    if (filterNames.length === 1 && typeof filters.duration === "number") {
      return await moviesRepository.getMoviesByDuration(filters.duration, runtimeVariation);
    }

    if (filterNames.length === 1 && filters.genres) {
      return await moviesRepository.getMoviesByGenres(
        Array.isArray(filters.genres) ? filters.genres : [filters.genres],
      );
    }

    return [];
  };

  return {
    addMovie,
    getRandomMovie,
    getMoviesWithFilters,
  };
};
