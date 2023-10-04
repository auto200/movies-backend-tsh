import { z } from 'zod';

import { validateEnv } from '@movies/shared/utils';

const dbConfigSchema = z.object({
  DB_JSON_FILE_PATH: z.string(),
});

export const dbConfig = validateEnv(dbConfigSchema);
