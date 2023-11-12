import { z } from 'zod';

// signup
export const signupRequestDTOSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(64),
  username: z.string().min(4).max(24),
});
export type SignupRequestDTO = z.infer<typeof signupRequestDTOSchema>;

export const signupResponseDTOSchema = z.object({
  email: z.string(),
  username: z.string(),
});
export type SignupResponseDTO = z.infer<typeof signupResponseDTOSchema>;

// login
export const loginRequestDTOSchema = signupRequestDTOSchema.pick({
  email: true,
  password: true,
});
export type LoginRequestDTO = z.infer<typeof loginRequestDTOSchema>;

export const loginResponseDTOSchema = z.object({
  accessToken: z.string(),
});
export type LoginResponseDTO = z.infer<typeof loginResponseDTOSchema>;

// refresh token
export const getRefreshTokenRequestDTOSchema = z.never();
export type GetRefreshTokenRequestDTO = z.infer<typeof getRefreshTokenRequestDTOSchema>;

export const getRefreshTokenResponseDTOSchema = z.object({
  accessToken: z.string(),
});
export type GetRefreshTokenResponseDTO = z.infer<typeof getRefreshTokenResponseDTOSchema>;
