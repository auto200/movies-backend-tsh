import { MoviesRepository } from "./moviesRepository";
import { AddMovieDTO, Movie } from "../models/movie";
import { InvalidGenreError } from "../errors/invalidGenreError";
import { DuplicateMovieError } from "../errors/duplicateMovieError";

export type MoviesService = {
  addMovie(movieToAdd: AddMovieDTO): Promise<void>;
  getMovie(): Promise<Movie | null>;
};

export const MoviesService = (moviesRepository: MoviesRepository): MoviesService => {
  const assertValidGenres = async (movie: AddMovieDTO) => {
    const validGenres = await moviesRepository.getGenres();
    const areValid = movie.genres.every((genre) => validGenres.includes(genre));

    if (!areValid) {
      throw new InvalidGenreError(`Invalid genre. Available genres are: ${validGenres.join(", ")}`);
    }
  };

  const assertNoDuplicates = async (movie: AddMovieDTO) => {
    const movieFromDb = await moviesRepository.findByTitle(movie.title);
    if (!movieFromDb) return;

    if (movie.director === movieFromDb.director && movie.year === movieFromDb.year) {
      throw new DuplicateMovieError("This movie is already in our database");
    }
  };

  const addMovie = async (movieToAdd: AddMovieDTO) => {
    await assertValidGenres(movieToAdd);
    await assertNoDuplicates(movieToAdd);
    await moviesRepository.addMovie(movieToAdd);
  };

  return {
    addMovie,
    getMovie: moviesRepository.getMovie,
  };
};
