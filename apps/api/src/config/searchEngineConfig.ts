import { z } from 'zod';

import { validateEnv } from '@movies/shared/utils';

const searchEngineConfigSchema = z.object({
  SE_URL: z.string().url(),
});

export const searchEngineConfig = validateEnv(searchEngineConfigSchema);
