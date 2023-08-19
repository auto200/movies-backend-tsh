import { Movie } from "../../models/movie";

export type MoviesRatingService = {
  getMovieRelevanceByGenres(movie: Movie, relevantGenres: string[]): number;
  sortMoviesByGenresRelevance(movies: Movie[], relevantGenres: string[]): Movie[];
};

export const MoviesRatingService = (): MoviesRatingService => {
  const getMovieRelevanceByGenres = (movie: Movie, relevantGenres: string[]) => {
    let rating = 0;

    for (const genre of movie.genres) {
      if (relevantGenres.includes(genre)) rating++;
    }

    return rating;
  };

  return {
    getMovieRelevanceByGenres,
    sortMoviesByGenresRelevance: (movies: Movie[], relevantGenres: string[]) => {
      return [...movies].sort(
        (a, b) =>
          getMovieRelevanceByGenres(b, relevantGenres) -
          getMovieRelevanceByGenres(a, relevantGenres),
      );
    },
  };
};
