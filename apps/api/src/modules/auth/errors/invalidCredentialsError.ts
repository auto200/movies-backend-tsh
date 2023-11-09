import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/common/errors/AppError';

export class InvalidCredentialsError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}
