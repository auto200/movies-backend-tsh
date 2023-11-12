import { CookieOptions, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import isEqual from 'lodash/isEqual';
import ms from 'ms';

import {
  LoginResponseDTO,
  GetRefreshTokenResponseDTO,
  loginRequestDTOSchema,
  signupRequestDTOSchema,
} from '@movies/shared/communication';

import { type RootService } from '@/common/infrastructure/rootService';
import { validator } from '@/common/payloadValidation';
import { jwtConfig } from '@/config/jwtConfig';

import { REFRESH_TOKEN_COOKIE_NAME } from './consts';
import { JwtPayload, jwtPayloadSchema } from './schema';
import { tokenizer } from './services/tokenizer';

const validators = {
  login: validator({ body: loginRequestDTOSchema }),
  signup: validator({ body: signupRequestDTOSchema }),
};

export function createAuthRouter({ authService }: RootService): Router {
  const router = Router();

  const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    maxAge: ms(jwtConfig.JWT_REFRESH_TOKEN_TTL),
    secure: true,
    // to be investigated if needed when integrating with frontend
    // sameSite:"none"
  };

  const getTokenPair = (user: JwtPayload) => {
    const newAccessToken = tokenizer.signJwt(user, jwtConfig.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: jwtConfig.JWT_ACCESS_TOKEN_TTL,
    });
    const newRefreshToken = tokenizer.signJwt(user, jwtConfig.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: jwtConfig.JWT_REFRESH_TOKEN_TTL,
    });

    return { newAccessToken, newRefreshToken };
  };

  router.post('/signup', validators.signup, (req, res, next) => {
    authService
      .signup(req.body)
      .then((user) => {
        res.status(StatusCodes.CREATED).json(user);
      })
      .catch(next);
  });

  // express v4 quirk
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/login', validators.login, async (req, res, next) => {
    try {
      // To be investigated
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const oldRefreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] as string | undefined;

      const user = await authService.validatePassword(req.body.email, req.body.password);

      const { newAccessToken, newRefreshToken } = getTokenPair(user);

      if (oldRefreshToken) {
        res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, refreshTokenCookieOptions);
        await authService.removeRefreshToken(user.id, oldRefreshToken);
      }
      await authService.addRefreshToken(user.id, newRefreshToken);

      res.cookie(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, refreshTokenCookieOptions);

      const response: LoginResponseDTO = {
        accessToken: newAccessToken,
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
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] as string | undefined;

      if (!refreshToken) return res.sendStatus(StatusCodes.UNAUTHORIZED);

      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, refreshTokenCookieOptions);

      const tokenPayload = tokenizer.verifyJwt(
        refreshToken,
        jwtConfig.JWT_REFRESH_TOKEN_SECRET,
        jwtPayloadSchema
      );

      const user = await authService.getUserByRefreshToken(refreshToken);

      // this happens when someone tries to use refresh token that has been already
      // invalidated/removed. we wanna logout user
      if (!user) {
        if (!tokenPayload) {
          return res.send(StatusCodes.FORBIDDEN);
        }

        await authService.removeAllRefreshTokens(tokenPayload.id);

        return res.sendStatus(StatusCodes.FORBIDDEN);
      }

      await authService.removeRefreshToken(user.id, refreshToken);

      if (!tokenPayload || !isEqual(user, tokenPayload)) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
      }

      const { newAccessToken, newRefreshToken } = getTokenPair(user);

      await authService.addRefreshToken(user.id, newRefreshToken);

      res.cookie(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, refreshTokenCookieOptions);

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
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] as string | undefined;

      if (!refreshToken) return res.sendStatus(StatusCodes.NO_CONTENT);

      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, refreshTokenCookieOptions);

      const user = await authService.getUserByRefreshToken(refreshToken);

      if (!user) {
        return res.sendStatus(StatusCodes.NO_CONTENT);
      }

      await authService.removeRefreshToken(user.id, refreshToken);

      return res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (err) {
      return next(err);
    }
  });

  return router;
}
