import { MovieDTO } from '../../models';

export type MoviesRelevanceService = {
  getMovieRelevanceByGenres(movie: MovieDTO, relevantGenres: string[]): number;
  sortMoviesByGenresRelevance(movies: MovieDTO[], relevantGenres: string[]): MovieDTO[];
};

export const MoviesRelevanceService = (): MoviesRelevanceService => {
  const getMovieRelevanceByGenres = (movie: MovieDTO, relevantGenres: string[]) => {
    let rating = 0;

    for (const genre of movie.genres) {
      if (relevantGenres.includes(genre)) rating++;
    }

    return rating;
  };

  return {
    getMovieRelevanceByGenres,
    sortMoviesByGenresRelevance: (movies: MovieDTO[], relevantGenres: string[]) => {
      return [...movies].sort(
        (a, b) =>
          getMovieRelevanceByGenres(b, relevantGenres) -
          getMovieRelevanceByGenres(a, relevantGenres)
      );
    },
  };
};
