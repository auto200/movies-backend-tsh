import {
  GetMovieFiltersDTO,
  getFiltersMetadataResponseDTOSchema,
  getMoviesDTOSchema,
} from "@movies/shared/communication";

import { HttpService } from "@/common/services/HttpService";

export function MoviesAPI(http: HttpService) {
  const baseUrl = "http://localhost:3001/v1/movies";

  return {
    getMovies: ({ genres, duration }: GetMovieFiltersDTO) =>
      http.get(baseUrl, {
        responseSchema: getMoviesDTOSchema,
        query: { ...(genres && { genres }), ...(duration && { duration }) },
      }),
    getFiltersMetadata: () =>
      http.get(`${baseUrl}/filters-metadata`, {
        responseSchema: getFiltersMetadataResponseDTOSchema,
      }),
  };
}

export const moviesAPI = MoviesAPI(HttpService());
