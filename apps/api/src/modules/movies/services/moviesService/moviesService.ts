import { MoviesSearchEngineService } from '@/common/infrastructure/moviesSearchEngine/MoviesSearchEngineService';
import { Sampler, isNumberInTolerance, sample, toArray } from '@/common/utils';

import { DuplicateMovieError } from '../../errors/duplicateMovieError';
import { InvalidGenreError } from '../../errors/invalidGenreError';
import {
  AddMovieRequestDTO,
  GetMovieFiltersDTO,
  MovieDTO,
  GetFiltersMetadataResponseDTO,
} from '../../models';
import { MoviesRelevanceService } from '../moviesRelevanceService';
import { MoviesRepository } from '../moviesRepository';

export type MoviesService = {
  addMovie(movieToAdd: AddMovieRequestDTO): Promise<void>;
  getFiltersMetadata(): Promise<GetFiltersMetadataResponseDTO>;
  getGenres(): Promise<string[]>;
  getMoviesWithFilters(
    filters: GetMovieFiltersDTO,
    durationVariation?: number
  ): Promise<MovieDTO[]>;
  getRandomMovie(sampler?: Sampler): Promise<MovieDTO[]>;
};

const DEFAULT_DURATION_VARIATION = 10;

export const MoviesService = (
  moviesRepository: MoviesRepository,
  moviesRelevanceService: MoviesRelevanceService,
  searchEngineService: MoviesSearchEngineService
): MoviesService => {
  const assertValidGenres = async (genres: string[]) => {
    const validGenres = await moviesRepository.getGenres();
    const areValid = genres.every((genre) => validGenres.includes(genre));

    if (!areValid) {
      throw new InvalidGenreError(`Invalid genre. Available genres are: ${validGenres.join(', ')}`);
    }
  };

  const assertNoDuplicates = async (movie: AddMovieRequestDTO) => {
    const movieFromDb = await moviesRepository.findByTitle(movie.title);
    if (!movieFromDb) return;

    if (movie.director === movieFromDb.director && movie.year === movieFromDb.year) {
      throw new DuplicateMovieError('This movie is already in our database');
    }
  };

  const filterMoviesByDuration = (
    movies: MovieDTO[],
    duration: number,
    durationVariation: number
  ) => movies.filter((movie) => isNumberInTolerance(duration, movie.runtime, durationVariation));

  const filterMoviesByGenres = (movies: MovieDTO[], genres: string[]) =>
    movies.filter((movie) => movie.genres.find((movieGenre) => genres.includes(movieGenre)));

  const getMoviesByDuration = async (duration: number, durationVariation: number) => {
    const allMovies = await moviesRepository.getAllMovies();
    return filterMoviesByDuration(allMovies, duration, durationVariation);
  };

  const getMoviesByGenres = async (genres: string[]) => {
    const allMovies = await moviesRepository.getAllMovies();
    const filteredMovies = filterMoviesByGenres(allMovies, genres);

    return moviesRelevanceService.sortMoviesByGenresRelevance(filteredMovies, genres);
  };

  const getMoviesByGenresAndDuration = async (
    genres: string[],
    duration: number,
    durationVariation: number
  ) => {
    const genreFilteredMovies = await getMoviesByGenres(genres);
    const durationFilteredMovies = filterMoviesByDuration(
      genreFilteredMovies,
      duration,
      durationVariation
    );

    return durationFilteredMovies;
  };

  const getMinMaxMovieTimes = (movies: MovieDTO[]) => {
    const times = movies.map(({ runtime }) => runtime);

    return {
      max: Math.max(...times),
      min: Math.min(...times),
    };
  };

  return {
    addMovie: async (movieToAdd) => {
      await assertValidGenres(movieToAdd.genres);
      await assertNoDuplicates(movieToAdd);
      const addedMovie = await moviesRepository.addMovie(movieToAdd);
      await searchEngineService.addDocuments([addedMovie]);
    },

    getFiltersMetadata: async () => {
      const [genres, movies] = await Promise.all([
        moviesRepository.getGenres(),
        moviesRepository.getAllMovies(),
      ]);

      return { genres, times: getMinMaxMovieTimes(movies) };
    },

    getGenres: () => moviesRepository.getGenres(),

    // NOTE: since our database does not support filtering natively we have to do it
    // on our own, if the logic grows, it could be extracted to separate service
    getMoviesWithFilters: async (filters, durationVariation = DEFAULT_DURATION_VARIATION) => {
      const filterNames = Object.keys(filters);

      if (filterNames.length === 1 && filters.duration) {
        return await getMoviesByDuration(filters.duration, durationVariation);
      }

      if (filterNames.length === 1 && filters.genres) {
        const genres = toArray(filters.genres);

        await assertValidGenres(genres);
        return await getMoviesByGenres(genres);
      }

      if (filterNames.length === 2 && filters.genres && filters.duration) {
        return await getMoviesByGenresAndDuration(
          toArray(filters.genres),
          filters.duration,
          DEFAULT_DURATION_VARIATION
        );
      }

      return [];
    },

    getRandomMovie: async (sampler = sample) => {
      const movies = await moviesRepository.getAllMovies();
      const randomMovie = sampler(movies);

      return randomMovie ? [randomMovie] : [];
    },
  };
};
