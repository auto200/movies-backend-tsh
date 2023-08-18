import { DbConnection } from "@config/database/connectJSONDb";

import { AddMovieRequestDTO, Movie } from "../../models/movie";
import { Sampler, sample } from "@common/utils";

export type MoviesRepository = {
  findByTitle(title: string): Promise<Movie | null>;
  getGenres(): Promise<string[]>;
  getRandomMovie(sampler?: Sampler): Promise<Movie | null>;
  addMovie(movieToAdd: AddMovieRequestDTO): Promise<void>;
};

export const MoviesRepository = (db: DbConnection): MoviesRepository => {
  const findByTitle = async (title: string) => {
    const movie = db.data.movies.find((movie) => movie.title === title);

    return movie ?? null;
  };

  const getRandomMovie = async (sampler: Sampler = sample) => sampler(db.data.movies) ?? null;

  const getGenres = async () => db.data.genres;

  const addMovie = async (movieToAdd: AddMovieRequestDTO) => {
    db.data.movies.push({ ...movieToAdd, id: db.data.movies.length + 1 });
    await db.write();
  };

  return { findByTitle, getRandomMovie, getGenres, addMovie };
};
