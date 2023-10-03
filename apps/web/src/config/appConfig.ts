import { z } from 'zod';

import { validateEnv } from '@movies/shared/utils';

const appConfigSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_SE_URL: z.string().url(),
});

const envs = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SE_URL: process.env.NEXT_PUBLIC_SE_URL,
};

export const appConfig = validateEnv(appConfigSchema, envs);
