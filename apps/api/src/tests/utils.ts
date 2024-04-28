/* eslint-disable import/no-named-as-default-member */

import cookie from 'cookie';
import { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import cloneDeep from 'lodash/cloneDeep';
import supertest, { Response as SuperTestResponse } from 'supertest';
import { expect } from 'vitest';

import {
  BasicUserInfo,
  SignupRequestDTO,
  signupResponseDTOSchema,
} from '@movies/shared/communication';

import { initApp } from '@/app';
import { MockMoviesSearchEngineService } from '@/common/infrastructure/moviesSearchEngine/MoviesSearchEngineService.mock';
import { DatabaseSchema } from '@/config/database/connectJSONDb';
import { AuthService, authMiddleware } from '@/modules/auth';
import { COOKIE_NAME } from '@/modules/auth/consts';
import { MockAuthRepository } from '@/modules/auth/services/authRepository/authRepository.mock';
import { MoviesService } from '@/modules/movies';
import { MockMoviesRepository } from '@/modules/movies/services/moviesRepository/moviesRepository.mock';

const initialData: DatabaseSchema = {
  genres: ['Action', 'Crime'],
  movies: [
    {
      director: 'Johnny',
      genres: ['Action'],
      id: 1,
      runtime: 123,
      title: 'Rose',
      year: 2005,
    },
    {
      director: 'James A',
      genres: ['Crime'],
      id: 2,
      runtime: 83,
      title: 'Twelling jo',
      year: 1992,
    },
  ],
  users: [],
};

export function createTestingApp(testSpecificData?: Partial<DatabaseSchema>) {
  const dbData = cloneDeep({ ...initialData, ...testSpecificData });

  const moviesRepository = MockMoviesRepository({ genres: dbData.genres, movies: dbData.movies });
  const moviesSearchEngineService = MockMoviesSearchEngineService();
  const moviesService = MoviesService(moviesRepository, moviesSearchEngineService);

  const authRepository = MockAuthRepository(dbData.users);
  const authService = AuthService(authRepository);

  return {
    app: initApp({
      authMiddleware,
      authService,
      moviesSearchEngineService,
      moviesService,
    }),
    initialData,
  };
}

export const testUser: SignupRequestDTO = {
  email: 'test@example.com',
  password: 'test-password',
  username: 'user123',
};

type SignUpSuccessfullyResponse = {
  accessTokenCookie: string;
  refreshTokenCookie: string;
  res: SuperTestResponse;
  user: BasicUserInfo;
};

export const signUpSuccessfully = async (
  app: Express,
  user: SignupRequestDTO = testUser
): Promise<SignUpSuccessfullyResponse> => {
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
