import { useQuery } from '@tanstack/react-query';

import { METADATA_QUERY_KEY } from '../../consts';
import { browseMoviesAPI } from '../BrowseMoviesAPIService';

export function useFiltersMetadata() {
  return useQuery({
    queryFn: browseMoviesAPI.getFiltersMetadata,
    queryKey: METADATA_QUERY_KEY,
  });
}
