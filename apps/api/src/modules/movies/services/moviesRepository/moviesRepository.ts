import { DbConnection } from '@/config/database/connectJSONDb';

import { AddMovieRequestDTO, MovieDTO } from '../../models';

export type MoviesRepository = {
  addMovie(movieToAdd: AddMovieRequestDTO): Promise<MovieDTO>;
  findByTitle(title: string): Promise<MovieDTO | null>;
  getAllMovies(): Promise<MovieDTO[]>;
  getGenres(): Promise<string[]>;
};

export const MoviesRepository = (db: DbConnection): MoviesRepository => {
  return {
    addMovie: async (movieToAdd) => {
      const movie = { ...movieToAdd, id: db.data.movies.length + 1 };
      db.data.movies.push(movie);
      await db.write();

      return movie;
    },

    findByTitle: async (title) => {
      const movie = db.data.movies.find((movie) => movie.title === title);

      return Promise.resolve(movie ?? null);
    },

    getAllMovies: async () => Promise.resolve(db.data.movies),

    getGenres: async () => Promise.resolve(db.data.genres),
  };
};
