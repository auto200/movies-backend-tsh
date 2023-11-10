/* eslint-disable import/no-named-as-default-member */

import cookie from 'cookie';
import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { describe, expect, test } from 'vitest';

import {
  LoginRequestDTO,
  SignupUserRequestDTO,
  loginResponseDTOSchema,
} from '@movies/shared/communication';

import { REFRESH_TOKEN_COOKIE_NAME } from '@/modules/auth/consts';
import { createTestingApp } from '@/tests/utils';

// TODO: create utility functions to DRY out creating user and logging in
describe('auth module', () => {
  const testUser: SignupUserRequestDTO = {
    email: 'test@example.com',
    password: 'test-password',
    username: 'user123',
  };

  const signUpSuccessfully = async (
    app: Express.Application,
    user: SignupUserRequestDTO = testUser
  ) => {
    return await supertest(app).post('/v1/users').send(user).expect(StatusCodes.CREATED);
  };

  const signUpAndLoginSuccessfully = async (
    app: Express.Application,
    { loginUser, signUpUser }: { loginUser: LoginRequestDTO; signUpUser: SignupUserRequestDTO }
  ) => {
    await supertest(app).post('/v1/users').send(signUpUser).expect(StatusCodes.CREATED);

    return await supertest(app).post('/v1/auth/login').send(loginUser).expect(StatusCodes.OK);
  };

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

    test('loggsin and sets cookie if providing valid credentials', async () => {
      const { app } = createTestingApp();

      const loginRequestPayload: LoginRequestDTO = {
        email: testUser.email,
        password: testUser.password,
      };

      const res = await signUpAndLoginSuccessfully(app, {
        loginUser: loginRequestPayload,
        signUpUser: testUser,
      });

      expect(() => loginResponseDTOSchema.parse(res.body)).not.toThrow();

      const authCookie = cookie.parse(res.get('Set-Cookie')[0]!);
      expect(REFRESH_TOKEN_COOKIE_NAME in authCookie).toBeTruthy();
    });

    test('multi device support', async () => {
      const { app } = createTestingApp();

      const loginRequestPayload: LoginRequestDTO = {
        email: testUser.email,
        password: testUser.password,
      };

      const res = await signUpAndLoginSuccessfully(app, {
        loginUser: loginRequestPayload,
        signUpUser: testUser,
      });
      const accessToken = res.get('Set-Cookie');

      const res2 = await supertest(app)
        .post('/v1/auth/login')
        .send(loginRequestPayload)
        .expect(StatusCodes.OK);
      const accessToken2 = res2.get('Set-Cookie');

      await supertest(app).post('/v1/auth/logout').set('Cookie', accessToken);
      await supertest(app).post('/v1/auth/logout').set('Cookie', accessToken2);
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
        .set('Cookie', [`${REFRESH_TOKEN_COOKIE_NAME}=gibberish`])
        .expect(StatusCodes.FORBIDDEN);
    });

    test('returns new access token', async () => {
      const { app } = createTestingApp();

      const loginRequestPayload: LoginRequestDTO = {
        email: testUser.email,
        password: testUser.password,
      };

      const res = await signUpAndLoginSuccessfully(app, {
        loginUser: loginRequestPayload,
        signUpUser: testUser,
      });

      const authCookie = res.get('Set-Cookie')[0]!;

      await supertest(app)
        .get('/v1/auth/refresh-token')
        .set('Cookie', [authCookie])
        .expect(StatusCodes.OK);
    });

    test.only('does not allow old token reuse', async () => {
      const { app } = createTestingApp();

      const loginRequestPayload: LoginRequestDTO = {
        email: testUser.email,
        password: testUser.password,
      };

      const loginRes = await signUpAndLoginSuccessfully(app, {
        loginUser: loginRequestPayload,
        signUpUser: testUser,
      });

      const authCookie = loginRes.get('Set-Cookie')[0]!;

      await supertest(app)
        .get('/v1/auth/refresh-token')
        .set('Cookie', [authCookie])
        .expect(StatusCodes.OK);

      const invalidatedAuthCookie = authCookie;

      await supertest(app)
        .get('/v1/auth/refresh-token')
        .set('Cookie', [invalidatedAuthCookie])
        .expect(StatusCodes.FORBIDDEN);
    });
  });

  describe('POST /v1/auth/logout', () => {
    test('does nothing when no cookie provided', async () => {
      const { app } = createTestingApp();

      await supertest(app).post('/v1/auth/logout').expect(StatusCodes.NO_CONTENT);
    });

    test('clears cookie if invalid cookie provided', async () => {
      const { app } = createTestingApp();

      const res = await supertest(app)
        .post('/v1/auth/logout')
        .set('Cookie', [`${REFRESH_TOKEN_COOKIE_NAME}=gibberish`])
        .expect(StatusCodes.NO_CONTENT);
      const authCookie = cookie.parse(res.get('Set-Cookie')[0]!);

      expect(authCookie[REFRESH_TOKEN_COOKIE_NAME]).toBe('');
    });

    test('clears valid cookie', async () => {
      const { app } = createTestingApp();

      const loginRequestPayload: LoginRequestDTO = {
        email: testUser.email,
        password: testUser.password,
      };

      const loginRes = await signUpAndLoginSuccessfully(app, {
        loginUser: loginRequestPayload,
        signUpUser: testUser,
      });

      const authCookie = loginRes.get('Set-Cookie')[0]!;

      const logoutRes = await supertest(app)
        .post('/v1/auth/logout')
        .set('Cookie', [authCookie])
        .expect(StatusCodes.NO_CONTENT);

      const authCookieAfterLogout = cookie.parse(logoutRes.get('Set-Cookie')[0]!);

      expect(authCookieAfterLogout[REFRESH_TOKEN_COOKIE_NAME]).toBe('');
    });
  });
});
