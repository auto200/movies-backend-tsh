/*eslint-disable @typescript-eslint/no-floating-promises */
import { describe, test, expect } from 'vitest';

import { MoviesSearchEngineServiceMock } from '@/common/infrastructure/moviesSearchEngine/MoviesSearchEngineService.mock';
import { Sampler } from '@/common/utils';
import { DatabaseSchema } from '@/config/database/connectJSONDb';

import { DuplicateMovieError } from '../../errors/duplicateMovieError';
import { InvalidGenreError } from '../../errors/invalidGenreError';
import { AddMovieRequestDTO, MovieDTO } from '../../models';
import { createMockMoviesRepository } from '../moviesRepository/moviesRepository.mock';

import { MoviesService } from './moviesService';

const createMockMovieService = (initialData: DatabaseSchema) => {
  const mockMoviesRepository = createMockMoviesRepository(initialData);
  const moviesSearchEngineService = MoviesSearchEngineServiceMock();

  return MoviesService(mockMoviesRepository, moviesSearchEngineService);
};

describe('MoviesService', () => {
  test('adding a movie', () => {
    const initialData: DatabaseSchema = {
      genres: ['Comedy', 'Fantasy'],
      movies: [],
    };
    const moviesService = createMockMovieService(initialData);

    const movie: AddMovieRequestDTO = {
      actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
      director: 'Tim Burton',
      genres: ['Comedy', 'Fantasy'],
      plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
      posterUrl:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
      runtime: 92,
      title: 'Beetlejuice',
      year: 1988,
    };

    expect(moviesService.addMovie(movie)).resolves.toBeUndefined();
  });

  test('adding remake of a movie should not throw', () => {
    const movie: AddMovieRequestDTO = {
      actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
      director: 'Tim Burton',
      genres: ['Comedy', 'Fantasy'],
      plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
      posterUrl:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
      runtime: 92,
      title: 'Beetlejuice',
      year: 1988,
    };

    const initialData: DatabaseSchema = {
      genres: ['Comedy', 'Fantasy'],
      movies: [{ ...movie, id: 1 }],
    };
    const moviesService = createMockMovieService(initialData);

    const movieRemake = { ...movie, year: 2002 };

    expect(moviesService.addMovie(movieRemake)).resolves.toBeUndefined();
  });

  test('adding movie with invalid genre should throw', () => {
    const initialData: DatabaseSchema = { genres: ['action', 'horror'], movies: [] };
    const moviesService = createMockMovieService(initialData);

    const movie: AddMovieRequestDTO = {
      actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
      director: 'Tim Burton',
      genres: ['Comedy', 'Fantasy'],
      plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
      posterUrl:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
      runtime: 92,
      title: 'Beetlejuice',
      year: 1988,
    };

    expect(moviesService.addMovie(movie)).rejects.toThrowError(InvalidGenreError);
  });

  test('adding movie duplicate should throw', () => {
    const movie: AddMovieRequestDTO = {
      actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
      director: 'Tim Burton',
      genres: ['Comedy', 'Fantasy'],
      plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
      posterUrl:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
      runtime: 92,
      title: 'Beetlejuice',
      year: 1988,
    };

    const initialData: DatabaseSchema = {
      genres: ['Comedy', 'Fantasy'],
      movies: [{ ...movie, id: 1 }],
    };
    const moviesService = createMockMovieService(initialData);

    expect(moviesService.addMovie(movie)).rejects.toThrowError(DuplicateMovieError);
  });

  test('get random movie', () => {
    const initialData: DatabaseSchema = {
      genres: ['Comedy', 'Fantasy'],
      movies: [
        {
          actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
          director: 'Tim Burton',
          genres: ['Comedy', 'Fantasy'],
          id: 1,
          plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
          runtime: 92,
          title: 'Beetlejuice',
          year: 1988,
        },
        {
          actors: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
          director: 'Frank Darabont',
          genres: ['Crime', 'Drama'],
          id: 3,
          plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX300.jpg',
          runtime: 142,
          title: 'The Shawshank Redemption',
          year: 1994,
        },
      ],
    };

    const moviesService = createMockMovieService(initialData);

    const SAMPLE_INDEX = 1;
    const mockSampler: Sampler = (arr) => arr[SAMPLE_INDEX];

    const expected = [initialData.movies[SAMPLE_INDEX]];

    expect(moviesService.getRandomMovie(mockSampler)).resolves.toEqual(expected);
  });

  test('get movies with duration filter', () => {
    const initialData: DatabaseSchema = {
      genres: ['Comedy', 'Fantasy'],
      movies: [
        {
          actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
          director: 'Tim Burton',
          genres: ['Comedy', 'Fantasy'],
          id: 1,
          plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
          runtime: 50,
          title: 'Beetlejuice',
          year: 1988,
        },
        {
          actors: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
          director: 'Frank Darabont',
          genres: ['Crime', 'Drama'],
          id: 3,
          plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX300.jpg',
          runtime: 100,
          title: 'The Shawshank Redemption',
          year: 1994,
        },
      ],
    };

    const moviesService = createMockMovieService(initialData);

    const expected1 = [initialData.movies[0]];
    expect(moviesService.getMoviesWithFilters({ duration: 49 })).resolves.toEqual(expected1);

    const expected2 = [initialData.movies[1]];
    expect(moviesService.getMoviesWithFilters({ duration: 90 })).resolves.toEqual(expected2);
  });

  test('get movies with genres filter', () => {
    const initialData: DatabaseSchema = {
      genres: ['Comedy', 'Fantasy', 'Drama'],
      movies: [
        {
          actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
          director: 'Tim Burton',
          genres: ['Comedy', 'Fantasy'],
          id: 1,
          plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
          runtime: 50,
          title: 'Beetlejuice',
          year: 1988,
        },
        {
          actors: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
          director: 'Frank Darabont',
          genres: ['Crime', 'Drama'],
          id: 3,
          plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX300.jpg',
          runtime: 100,
          title: 'The Shawshank Redemption',
          year: 1994,
        },
      ],
    };

    const moviesService = createMockMovieService(initialData);

    const expected1 = [initialData.movies[0]];
    expect(moviesService.getMoviesWithFilters({ genres: ['Comedy'] })).resolves.toEqual(expected1);

    const expected2 = [initialData.movies[1]];
    expect(moviesService.getMoviesWithFilters({ genres: ['Drama'] })).resolves.toEqual(expected2);
  });

  test('get movies with genres filter should throw if provided invalid genre', () => {
    const initialData: DatabaseSchema = {
      genres: ['Comedy', 'Fantasy'],
      movies: [],
    };

    const moviesService = createMockMovieService(initialData);

    expect(moviesService.getMoviesWithFilters({ genres: ['Drama'] })).rejects.toThrowError(
      InvalidGenreError
    );
  });

  test('get movies with genres and duration filters', () => {
    const initialData: DatabaseSchema = {
      genres: ['Comedy', 'Fantasy'],
      movies: [
        {
          actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
          director: 'Tim Burton',
          genres: ['Comedy', 'Fantasy'],
          id: 1,
          plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
          runtime: 50,
          title: 'Beetlejuice',
          year: 1988,
        },
        {
          actors: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
          director: 'Frank Darabont',
          genres: ['Crime', 'Drama'],
          id: 3,
          plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX300.jpg',
          runtime: 100,
          title: 'The Shawshank Redemption',
          year: 1994,
        },
      ],
    };

    const moviesService = createMockMovieService(initialData);

    const expected1 = [initialData.movies[0]];
    expect(
      moviesService.getMoviesWithFilters({ duration: 60, genres: ['Comedy'] })
    ).resolves.toEqual(expected1);

    const expected2 = [initialData.movies[1]];
    expect(
      moviesService.getMoviesWithFilters({ duration: 90, genres: ['Drama'] })
    ).resolves.toEqual(expected2);

    const expected3 = [] as MovieDTO[];
    expect(
      moviesService.getMoviesWithFilters({ duration: 90, genres: ['Comedy'] })
    ).resolves.toEqual(expected3);

    const expected4 = [] as MovieDTO[];
    expect(
      moviesService.getMoviesWithFilters({ duration: 60, genres: ['Drama'] })
    ).resolves.toEqual(expected4);
  });
});
