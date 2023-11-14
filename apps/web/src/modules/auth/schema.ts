import { z } from 'zod';

import { loginRequestDTOSchema, signupRequestDTOSchema } from '@movies/shared/communication';

export const loginFormSchema = loginRequestDTOSchema;
export type LoginFormData = z.infer<typeof loginFormSchema>;

export const signupFormSchema = signupRequestDTOSchema;
export type SignupFormData = z.infer<typeof signupFormSchema>;
