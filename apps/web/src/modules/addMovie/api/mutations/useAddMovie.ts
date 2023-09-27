import { useMutation } from '@tanstack/react-query';

import { addMovieAPI } from '../AddMovieAPIService';

export function useAddMovie() {
  return useMutation(addMovieAPI.addMovie);
}
