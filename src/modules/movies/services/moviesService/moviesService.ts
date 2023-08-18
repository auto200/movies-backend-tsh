import { MoviesRepository } from ".././moviesRepository";
import { AddMovieRequestDTO, Movie } from "../../models/movie";
import { InvalidGenreError } from "../../errors/invalidGenreError";
import { DuplicateMovieError } from "../../errors/duplicateMovieError";
import { Sampler, sample } from "@common/utils";

export type MoviesService = {
  addMovie(movieToAdd: AddMovieRequestDTO): Promise<void>;
  getRandomMovie(sampler?: Sampler): Promise<Movie[]>;
};

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

  return {
    addMovie,
    getRandomMovie,
  };
};
