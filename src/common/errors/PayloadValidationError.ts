import { ZodError } from "zod";
import { AppError, AppErrorDTO } from "./AppError";

export type PayloadError = { type: "Params" | "Query" | "Body"; errors: ZodError };

export class PayloadValidationError extends AppError {
  constructor(
    public message: string,
    private errors: PayloadError[],
  ) {
    super(message, 400);
  }

  public toJSON(): AppErrorDTO & { errors: PayloadError[] } {
    return {
      ...super.toJSON.call(this),
      errors: this.errors,
    };
  }
}
