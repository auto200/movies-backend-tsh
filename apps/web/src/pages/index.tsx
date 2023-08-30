import React from "react";
import { useQuery } from "@tanstack/react-query";
import { moviesAPI } from "modules/movies";

export default function Page() {
  const { data: movies } = useQuery({
    queryKey: ["movies"],
    queryFn: moviesAPI.getRandomMovie,
  });

  return (
    <div>
      {movies?.map((movie) => (
        <React.Fragment key={movie.id}>
          <h1>
            {movie.title} - {movie.year}
          </h1>
          <img src={movie.posterUrl} />
          <p>
            <b>{movie.director}</b> - {movie.genres.join(", ")}
          </p>
          <p>{movie.plot}</p>
        </React.Fragment>
      ))}
    </div>
  );
}
