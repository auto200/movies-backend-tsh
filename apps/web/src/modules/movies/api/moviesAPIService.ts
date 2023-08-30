import { getMoviesDTOSchema } from "@movies/shared/communication";
import { HttpService } from "common/services/HttpService";

export function MoviesAPI(http: HttpService) {
  const baseUrl = "http://localhost:3001/v1/movies";

  return {
    getRandomMovie: () =>
      http.get(baseUrl, { responseSchema: getMoviesDTOSchema }),
  };
}

export const moviesAPI = MoviesAPI(HttpService());
