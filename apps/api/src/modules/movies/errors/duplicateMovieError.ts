import { AppError } from "@common/errors/AppError";
import { StatusCodes } from "http-status-codes";

export class DuplicateMovieError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
