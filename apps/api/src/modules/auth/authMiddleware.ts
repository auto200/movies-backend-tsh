import { RequestHandler } from 'express';

import { jwtConfig } from '@/config/jwtConfig';

import { InvalidCredentialsError } from './errors/invalidCredentialsError';
import { jwtPayloadSchema } from './schema';
import { tokenizer } from './services/tokenizer';

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const authorization = req.get('authorization') ?? '';

  const accessToken = authorization.split(' ')[1];

  if (!accessToken) {
    return next(new InvalidCredentialsError('Missing bearer token'));
  }

  const decoded = tokenizer.verifyJwt(
    accessToken,
    jwtConfig.JWT_ACCESS_TOKEN_SECRET,
    jwtPayloadSchema
  );

  if (decoded.valid) {
    req.user = decoded.payload;

    return next();
  }

  next(new InvalidCredentialsError('Token is invalid'));
};
