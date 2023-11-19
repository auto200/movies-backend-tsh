import { useQuery } from '@tanstack/react-query';

import { browseMoviesAPI } from '../BrowseMoviesAPIService';
import { queryKeys } from '../queryKeys';

export function useFiltersMetadata() {
  return useQuery({
    queryFn: browseMoviesAPI.getFiltersMetadata,
    queryKey: queryKeys.filtersMetadata,
  });
}
