export const MoviesSearchIndex = 'movies';

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

// ordered by importance
export const SearchableAttributes = [
  'title',
  'genres',
  'director',
  'actors',
  'plot',
  'year',
] satisfies Array<keyof Movie_SearchableModel>;

export const FilterableAttributes = ['genres', 'runtime'] satisfies Array<
  keyof Movie_SearchableModel
>;
