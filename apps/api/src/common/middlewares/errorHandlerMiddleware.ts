import { ErrorRequestHandler } from 'express';

import { AppError } from '../errors/AppError';

export const errorHandlerMiddleware: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  return next();
};
