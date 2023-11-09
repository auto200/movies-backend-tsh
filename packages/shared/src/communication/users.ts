import { z } from 'zod';

export const signupUserRequestDTOSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(64),
  username: z.string().min(4).max(24),
});
export type SignupUserRequestDTO = z.infer<typeof signupUserRequestDTOSchema>;

export const signupUserResponseDTOSchema = z.object({
  email: z.string(),
  username: z.string(),
});
export type SignupUserResponseDTO = z.infer<typeof signupUserResponseDTOSchema>;
