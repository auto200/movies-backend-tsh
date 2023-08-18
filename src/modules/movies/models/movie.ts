import { z } from "zod";

export const MovieSchema = z.object({
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

export type Movie = z.infer<typeof MovieSchema>;

export const AddMovieRequestDTOSchema = MovieSchema.pick({
  genres: true,
  title: true,
  year: true,
  runtime: true,
  director: true,
  actors: true,
  plot: true,
  posterUrl: true,
});

export type AddMovieRequestDTO = z.infer<typeof AddMovieRequestDTOSchema>;
