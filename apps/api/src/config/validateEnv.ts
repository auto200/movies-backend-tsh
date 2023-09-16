import { z, ZodObject, ZodRawShape } from 'zod';

export function validateEnv<T extends ZodObject<ZodRawShape>>(schema: T): z.infer<T> {
  const result = schema.safeParse(process.env);

  if (!result.success) {
    throw new Error(`Configuration validation error, ${result.error.message}`);
  }
  return result.data;
}
