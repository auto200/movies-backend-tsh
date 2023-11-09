import { z } from 'zod';

import { validateEnv } from '@movies/shared/utils';

const jwtConfigSchema = z.object({
  JWT_ACCESS_TOKEN_SECRET: z.string().min(1),
  JWT_ACCESS_TOKEN_TTL: z.string().min(1),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(1),
  JWT_REFRESH_TOKEN_TTL: z.string().min(1),
});

export const jwtConfig = validateEnv(jwtConfigSchema);
