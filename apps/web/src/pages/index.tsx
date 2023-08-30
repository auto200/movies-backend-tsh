import React, { useState } from "react";
import { useMovies } from "modules/movies/api/queries/useMovies";
import { useGenres } from "modules/movies/api/queries/useGenres";

export default function Page() {
  const [genreFilters, setGenreFilters] = useState<string[]>([]);
  const [durationFilter, setDurationFilter] = useState<number | undefined>();

  const { data: movies } = useMovies({
    genres: genreFilters,
    duration: durationFilter,
  });
  const { data: movieGenres } = useGenres();

  const handleGenderFilterChange = (genre: string) => {
    if (genreFilters.includes(genre)) {
      return setGenreFilters(genreFilters.filter((g) => g !== genre));
    }

    setGenreFilters([...genreFilters, genre]);
  };

  const handleDurationFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = Number.parseInt(e.target.value);
    if (Number.isNaN(val)) {
      return setDurationFilter(undefined);
    }

    setDurationFilter(val);
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
              ...(genreFilters.includes(genre) && {
                backgroundColor: "green",
                color: "white",
              }),
            }}
          >
            {genre}
          </button>
        ))}
      </div>
      <div>
        <p>Duration:</p>
        <input
          type="number"
          value={durationFilter ?? ""}
          onChange={handleDurationFilterChange}
          min={0}
        />
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
