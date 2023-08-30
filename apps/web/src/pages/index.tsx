import React, { useState } from "react";
import { useMovies } from "modules/movies/api/queries/useMovies";
import { useGenres } from "modules/movies/api/queries/useGenres";

export default function Page() {
  const [activeGenreFilters, setActiveGenreFilters] = useState<string[]>([]);
  const { data: movies } = useMovies({ genres: activeGenreFilters });
  const { data: movieGenres } = useGenres();

  const handleGenderFilterChange = (genre: string) => {
    if (activeGenreFilters.includes(genre)) {
      return setActiveGenreFilters(
        activeGenreFilters.filter((g) => g !== genre)
      );
    }

    setActiveGenreFilters([...activeGenreFilters, genre]);
  };

  return (
    <div>
      Filters: Genres:
      <div style={{ display: "flex", gap: 3 }}>
        {movieGenres?.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenderFilterChange(genre)}
            style={{
              ...(activeGenreFilters.includes(genre) && {
                backgroundColor: "green",
                color: "white",
              }),
            }}
          >
            {genre}
          </button>
        ))}
      </div>
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
