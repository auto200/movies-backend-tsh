import { CookieOptions, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import ms from 'ms';

import {
  LoginResponseDTO,
  GetRefreshTokenResponseDTO,
  loginRequestDTOSchema,
  signupRequestDTOSchema,
  SignupResponseDTO,
  BasicUserInfo,
} from '@movies/shared/communication';

import { type RootService } from '@/common/infrastructure/rootService';
import { validator } from '@/common/payloadValidation';
import { jwtConfig } from '@/config/jwtConfig';

import { REFRESH_TOKEN_COOKIE_NAME } from './consts';
import { tokenizer } from './services/tokenizer';

const validators = {
  login: validator({ body: loginRequestDTOSchema }),
  signup: validator({ body: signupRequestDTOSchema }),
};

export function createAuthRouter({ authMiddleware, authService }: RootService): Router {
  const router = Router();

  const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    maxAge: ms(jwtConfig.JWT_REFRESH_TOKEN_TTL),
    secure: true,
    // to be investigated if needed when integrating with frontend
    // sameSite:"none"
  };

  const getTokenPair = (userInfo: BasicUserInfo) => {
    const newAccessToken = tokenizer.signJwt(userInfo, jwtConfig.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: jwtConfig.JWT_ACCESS_TOKEN_TTL,
    });
    const newRefreshToken = tokenizer.signJwt(userInfo, jwtConfig.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: jwtConfig.JWT_REFRESH_TOKEN_TTL,
    });

    return { newAccessToken, newRefreshToken };
  };

  // express v4 quirk
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/signup', validators.signup, async (req, res, next) => {
    try {
      const user = await authService.signup(req.body);

      const { newAccessToken, newRefreshToken } = getTokenPair(user);
      await authService.addRefreshToken(user.id, newRefreshToken);

      res.cookie(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, refreshTokenCookieOptions);

      const response: SignupResponseDTO = { accessToken: newAccessToken, user };

      res.status(StatusCodes.CREATED).json(response);
    } catch (err) {
      next(err);
    }
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
        user,
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

      const tokenPayload = tokenizer.verifyJwt(refreshToken, jwtConfig.JWT_REFRESH_TOKEN_SECRET);

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

      if (!tokenPayload || !isEqual(user, omit(tokenPayload, ['iat']))) {
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
  router.post('/logout', authMiddleware, async (req, res, next) => {
    try {
      // To be investigated
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] as string | undefined;

      if (!refreshToken) return res.sendStatus(StatusCodes.NO_CONTENT);

      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, refreshTokenCookieOptions);

      const user = req.user;

      await authService.removeRefreshToken(user.id, refreshToken);

      return res.sendStatus(StatusCodes.OK);
    } catch (err) {
      return next(err);
    }
  });

  return router;
}
