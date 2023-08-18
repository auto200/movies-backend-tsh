import { describe, test, expect } from "vitest";

import { DatabaseSchema } from "@config/database/connectJSONDb";

import { AddMovieDTO } from "../../models/movie";
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

    const movie: AddMovieDTO = {
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
    const movie: AddMovieDTO = {
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

    const movie: AddMovieDTO = {
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
    const movie: AddMovieDTO = {
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
});
