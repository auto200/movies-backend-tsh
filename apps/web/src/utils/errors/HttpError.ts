import { AppError } from './AppError';

export class HttpError extends AppError {
  constructor(
    public status: number,
    originalError: unknown,
    message: string
  ) {
    super('HttpError', originalError, message);
  }
}
