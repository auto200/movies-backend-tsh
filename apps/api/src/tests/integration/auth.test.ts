/* eslint-disable import/no-named-as-default-member */

import cookie from 'cookie';
import { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import ms from 'ms';
import supertest from 'supertest';
import { describe, expect, test, vi } from 'vitest';

import {
  LoginRequestDTO,
  SignupRequestDTO,
  getUserResponseSchema,
  loginResponseDTOSchema,
} from '@movies/shared/communication';

import { jwtConfig } from '@/config/jwtConfig';
import { COOKIE_NAME } from '@/modules/auth/consts';
import { createTestingApp, signUpSuccessfully, testUser } from '@/tests/utils';

describe('auth module', () => {
  const loginSuccessfully = async (app: Express, user: LoginRequestDTO = testUser) => {
    const res = await supertest(app).post('/v1/auth/login').send(user).expect(StatusCodes.OK);

    const refreshTokenCookie = res.get('Set-Cookie')[0]!;
    const accessTokenCookie = res.get('Set-Cookie')[1]!;

    expect(COOKIE_NAME.refreshToken in cookie.parse(refreshTokenCookie)).toBeTruthy();
    expect(COOKIE_NAME.accessToken in cookie.parse(accessTokenCookie)).toBeTruthy();

    expect(() => loginResponseDTOSchema.parse(res.body)).not.toThrow();

    return {
      ...loginResponseDTOSchema.parse(res.body),
      accessTokenCookie,
      refreshTokenCookie,
      res,
    };
  };

  describe('POST /v1/auth/signup - signup user', () => {
    const testUser: SignupRequestDTO = {
      email: 'test@example.com',
      password: 'test-password',
      username: 'test',
    };

    test('fails when providing invalid data', async () => {
      const { app } = createTestingApp();

      await supertest(app)
        .post('/v1/auth/signup')
        .send({ invalidPayload: 'test' })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST);
    });

    test('creates user providing correct data and sets access and refresh token cookies', async () => {
      const { app } = createTestingApp();

      await signUpSuccessfully(app);
    });

    test('does not create user with duplicated email or username', async () => {
      const { app } = createTestingApp();

      await signUpSuccessfully(app, testUser);

      // duplicated user
      await supertest(app).post('/v1/auth/signup').send(testUser).expect(StatusCodes.CONFLICT);
      // username taken
      await supertest(app)
        .post('/v1/auth/signup')
        .send({ ...testUser, email: 'unique@example.com' })
        .expect(StatusCodes.CONFLICT);
      // email taken
      await supertest(app)
        .post('/v1/auth/signup')
        .send({ ...testUser, username: 'unique' })
        .expect(StatusCodes.CONFLICT);
    });
  });

  describe('POST /v1/auth/login - login user', () => {
    test('fails to login if providing invalid credentials', async () => {
      const { app } = createTestingApp();

      await signUpSuccessfully(app);

      const loginRequestPayload: LoginRequestDTO = {
        email: testUser.email,
        password: 'xxxxxxxxx',
      };

      await supertest(app)
        .post('/v1/auth/login')
        .send(loginRequestPayload)
        .expect(StatusCodes.UNAUTHORIZED);
    });

    test('logs in and sets cookie if provided valid credentials', async () => {
      const { app } = createTestingApp();

      await signUpSuccessfully(app);

      await loginSuccessfully(app);
    });

    test('multi device support', async () => {
      // TODO: check what the hell is this and test properly. I'm guessing that we wanna check if we
      // can be logged in and make requests from the same account on two separate devices
      const { app } = createTestingApp();

      const { refreshTokenCookie } = await signUpSuccessfully(app);

      const { refreshTokenCookie: refreshTokenCookie2 } = await loginSuccessfully(app);

      await supertest(app).post('/v1/auth/logout').set('Cookie', refreshTokenCookie);
      await supertest(app).post('/v1/auth/logout').set('Cookie', refreshTokenCookie2);
    });
  });

  describe('POST /v1/auth/refresh-token', () => {
    test('fails when no cookie provided', async () => {
      const { app } = createTestingApp();

      await supertest(app).get('/v1/auth/refresh-token').expect(StatusCodes.UNAUTHORIZED);
    });

    test('fails when invalid cookie provided', async () => {
      const { app } = createTestingApp();

      await supertest(app)
        .get('/v1/auth/refresh-token')
        .set('Cookie', [
          `${COOKIE_NAME.accessToken}=gibberish`,
          `${COOKIE_NAME.refreshToken}=gibberish`,
        ])
        .expect(StatusCodes.UNAUTHORIZED);
    });

    test('returns new access token', async () => {
      const { app } = createTestingApp();

      const { refreshTokenCookie } = await signUpSuccessfully(app);

      await supertest(app)
        .get('/v1/auth/refresh-token')
        .set('Cookie', [refreshTokenCookie])
        .expect(StatusCodes.OK);
    });

    test('does not allow old token reuse', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const { app } = createTestingApp();
      const { refreshTokenCookie } = await signUpSuccessfully(app);

      // we need to advance time, if we didn't the payload of a token would not change and newly
      // generated token would be exactly the same as the invalidated one, thus "invalidated" token
      // would still be valid in this test case
      vi.setSystemTime(Date.now() + 10000);

      await supertest(app)
        .get('/v1/auth/refresh-token')
        .set('Cookie', [refreshTokenCookie])
        .expect(StatusCodes.OK);

      const invalidatedRefreshTokenCookie = refreshTokenCookie;

      await supertest(app)
        .get('/v1/auth/refresh-token')
        .set('Cookie', [invalidatedRefreshTokenCookie])
        .expect(StatusCodes.FORBIDDEN);

      vi.useRealTimers();
    });
  });

  describe('POST /v1/auth/logout', () => {
    test('does not allow to proceed when no cookie provided', async () => {
      const { app } = createTestingApp();

      await supertest(app).post('/v1/auth/logout').expect(StatusCodes.UNAUTHORIZED);
    });

    test('does not allow to proceed if invalid cookie provided', async () => {
      const { app } = createTestingApp();

      await supertest(app)
        .post('/v1/auth/logout')
        .set('Cookie', [
          `${COOKIE_NAME.refreshToken}=gibberish`,
          `${COOKIE_NAME.accessToken}=gibberish`,
        ])
        .expect(StatusCodes.UNAUTHORIZED);
    });

    test('clears valid cookie', async () => {
      const { app } = createTestingApp();

      const { accessTokenCookie, refreshTokenCookie } = await signUpSuccessfully(app);

      const logoutRes = await supertest(app)
        .post('/v1/auth/logout')
        .set('Cookie', [refreshTokenCookie, accessTokenCookie])
        .expect(StatusCodes.OK);

      const refreshCookieAfterLogout = cookie.parse(logoutRes.get('Set-Cookie')[0]!);
      const accessCookieAfterLogout = cookie.parse(logoutRes.get('Set-Cookie')[1]!);

      expect(refreshCookieAfterLogout[COOKIE_NAME.refreshToken]).toBe('');
      expect(accessCookieAfterLogout[COOKIE_NAME.accessToken]).toBe('');
    });
  });

  describe('POST /v1/auth/me', () => {
    test('errors if no tokens provided', async () => {
      const { app } = createTestingApp();

      await supertest(app).get('/v1/auth/me').expect(StatusCodes.UNAUTHORIZED);
    });

    test('returns user data', async () => {
      const { app } = createTestingApp();

      const { accessTokenCookie, refreshTokenCookie } = await signUpSuccessfully(app);

      const res = await supertest(app)
        .get('/v1/auth/me')
        .set('Cookie', [refreshTokenCookie, accessTokenCookie])
        .expect(StatusCodes.OK);

      expect(() => getUserResponseSchema.parse(res.body)).not.toThrow();
    });

    test('returns error if access token expired', async () => {
      // https://github.com/nock/nock/issues/2200#issuecomment-1699838032
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const { app } = createTestingApp();

      const { accessTokenCookie, refreshTokenCookie } = await signUpSuccessfully(app);

      vi.setSystemTime(Date.now() + ms(jwtConfig.JWT_ACCESS_TOKEN_TTL));

      await supertest(app)
        .get('/v1/auth/me')
        .set('Cookie', [refreshTokenCookie, accessTokenCookie])
        .expect(StatusCodes.UNAUTHORIZED);

      vi.useRealTimers();
    });
  });
});
