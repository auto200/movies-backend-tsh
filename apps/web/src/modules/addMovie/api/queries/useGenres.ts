import { useQuery } from '@tanstack/react-query';

import { addMovieAPI } from '../AddMovieAPIService';

export function useGenres() {
  return useQuery({
    queryFn: addMovieAPI.getGenres,
    queryKey: ['genres'],
  });
}
