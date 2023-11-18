import {
  GetMovieFiltersDTO,
  getFiltersMetadataResponseDTOSchema,
  getMoviesDTOSchema,
} from '@movies/shared/communication';
import { HttpService } from '@movies/shared/services';

import { appConfig } from '@/config/appConfig';
import { stripOptionalValues } from '@/utils';

export function BrowseMoviesAPI(http: HttpService) {
  const baseUrl = `${appConfig.NEXT_PUBLIC_API_URL}/v1/movies`;

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
