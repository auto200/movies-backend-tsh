import { z, ZodObject, ZodRawShape } from 'zod';

export function validateEnv<T extends ZodObject<ZodRawShape>>(
  schema: T,
  env: Record<string, string | undefined> = process?.env
): z.infer<T> {
  const result = schema.safeParse(env);

  if (!result.success) {
    throw new Error(`Configuration validation error, ${result.error.message}`);
  }
  return result.data;
}

export function isNotNullable<T>(value: T | null | undefined): value is T {
  return value !== undefined && value !== null;
}
