import { useQuery } from '@tanstack/react-query';

import { addMovieAPI } from '../AddMovieAPIService';
import { queryKeys } from '../queryKeys';

export function useGenres() {
  return useQuery({
    queryFn: addMovieAPI.getGenres,
    queryKey: queryKeys.genres,
  });
}
