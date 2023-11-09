import { z } from 'zod';

export const jwtPayloadSchema = z.object({
  email: z.string(),
  id: z.string(),
  username: z.string(),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
