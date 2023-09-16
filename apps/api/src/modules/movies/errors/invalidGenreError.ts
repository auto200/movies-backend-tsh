import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/common/errors/AppError';

export class InvalidGenreError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
