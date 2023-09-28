export class AppError extends Error {
  constructor(
    public name: string,
    public originalError: unknown,
    public message: string
  ) {
    super(`${message} - ${originalError instanceof Error ? originalError.message : 'unknown'}`);

    if (originalError instanceof Error && originalError.stack) {
      this.stack = originalError.stack;
    }
  }
}
