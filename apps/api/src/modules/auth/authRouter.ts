import { CookieOptions, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import ms from 'ms';

import {
  LoginResponseDTO,
  loginRequestDTOSchema,
  signupRequestDTOSchema,
  SignupResponseDTO,
  BasicUserInfo,
  GetUserResponseDTO,
} from '@movies/shared/communication';

import { validator } from '@/common/payloadValidation';
import { appConfig } from '@/config/appConfig';
import { jwtConfig } from '@/config/jwtConfig';
import { type RootService } from '@/rootService';

import { COOKIE_NAME } from './consts';
import { tokenizer } from './services/tokenizer';

const validators = {
  login: validator({ body: loginRequestDTOSchema }),
  signup: validator({ body: signupRequestDTOSchema }),
};

export function createAuthRouter({ authMiddleware, authService }: RootService): Router {
  const router = Router();

  const baseTokenCookieOptions: CookieOptions = {
    domain: appConfig.BASE_DOMAIN,
    httpOnly: true,
    path: '/',
    sameSite: appConfig.NODE_ENV === 'production' ? 'strict' : 'lax',
    secure: appConfig.NODE_ENV === 'production',
  };

  const refreshTokenCookieOptions: CookieOptions = {
    ...baseTokenCookieOptions,
    maxAge: ms(jwtConfig.JWT_REFRESH_TOKEN_TTL),
  };

  const accessTokenCookieOptions: CookieOptions = {
    ...baseTokenCookieOptions,
    maxAge: ms(jwtConfig.JWT_ACCESS_TOKEN_SECRET),
  };

  const getTokens = (userInfo: BasicUserInfo) => {
    const accessToken = tokenizer.signJwt(userInfo, jwtConfig.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: jwtConfig.JWT_ACCESS_TOKEN_TTL,
    });
    const refreshToken = tokenizer.signJwt(userInfo, jwtConfig.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: jwtConfig.JWT_REFRESH_TOKEN_TTL,
    });

    return { accessToken, refreshToken };
  };

  const setTokenCookies = (
    res: Response,
    { accessToken, refreshToken }: { accessToken: string; refreshToken: string }
  ) => {
    res.cookie(COOKIE_NAME.refreshToken, refreshToken, refreshTokenCookieOptions);
    res.cookie(COOKIE_NAME.accessToken, accessToken, accessTokenCookieOptions);
  };

  const clearTokenCookies = (res: Response) => {
    res.clearCookie(COOKIE_NAME.refreshToken, refreshTokenCookieOptions);
    res.clearCookie(COOKIE_NAME.accessToken, accessTokenCookieOptions);
  };

  // express v4 quirk
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/signup', validators.signup, async (req, res, next) => {
    try {
      const user = await authService.signup(req.body);

      const tokens = getTokens(user);
      await authService.addRefreshToken(user.id, tokens.refreshToken);

      setTokenCookies(res, tokens);

      const response: SignupResponseDTO = { user };

      res.status(StatusCodes.CREATED).json(response);
    } catch (err) {
      next(err);
    }
  });

  // express v4 quirk
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/login', validators.login, async (req, res, next) => {
    try {
      const user = await authService.validatePassword(req.body.email, req.body.password);

      // To be investigated
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const oldRefreshToken = req.cookies[COOKIE_NAME.refreshToken] as string | undefined;

      if (oldRefreshToken) {
        await authService.removeRefreshToken(user.id, oldRefreshToken);
      }

      clearTokenCookies(res);

      const tokens = getTokens(user);
      await authService.addRefreshToken(user.id, tokens.refreshToken);

      setTokenCookies(res, tokens);

      const response: LoginResponseDTO = {
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
      const refreshToken = req.cookies[COOKIE_NAME.refreshToken] as string | undefined;

      clearTokenCookies(res);

      if (!refreshToken) return res.sendStatus(StatusCodes.UNAUTHORIZED);

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

      const tokens = getTokens(user);

      await authService.addRefreshToken(user.id, tokens.refreshToken);

      setTokenCookies(res, tokens);

      return res.sendStatus(StatusCodes.OK);
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
      const refreshToken = req.cookies[COOKIE_NAME.refreshToken] as string | undefined;

      if (!refreshToken) return res.sendStatus(StatusCodes.NO_CONTENT);

      clearTokenCookies(res);

      const user = req.user;

      await authService.removeRefreshToken(user.id, refreshToken);

      return res.sendStatus(StatusCodes.OK);
    } catch (err) {
      return next(err);
    }
  });

  router.get('/me', authMiddleware, (req, res, next) => {
    try {
      const response: GetUserResponseDTO = req.user;

      res.send(response);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
