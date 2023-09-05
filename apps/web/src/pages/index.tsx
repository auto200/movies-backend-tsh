import React, { useMemo, useState } from "react";

import { useMovies, useGenres } from "@/modules/movies/api/queries";

export default function Page() {
  const [genreFilters, setGenreFilters] = useState<string[]>([]);
  const [durationFilter, setDurationFilter] = useState<number | undefined>();

  const { data: movies } = useMovies(
    useMemo(
      () => ({
        genres: genreFilters,
        duration: durationFilter,
      }),
      [genreFilters, durationFilter]
    )
  );
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
        </React.Fragment>
      ))}
    </div>
  );
}
