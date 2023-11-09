import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/common/errors/AppError';

export class UserNotFoundError extends AppError {
  constructor(userId: string) {
    super(`User ${userId} not found`, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
