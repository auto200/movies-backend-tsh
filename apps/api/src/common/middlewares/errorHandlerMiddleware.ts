import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { appConfig } from '@/config/appConfig';

import { AppError } from '../errors/AppError';

export const errorHandlerMiddleware: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(err.toJSON());
  }
  // eslint-disable-next-line no-console
  console.log('unknown error occurred', err);

  if (appConfig.NODE_ENV === 'production') {
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  // kill dev server
  return next();
};
