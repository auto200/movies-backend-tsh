import { ZodError } from 'zod';

import { AppError } from './AppError';

export class PayloadParsingError extends AppError {
  constructor(message: string, originalError: ZodError) {
    super('PayloadParsingError', originalError, message);
  }
}
