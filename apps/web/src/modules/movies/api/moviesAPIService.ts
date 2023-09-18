import {
  GetMovieFiltersDTO,
  getFiltersMetadataResponseDTOSchema,
  getMoviesDTOSchema,
} from '@movies/shared/communication';

import { HttpService } from '@/common/services/HttpService';

export function MoviesAPI(http: HttpService) {
  const baseUrl = 'http://localhost:3001/v1/movies';

  return {
    getFiltersMetadata: () =>
      http.get(`${baseUrl}/filters-metadata`, {
        responseSchema: getFiltersMetadataResponseDTOSchema,
      }),
    getMovies: ({ duration, genres }: GetMovieFiltersDTO) =>
      http.get(baseUrl, {
        query: { ...(genres && { genres }), ...(duration && { duration }) },
        responseSchema: getMoviesDTOSchema,
      }),
  };
}

export const moviesAPI = MoviesAPI(HttpService());
