import { describe, expect, test } from "vitest";
import { MoviesRelevanceService } from "./moviesRelevanceService";
import { MovieDTO } from "../../models";

describe("movies relevance service", () => {
  const moviesRelevanceService = MoviesRelevanceService();

  test("movie genre relevance rating", () => {
    const movie: MovieDTO = {
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
    };

    expect(moviesRelevanceService.getMovieRelevanceByGenres(movie, [])).toBe(0);

    expect(moviesRelevanceService.getMovieRelevanceByGenres(movie, ["Crime"])).toBe(1);

    expect(moviesRelevanceService.getMovieRelevanceByGenres(movie, ["Crime", "Drama"])).toBe(2);
  });

  test("sorting by genre rating", () => {
    const movies = [
      {
        genres: ["Comedy", "Drama"],
      },
      {
        genres: ["Crime", "Drama"],
      },
      {
        genres: ["Horror", "Action"],
      },
    ] as MovieDTO[];

    const expected = [
      {
        genres: ["Crime", "Drama"],
      },
      {
        genres: ["Comedy", "Drama"],
      },
      {
        genres: ["Horror", "Action"],
      },
    ];

    expect(moviesRelevanceService.sortMoviesByGenresRelevance(movies, ["Crime", "Drama"])).toEqual(
      expected,
    );
  });
});
