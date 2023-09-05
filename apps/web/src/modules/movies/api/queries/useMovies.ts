import { moviesAPI } from "../moviesAPIService";
import { GetMovieFiltersDTO } from "@movies/shared/communication";
import { useDebouncedQuery } from "common/hooks/useDebouncedQuery";
import { useMemo } from "react";

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
