import {
  AddMovieRequestDTO,
  addMovieResponseDTOSchema,
  getGenresResponseDTOSchema,
} from '@movies/shared/communication';
import { HttpService } from '@movies/shared/services';

import { appConfig } from '@/config/appConfig';

export function AddMovieAPI(http: HttpService) {
  const baseUrl = `${appConfig.NEXT_PUBLIC_API_URL}/v1/movies`;

  return {
    addMovie: (payload: AddMovieRequestDTO) =>
      http.post(baseUrl, {
        body: payload,
        responseSchema: addMovieResponseDTOSchema,
      }),
    getGenres: () =>
      http.get(`${baseUrl}/genres`, {
        responseSchema: getGenresResponseDTOSchema,
      }),
  };
}

export const addMovieAPI = AddMovieAPI(HttpService());
