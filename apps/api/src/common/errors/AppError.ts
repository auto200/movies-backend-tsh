import { StatusCodes } from "http-status-codes";

export type AppErrorDTO = {
  status: "error";
  statusCode: StatusCodes;
  message: string;
};

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message);
  }

  public toJSON(): AppErrorDTO {
    return {
      status: "error",
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}
