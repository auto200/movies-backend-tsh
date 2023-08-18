import { AppError } from "@common/errors/AppError";
import { StatusCodes } from "http-status-codes";

export class InvalidGenreError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
