import { StatusCodes } from "http-status-codes";

import { AppError } from "@/common/errors/AppError";

export class DuplicateMovieError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
