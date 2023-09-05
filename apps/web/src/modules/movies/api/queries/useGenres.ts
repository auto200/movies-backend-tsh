import { useQuery } from "@tanstack/react-query";

import { moviesAPI } from "../moviesAPIService";

export function useGenres() {
  return useQuery({
    queryKey: ["movie-genres"],
    queryFn: moviesAPI.getGenres,
  });
}
