import { useMemo } from "react";

import { GetMovieFiltersDTO } from "@movies/shared/communication";

import { useDebouncedQuery } from "@/common/hooks/useDebouncedQuery";

import { moviesAPI } from "../moviesAPIService";

export function useMovies(filters: GetMovieFiltersDTO) {
  return useDebouncedQuery(
    useMemo(
      () => ({
        queryKey: ["movies", filters],
        queryFn: () => moviesAPI.getMovies(filters),
      }),
      [filters]
    )
  );
}
