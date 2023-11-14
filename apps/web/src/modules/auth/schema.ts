import { z } from 'zod';

import { loginRequestDTOSchema } from '@movies/shared/communication';

export const LoginFormSchema = loginRequestDTOSchema;
export type LoginFormData = z.infer<typeof LoginFormSchema>;
