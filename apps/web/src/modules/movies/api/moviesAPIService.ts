import {
  GetMovieFiltersDTO,
  getGenresResponseDTOSchema,
  getMoviesDTOSchema,
} from "@movies/shared/communication";
import { HttpService } from "common/services/HttpService";

export function MoviesAPI(http: HttpService) {
  const baseUrl = "http://localhost:3001/v1/movies";

  return {
    getRandomMovie: ({ genres, duration }: GetMovieFiltersDTO) =>
      http.get(baseUrl, {
        responseSchema: getMoviesDTOSchema,
        query: { ...(genres && { genres }), ...(duration && { duration }) },
      }),
    getGenres: () =>
      http.get(`${baseUrl}/genres`, {
        responseSchema: getGenresResponseDTOSchema,
      }),
  };
}

export const moviesAPI = MoviesAPI(HttpService());
