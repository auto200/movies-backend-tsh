import { z } from "zod";

export const movieSchema = z.object({
  id: z.number().positive(),
  genres: z.array(z.string()),
  title: z.string().nonempty().max(255),
  year: z.number().positive(),
  runtime: z.number().positive(),
  director: z.string().nonempty().max(255),
  actors: z.string().nonempty().optional(),
  plot: z.string().nonempty().optional(),
  posterUrl: z.string().url().optional(),
});

export type Movie = z.infer<typeof movieSchema>;

export const addMovieRequestDTOSchema = movieSchema.pick({
  genres: true,
  title: true,
  year: true,
  runtime: true,
  director: true,
  actors: true,
  plot: true,
  posterUrl: true,
});

export type AddMovieRequestDTO = z.infer<typeof addMovieRequestDTOSchema>;

export const getMovieWithQueryFiltersSchema = z.object({
  duration: z.coerce.number().positive().optional(),
  genres: z.union([z.string(), z.array(z.string())]).optional(),
});

export type GetMovieFilters = z.infer<typeof getMovieWithQueryFiltersSchema>;
