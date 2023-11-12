import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/common/errors/AppError';

export class EmailAlreadyInUseError extends AppError {
  constructor(email: string) {
    super(`User with email ${email} already exists`, StatusCodes.CONFLICT);
  }
}
