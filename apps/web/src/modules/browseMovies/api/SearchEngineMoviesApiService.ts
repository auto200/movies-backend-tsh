import { MeiliSearch, Index } from 'meilisearch';

import { MovieDTO } from '@movies/shared/communication';
import {
  FilterableAttributes,
  Movie_SearchableModel,
  MoviesSearchIndex,
} from '@movies/shared/searchEngine';
import { isNotNullable } from '@movies/shared/utils';

import { appConfig } from '@/config/appConfig';

import { GetMovieSearchFilters } from '../schema';

type MoviesSearchEngine = {
  getMovies: (filters: GetMovieSearchFilters) => Promise<MovieDTO[]>;
};

const MoviesSearchEngine = (): MoviesSearchEngine => {
  const client = new MeiliSearch({ host: appConfig.NEXT_PUBLIC_SE_URL });
  let cachedIndex: Index<Movie_SearchableModel> | null = null;

  const getIndex = async () => {
    if (cachedIndex) return cachedIndex;
    cachedIndex = await client.getIndex(MoviesSearchIndex);
    return cachedIndex;
  };

  return {
    getMovies: async (filters) => {
      const index = await getIndex();

      const filter = [
        Filter.TO('runtime', filters.duration),
        Filter.IN('genres', filters.genres),
      ].filter(isNotNullable);

      const getSingleRandomResult = filter.length === 0;

      const result = await index.search('', {
        filter,
        // dummy way to get random result, assuming index has at least 100 documents
        // https://github.com/meilisearch/meilisearch/discussions/1105#discussioncomment-139568
        ...(getSingleRandomResult && {
          limit: 1,
          offset: Math.floor(Math.random() * 100),
        }),
      });
      return result.hits;
    },
  };
};

export const moviesSearchEngine = MoviesSearchEngine();

type FilterableAttr = (typeof FilterableAttributes)[number];

type TO = `${FilterableAttr} ${number} TO ${number}`;
type IN = `${FilterableAttr} IN [${string}]`;

const Filter = {
  IN: (attr: FilterableAttr, values: Array<string | number>): IN | null => {
    if (values.length === 0) return null;
    return `${attr} IN [${values.join(',')}]`;
  },
  TO: (
    attr: FilterableAttr,
    duration: GetMovieSearchFilters['duration'],
    variation = 10
  ): TO | null => {
    if (duration === undefined) return null;

    return `${attr} ${duration - variation} TO ${duration + variation}`;
  },
};
