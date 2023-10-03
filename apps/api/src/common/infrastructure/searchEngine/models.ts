export enum SearchEngineIndexName {
  movies = 'movies',
}

export type Movie_SearchableModel = {
  actors?: string;
  director: string;
  genres: [string, ...string[]];
  id: number;
  plot?: string;
  posterUrl?: string;
  runtime: number;
  title: string;
  year: number;
};
