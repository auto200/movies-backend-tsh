import { useState } from "react";

import { useMovies, useGenres } from "@/modules/movies/api/queries";
import { Filters } from "@/modules/movies/components";
import { FilterFormData } from "@/modules/movies/types";

export default function Page() {
  const [filters, setFilters] = useState<FilterFormData>({});

  const { data: movies } = useMovies(filters);
  const { data: movieGenres } = useGenres();

  return (
    <div>
      {movieGenres && (
        <Filters movieGenres={movieGenres} onSubmit={setFilters} />
      )}
      {movies?.map((movie) => (
        <div key={movie.id}>
          <h1>
            {movie.title} - {movie.year}
          </h1>
          <object
            data={movie.posterUrl}
            type="image/jpg"
            style={{ width: 250 }}
          >
            <img
              style={{ width: 250 }}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/800px-Question_mark_%28black%29.svg.png"
            />
          </object>
          <p>
            <b>{movie.director}</b> - {movie.genres.join(", ")}
          </p>
          <p>{movie.plot}</p>
        </div>
      ))}
    </div>
  );
}
