import { z } from 'zod';

import { validateEnv } from '@movies/shared/utils';

const appConfigSchema = z.object({
  CLIENT_URL: z.string().url(),
  NODE_ENV: z.union([z.literal('production'), z.literal('development'), z.literal('test')]),
  PORT: z.coerce.number().positive(),
});

export const appConfig = validateEnv(appConfigSchema);
