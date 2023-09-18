import { StatusCodes } from 'http-status-codes';

export type AppErrorDTO = {
  message: string;
  status: 'error';
  statusCode: StatusCodes;
};

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message);
  }

  public toJSON(): AppErrorDTO {
    return {
      message: this.message,
      status: 'error',
      statusCode: this.statusCode,
    };
  }
}
