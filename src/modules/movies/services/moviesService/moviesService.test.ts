import { describe, test, expect } from "vitest";

import { Sampler } from "@common/utils";
import { DatabaseSchema } from "@config/database/connectJSONDb";

import { AddMovieRequestDTO, Movie } from "../../models/movie";
import { InvalidGenreError } from "../../errors/invalidGenreError";
import { DuplicateMovieError } from "../../errors/duplicateMovieError";

import { MoviesService } from "./moviesService";
import { createMockMoviesRepository } from "../moviesRepository/moviesRepository.mock";

const createMockMovieService = (initialData: DatabaseSchema) => {
  const mockMoviesRepository = createMockMoviesRepository(initialData);
  return MoviesService(mockMoviesRepository);
};

describe("MoviesService", () => {
  test("adding a movie", () => {
    const initialData: DatabaseSchema = {
      genres: ["Comedy", "Fantasy"],
      movies: [],
    };
    const moviesService = createMockMovieService(initialData);

    const movie: AddMovieRequestDTO = {
      year: 1988,
      runtime: 92,
      title: "Beetlejuice",
      genres: ["Comedy", "Fantasy"],
      director: "Tim Burton",
      actors: "Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page",
      plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
      posterUrl:
        "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg",
    };

    expect(moviesService.addMovie(movie)).resolves.toBeUndefined();
  });

  test("adding remake of a movie should not throw", () => {
    const movie: AddMovieRequestDTO = {
      year: 1988,
      runtime: 92,
      title: "Beetlejuice",
      genres: ["Comedy", "Fantasy"],
      director: "Tim Burton",
      actors: "Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page",
      plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
      posterUrl:
        "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg",
    };

    const initialData: DatabaseSchema = {
      genres: ["Comedy", "Fantasy"],
      movies: [{ ...movie, id: 1 }],
    };
    const moviesService = createMockMovieService(initialData);

    const movieRemake = { ...movie, year: 2002 };

    expect(moviesService.addMovie(movieRemake)).resolves.toBeUndefined();
  });

  test("adding movie with invalid genre should throw", () => {
    const initialData: DatabaseSchema = { genres: ["action", "horror"], movies: [] };
    const moviesService = createMockMovieService(initialData);

    const movie: AddMovieRequestDTO = {
      year: 1988,
      runtime: 92,
      title: "Beetlejuice",
      genres: ["Comedy", "Fantasy"],
      director: "Tim Burton",
      actors: "Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page",
      plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
      posterUrl:
        "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg",
    };

    expect(moviesService.addMovie(movie)).rejects.toThrowError(InvalidGenreError);
  });

  test("adding movie duplicate should throw", () => {
    const movie: AddMovieRequestDTO = {
      year: 1988,
      runtime: 92,
      title: "Beetlejuice",
      genres: ["Comedy", "Fantasy"],
      director: "Tim Burton",
      actors: "Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page",
      plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
      posterUrl:
        "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg",
    };

    const initialData: DatabaseSchema = {
      genres: ["Comedy", "Fantasy"],
      movies: [{ ...movie, id: 1 }],
    };
    const moviesService = createMockMovieService(initialData);

    expect(moviesService.addMovie(movie)).rejects.toThrowError(DuplicateMovieError);
  });

  test("get random movie", () => {
    const initialData: DatabaseSchema = {
      genres: ["Comedy", "Fantasy"],
      movies: [
        {
          id: 1,
          year: 1988,
          runtime: 92,
          title: "Beetlejuice",
          genres: ["Comedy", "Fantasy"],
          director: "Tim Burton",
          actors: "Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page",
          plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
          posterUrl:
            "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg",
        },
        {
          id: 3,
          year: 1994,
          runtime: 142,
          title: "The Shawshank Redemption",
          genres: ["Crime", "Drama"],
          director: "Frank Darabont",
          actors: "Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler",
          plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
          posterUrl:
            "https://images-na.ssl-images-amazon.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX300.jpg",
        },
      ],
    };

    const moviesService = createMockMovieService(initialData);

    const SAMPLE_INDEX = 1;
    const mockSampler: Sampler = (arr) => arr[SAMPLE_INDEX];

    const expected = [initialData.movies[SAMPLE_INDEX]];

    expect(moviesService.getRandomMovie(mockSampler)).resolves.toEqual(expected);
  });

  test("get movies with duration filter", () => {
    const initialData: DatabaseSchema = {
      genres: ["Comedy", "Fantasy"],
      movies: [
        {
          id: 1,
          year: 1988,
          runtime: 50,
          title: "Beetlejuice",
          genres: ["Comedy", "Fantasy"],
          director: "Tim Burton",
          actors: "Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page",
          plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
          posterUrl:
            "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg",
        },
        {
          id: 3,
          year: 1994,
          runtime: 100,
          title: "The Shawshank Redemption",
          genres: ["Crime", "Drama"],
          director: "Frank Darabont",
          actors: "Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler",
          plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
          posterUrl:
            "https://images-na.ssl-images-amazon.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX300.jpg",
        },
      ],
    };

    const moviesService = createMockMovieService(initialData);

    const expected1 = [initialData.movies[0]];
    expect(moviesService.getMoviesWithFilters({ duration: 49 })).resolves.toEqual(expected1);

    const expected2 = [initialData.movies[1]];
    expect(moviesService.getMoviesWithFilters({ duration: 90 })).resolves.toEqual(expected2);
  });

  test("get movies with genres filter", () => {
    const initialData: DatabaseSchema = {
      genres: ["Comedy", "Fantasy"],
      movies: [
        {
          id: 1,
          year: 1988,
          runtime: 50,
          title: "Beetlejuice",
          genres: ["Comedy", "Fantasy"],
          director: "Tim Burton",
          actors: "Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page",
          plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
          posterUrl:
            "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg",
        },
        {
          id: 3,
          year: 1994,
          runtime: 100,
          title: "The Shawshank Redemption",
          genres: ["Crime", "Drama"],
          director: "Frank Darabont",
          actors: "Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler",
          plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
          posterUrl:
            "https://images-na.ssl-images-amazon.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX300.jpg",
        },
      ],
    };

    const moviesService = createMockMovieService(initialData);

    const expected1 = [initialData.movies[0]];
    expect(moviesService.getMoviesWithFilters({ genres: ["Comedy"] })).resolves.toEqual(expected1);

    const expected2 = [initialData.movies[1]];
    expect(moviesService.getMoviesWithFilters({ genres: ["Drama"] })).resolves.toEqual(expected2);
  });

  test("get movies with genres and duration filters", () => {
    const initialData: DatabaseSchema = {
      genres: ["Comedy", "Fantasy"],
      movies: [
        {
          id: 1,
          year: 1988,
          runtime: 50,
          title: "Beetlejuice",
          genres: ["Comedy", "Fantasy"],
          director: "Tim Burton",
          actors: "Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page",
          plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
          posterUrl:
            "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg",
        },
        {
          id: 3,
          year: 1994,
          runtime: 100,
          title: "The Shawshank Redemption",
          genres: ["Crime", "Drama"],
          director: "Frank Darabont",
          actors: "Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler",
          plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
          posterUrl:
            "https://images-na.ssl-images-amazon.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX300.jpg",
        },
      ],
    };

    const moviesService = createMockMovieService(initialData);

    const expected1 = [initialData.movies[0]];
    expect(
      moviesService.getMoviesWithFilters({ genres: ["Comedy"], duration: 60 }),
    ).resolves.toEqual(expected1);

    const expected2 = [initialData.movies[1]];
    expect(
      moviesService.getMoviesWithFilters({ genres: ["Drama"], duration: 90 }),
    ).resolves.toEqual(expected2);

    const expected3 = [] as Movie[];
    expect(
      moviesService.getMoviesWithFilters({ genres: ["Comedy"], duration: 90 }),
    ).resolves.toEqual(expected3);

    const expected4 = [] as Movie[];
    expect(
      moviesService.getMoviesWithFilters({ genres: ["Drama"], duration: 60 }),
    ).resolves.toEqual(expected4);
  });
});
