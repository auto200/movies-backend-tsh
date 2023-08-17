export type AppErrorDTO = {
  status: "error";
  statusCode: number;
  message: string;
};

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
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
