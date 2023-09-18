import { useQuery } from '@tanstack/react-query';

import { moviesAPI } from '../moviesAPIService';

export function useFiltersMetadata() {
  return useQuery({
    queryFn: moviesAPI.getFiltersMetadata,
    queryKey: ['filters-metadata'],
  });
}
