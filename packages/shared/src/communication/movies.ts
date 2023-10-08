import { z } from 'zod';

export const movieSchema = z.object({
  actors: z.string().trim().min(1).optional(),
  director: z.string().trim().min(1).max(255),
  genres: z.array(z.string().trim()).min(1),
  id: z.number().positive(),
  plot: z.string().trim().min(1).optional(),
  posterUrl: z.string().trim().url().toLowerCase().optional(),
  runtime: z.number().positive().max(10000),
  title: z.string().trim().min(1).max(255),
  year: z.number().positive().max(10000),
});
export type MovieDTO = z.infer<typeof movieSchema>;

export const getMoviesDTOSchema = z.array(movieSchema);
export type GetMoviesDTO = z.infer<typeof getMoviesDTOSchema>;

export const getMovieFiltersSchema = z.object({
  duration: z.coerce.number().positive().optional(),
  genres: z.union([z.string(), z.array(z.string())]).optional(),
});
export type GetMovieFiltersDTO = z.infer<typeof getMovieFiltersSchema>;

export const getFiltersMetadataResponseDTOSchema = z.object({
  genres: z.array(z.string()),
  times: z.object({ max: z.number().positive(), min: z.number().positive() }),
});
export type GetFiltersMetadataResponseDTO = z.infer<typeof getFiltersMetadataResponseDTOSchema>;

export const addMovieRequestDTOSchema = movieSchema.pick({
  actors: true,
  director: true,
  genres: true,
  plot: true,
  posterUrl: true,
  runtime: true,
  title: true,
  year: true,
});
export type AddMovieRequestDTO = z.infer<typeof addMovieRequestDTOSchema>;

export const addMovieResponseDTOSchema = z.literal('OK');
export type AddMovieResponseDTO = z.infer<typeof addMovieResponseDTOSchema>;

export const getGenresRequestDTOSchema = z.never();
export type GetGenresRequestDTO = z.infer<typeof getGenresRequestDTOSchema>;

export const getGenresResponseDTOSchema = z.array(z.string());
export type GetGenresResponseDTO = z.infer<typeof getGenresResponseDTOSchema>;
