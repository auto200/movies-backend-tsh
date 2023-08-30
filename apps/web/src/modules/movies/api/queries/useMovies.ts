import { moviesAPI } from "../moviesAPIService";
import { GetMovieFiltersDTO } from "@movies/shared/communication";
import { useDebouncedQuery } from "common/hooks/useDebouncedQuery";

export function useMovies(filters: GetMovieFiltersDTO) {
  return useDebouncedQuery({
    queryKey: ["movies", filters],
    queryFn: () => moviesAPI.getRandomMovie(filters),
  });
}
