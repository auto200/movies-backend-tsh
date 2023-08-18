import { AddMovieDTO, Movie } from "../models/movie";
import { DbConnection } from "@config/database/connectJSONDb";

export type MoviesRepository = {
  findByTitle(title: string): Promise<Movie | null>;
  getGenres(): Promise<string[]>;
  getMovie(): Promise<Movie | null>;
  addMovie(movieToAdd: AddMovieDTO): Promise<void>;
};

export const MoviesRepository = (db: DbConnection): MoviesRepository => {
  const findByTitle = async (title: string) => {
    const movie = db.data.movies.find((movie) => movie.title === title);

    return movie ?? null;
  };

  const getMovie = async () => db.data.movies[0] ?? null;

  const getGenres = async () => db.data.genres;

  const addMovie = async (movieToAdd: AddMovieDTO) => {
    db.data.movies.push({ ...movieToAdd, id: db.data.movies.length + 1 });
    await db.write();
  };

  return { findByTitle, getMovie, getGenres, addMovie };
};
