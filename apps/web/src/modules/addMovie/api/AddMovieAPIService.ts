import {
  AddMovieRequestDTO,
  addMovieResponseDTOSchema,
  getGenresResponseDTOSchema,
} from '@movies/shared/communication';

import { HttpService } from '@/services/HttpService';

export function AddMovieAPI(http: HttpService) {
  const baseUrl = 'http://localhost:3001/v1/movies';

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
