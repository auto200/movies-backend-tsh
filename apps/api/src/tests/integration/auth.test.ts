/* eslint-disable import/no-named-as-default-member */

import cookie from 'cookie';
import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { describe, expect, test } from 'vitest';

import {
  LoginRequestDTO,
  SignupRequestDTO,
  getUserResponseSchema,
  loginResponseDTOSchema,
  signupResponseDTOSchema,
} from '@movies/shared/communication';

import { COOKIE_NAME } from '@/modules/auth/consts';
import { createTestingApp } from '@/tests/utils';

describe('auth module', () => {
  const testUser: SignupRequestDTO = {
    email: 'test@example.com',
    password: 'test-password',
    username: 'user123',
  };

  const signUpSuccessfully = async (
    app: Express.Application,
    user: SignupRequestDTO = testUser
  ) => {
    const res = await supertest(app).post('/v1/auth/signup').send(user).expect(StatusCodes.CREATED);
    const refreshTokenCookie = res.get('Set-Cookie')[0]!;
    const accessTokenCookie = res.get('Set-Cookie')[1]!;

    expect(COOKIE_NAME.refreshToken in cookie.parse(refreshTokenCookie)).toBeTruthy();
    expect(COOKIE_NAME.accessToken in cookie.parse(accessTokenCookie)).toBeTruthy();

    expect(() => signupResponseDTOSchema.strict().parse(res.body)).not.toThrow();

    return {
      ...signupResponseDTOSchema.parse(res.body),
      accessTokenCookie,
      refreshTokenCookie,
      res,
    };
  };

  const loginSuccessfully = async (app: Express.Application, user: LoginRequestDTO = testUser) => {
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
        .expect(StatusCodes.FORBIDDEN);
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
      const { app } = createTestingApp();

      const { refreshTokenCookie } = await signUpSuccessfully(app);

      await supertest(app)
        .get('/v1/auth/refresh-token')
        .set('Cookie', [refreshTokenCookie])
        .expect(StatusCodes.OK);

      const invalidatedRefreshTokenCookie = refreshTokenCookie;

      await supertest(app)
        .get('/v1/auth/refresh-token')
        .set('Cookie', [invalidatedRefreshTokenCookie])
        .expect(StatusCodes.FORBIDDEN);
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
  });
});
