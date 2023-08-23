import { DbConnection } from "@config/database/connectJSONDb";

import { AddMovieRequestDTO, Movie } from "../../models/movie";

export type MoviesRepository = {
  findByTitle(title: string): Promise<Movie | null>;
  getGenres(): Promise<string[]>;
  addMovie(movieToAdd: AddMovieRequestDTO): Promise<void>;
  getAllMovies(): Promise<Movie[]>;
};

export const MoviesRepository = (db: DbConnection): MoviesRepository => {
  return {
    getAllMovies: async () => db.data.movies,

    findByTitle: async (title) => {
      const movie = db.data.movies.find((movie) => movie.title === title);

      return movie ?? null;
    },

    getGenres: async () => db.data.genres,

    addMovie: async (movieToAdd) => {
      db.data.movies.push({ ...movieToAdd, id: db.data.movies.length + 1 });
      await db.write();
    },
  };
};
