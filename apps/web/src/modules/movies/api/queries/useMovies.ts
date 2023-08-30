import { useQuery } from "@tanstack/react-query";
import { moviesAPI } from "../moviesAPIService";
import { GetMovieFiltersDTO } from "@movies/shared/communication";

export function useMovies(filters: GetMovieFiltersDTO) {
  return useQuery({
    queryKey: ["movies", filters],
    queryFn: () => moviesAPI.getRandomMovie(filters),
  });
}
