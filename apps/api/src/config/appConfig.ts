import { z } from 'zod';

import { validateEnv } from '@movies/shared/utils';

const appConfigSchema = z.object({ PORT: z.coerce.number().positive() });

export const appConfig = validateEnv(appConfigSchema);
