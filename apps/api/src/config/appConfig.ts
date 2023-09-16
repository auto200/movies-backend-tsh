import { z } from 'zod';
import { validateEnv } from './validateEnv';

const appConfigSchema = z.object({ PORT: z.coerce.number().positive() });

export const appConfig = validateEnv(appConfigSchema);
