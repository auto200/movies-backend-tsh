import { assert, Equals } from 'tsafe';
import { z } from 'zod';

import { type AddMovieRequestDTO } from '@movies/shared/communication';

import { isEmpty } from '@/utils';

function emptyFieldToUndefined(value: unknown) {
  if (typeof value !== 'string') return undefined;
  if (isEmpty(value)) return undefined;
  return value;
}

export const addMovieFormSchema = z.object({
  actors: z.preprocess(emptyFieldToUndefined, z.string().nonempty().optional()),
  director: z.string().nonempty().max(255),
  genres: z.array(z.string()),
  plot: z.preprocess(emptyFieldToUndefined, z.string().nonempty().optional()),
  posterUrl: z.preprocess(emptyFieldToUndefined, z.string().url().optional()),
  runtime: z.number().positive(),
  title: z.string().nonempty().max(255),
  year: z.number().positive(),
});

export type AddMovieFormData = z.infer<typeof addMovieFormSchema>;

assert<Equals<AddMovieFormData, AddMovieRequestDTO>>;
