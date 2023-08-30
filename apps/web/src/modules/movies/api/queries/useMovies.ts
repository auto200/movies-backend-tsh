import { useQuery } from "@tanstack/react-query";
import { moviesAPI } from "../moviesAPIService";
import { GetMovieFiltersDTO } from "@movies/shared/communication";

export function useMovies({ genres }: GetMovieFiltersDTO) {
  return useQuery({
    queryKey: ["movies", genres],
    queryFn: () => moviesAPI.getRandomMovie({ genres }),
  });
}
