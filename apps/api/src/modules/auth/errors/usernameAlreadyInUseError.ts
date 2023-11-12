import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/common/errors/AppError';

export class UsernameAlreadyInUseError extends AppError {
  constructor(username: string) {
    super(`Username ${username} already taken`, StatusCodes.CONFLICT);
  }
}
