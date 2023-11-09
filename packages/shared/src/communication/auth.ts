import { z } from 'zod';

import { signupUserRequestDTOSchema } from './users';

export const loginRequestDTOSchema = signupUserRequestDTOSchema.pick({
  email: true,
  password: true,
});
export type LoginRequestDTO = z.infer<typeof loginRequestDTOSchema>;

export const loginResponseDTOSchema = z.object({
  accessToken: z.string(),
});
export type LoginResponseDTO = z.infer<typeof loginResponseDTOSchema>;

export const getRefreshTokenRequestDTOSchema = z.never();
export type GetRefreshTokenRequestDTO = z.infer<typeof getRefreshTokenRequestDTOSchema>;

export const getRefreshTokenResponseDTOSchema = z.object({
  accessToken: z.string(),
});
export type GetRefreshTokenResponseDTO = z.infer<typeof getRefreshTokenResponseDTOSchema>;
