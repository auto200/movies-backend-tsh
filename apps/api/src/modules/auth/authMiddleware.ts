import { RequestHandler } from 'express';

import { jwtConfig } from '@/config/jwtConfig';

import { COOKIE_NAME } from './consts';
import { InvalidCredentialsError } from './errors/invalidCredentialsError';
import { tokenizer } from './services/tokenizer';

export const authMiddleware: RequestHandler = (req, _res, next) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const accessToken = req.cookies[COOKIE_NAME.accessToken] as string | undefined;

  if (!accessToken) {
    return next(new InvalidCredentialsError('Missing bearer token'));
  }

  const tokenPayload = tokenizer.verifyJwt(accessToken, jwtConfig.JWT_ACCESS_TOKEN_SECRET);

  if (!tokenPayload) {
    return next(new InvalidCredentialsError('Token is invalid'));
  }

  req.user = tokenPayload;

  return next();
};
