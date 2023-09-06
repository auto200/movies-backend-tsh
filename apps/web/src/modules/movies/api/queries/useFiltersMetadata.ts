import { useQuery } from "@tanstack/react-query";

import { moviesAPI } from "../moviesAPIService";

export function useFiltersMetadata() {
  return useQuery({
    queryKey: ["filters-metadata"],
    queryFn: moviesAPI.getFiltersMetadata,
  });
}
