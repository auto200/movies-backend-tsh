import { MovieDTO } from '../../communication';

export const MoviesRelevance = {
  getMovieRelevanceByGenres: (movie: MovieDTO, relevantGenres: string[]) => {
    let rating = 0;

    for (const genre of movie.genres) {
      if (relevantGenres.includes(genre)) rating++;
    }

    return rating;
  },

  sortMoviesByGenresRelevance: (movies: MovieDTO[], relevantGenres: string[]) => {
    return [...movies].sort(
      (a, b) =>
        MoviesRelevance.getMovieRelevanceByGenres(b, relevantGenres) -
        MoviesRelevance.getMovieRelevanceByGenres(a, relevantGenres)
    );
  },
};
