import { assert, Equals } from 'tsafe';
import { z } from 'zod';

import { type AddMovieRequestDTO } from '@movies/shared/communication';

function emptyStringToUndefined(value: unknown) {
  if (typeof value !== 'string') return undefined;
  if (value === '') return undefined;
  return value;
}

export const addMovieFormSchema = z.object({
  actors: z.preprocess(emptyStringToUndefined, z.string().trim().min(1).optional()),
  director: z.string().trim().min(1).max(255),
  genres: z.array(z.string().trim().min(1)).nonempty(),
  plot: z.preprocess(emptyStringToUndefined, z.string().trim().min(1).optional()),
  posterUrl: z.preprocess(emptyStringToUndefined, z.string().trim().url().toLowerCase().optional()),
  runtime: z.coerce.number().positive(),
  title: z.string().trim().min(1).max(255),
  year: z.coerce.number().positive(),
});

export type AddMovieFormData = z.infer<typeof addMovieFormSchema>;

assert<Equals<AddMovieFormData, AddMovieRequestDTO>>;
