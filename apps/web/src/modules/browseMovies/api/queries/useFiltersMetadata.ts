import { useQuery } from '@tanstack/react-query';

import { browseMoviesAPI } from '../browseMoviesAPIService';

export function useFiltersMetadata() {
  return useQuery({
    queryFn: browseMoviesAPI.getFiltersMetadata,
    queryKey: ['filters-metadata'],
  });
}
