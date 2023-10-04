import {
  GetMovieFiltersDTO,
  getFiltersMetadataResponseDTOSchema,
  getMoviesDTOSchema,
} from '@movies/shared/communication';

import { HttpService } from '@/services/HttpService';
import { stripOptionalValues } from '@/utils';

export function BrowseMoviesAPI(http: HttpService) {
  const baseUrl = 'http://localhost:3001/v1/movies';

  return {
    getFiltersMetadata: () =>
      http.get(`${baseUrl}/filters-metadata`, {
        responseSchema: getFiltersMetadataResponseDTOSchema,
      }),
    getMovies: (payload: GetMovieFiltersDTO) =>
      http.get(baseUrl, {
        query: stripOptionalValues(payload),
        responseSchema: getMoviesDTOSchema,
      }),
  };
}

export const browseMoviesAPI = BrowseMoviesAPI(HttpService());
