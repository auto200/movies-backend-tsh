import { CookieOptions, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import isEqual from 'lodash/isEqual';
import ms from 'ms';

import {
  LoginResponseDTO,
  GetRefreshTokenResponseDTO,
  loginRequestDTOSchema,
} from '@movies/shared/communication';

import { type RootService } from '@/common/infrastructure/rootService';
import { validator } from '@/common/payloadValidation';
import { jwtConfig } from '@/config/jwtConfig';

import { REFRESH_TOKEN_COOKIE_NAME } from './consts';
import { jwtPayloadSchema } from './schema';
import { tokenizer } from './services/tokenizer';

const validators = {
  login: validator({ body: loginRequestDTOSchema }),
};

export function createAuthRouter({ authService, usersService }: RootService): Router {
  const router = Router();

  const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    maxAge: ms(jwtConfig.JWT_REFRESH_TOKEN_TTL),
    secure: true,
  };

  // express v4 quirk
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/login', validators.login, async (req, res, next) => {
    try {
      const user = await authService.validatePassword(req.body.email, req.body.password);

      const accessToken = tokenizer.signJwt(user, jwtConfig.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: jwtConfig.JWT_ACCESS_TOKEN_TTL,
      });
      const refreshToken = tokenizer.signJwt(user, jwtConfig.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: jwtConfig.JWT_REFRESH_TOKEN_TTL,
      });

      await usersService.addRefreshToken(user.id, refreshToken);

      res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshTokenCookieOptions);

      const response: LoginResponseDTO = {
        accessToken,
      };

      res.json(response);
    } catch (err) {
      next(err);
    }
  });
  // express v4 quirk
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('/refresh-token', async (req, res, next) => {
    try {
      // To be investigated
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] as string;

      if (!refreshToken) return res.sendStatus(StatusCodes.UNAUTHORIZED);

      const userFromDb = await authService.getUserByRefreshToken(refreshToken);
      if (!userFromDb) return res.sendStatus(StatusCodes.UNAUTHORIZED);

      const decodedToken = tokenizer.verifyJwt(
        refreshToken,
        jwtConfig.JWT_REFRESH_TOKEN_SECRET,
        jwtPayloadSchema
      );

      // TODO: figure out decoded token schema, this check is hacky, we need a better solution
      if (!('payload' in decodedToken) || !isEqual(userFromDb, decodedToken.payload)) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
      }

      const newAccessToken = tokenizer.signJwt(userFromDb, jwtConfig.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: jwtConfig.JWT_ACCESS_TOKEN_TTL,
      });

      const response: GetRefreshTokenResponseDTO = {
        accessToken: newAccessToken,
      };

      return res.send(response);
    } catch (err) {
      return next(err);
    }
  });

  // express v4 quirk
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/logout', async (req, res, next) => {
    try {
      // To be investigated
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] as string;

      if (!refreshToken) return res.sendStatus(StatusCodes.NO_CONTENT);

      const userFromDb = await authService.getUserByRefreshToken(refreshToken);
      if (!userFromDb) {
        res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, refreshTokenCookieOptions);

        return res.sendStatus(StatusCodes.NO_CONTENT);
      }

      await authService.removeRefreshToken(userFromDb.id, refreshToken);
      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, refreshTokenCookieOptions);

      return res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (err) {
      return next(err);
    }
  });

  return router;
}
