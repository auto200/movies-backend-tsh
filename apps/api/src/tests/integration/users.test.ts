import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { describe, expect, test } from 'vitest';

import { SignupUserRequestDTO, signupUserResponseDTOSchema } from '@movies/shared/communication';

import { createTestingApp } from '@/tests/utils';

describe('users module', () => {
  describe('POST /v1/users - create user', () => {
    const testUser: SignupUserRequestDTO = {
      email: 'test@example.com',
      password: 'test-password',
      username: 'test',
    };

    test('fails when providing invalid data', async () => {
      const { app } = createTestingApp();

      await supertest(app)
        .post('/v1/users')
        .send({ title: 'test' })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST);
    });

    test('creates user providing correct data', async () => {
      const { app } = createTestingApp();

      await supertest(app).post('/v1/users').send(testUser).expect(StatusCodes.CREATED);
    });

    test('does not create user with duplicated email or username', async () => {
      const { app } = createTestingApp();

      const res = await supertest(app).post('/v1/users').send(testUser).expect(StatusCodes.CREATED);
      expect(() => signupUserResponseDTOSchema.strict().parse(res.body)).not.toThrow();
      // duplicated user
      await supertest(app).post('/v1/users').send(testUser).expect(StatusCodes.CONFLICT);
      // username taken
      await supertest(app)
        .post('/v1/users')
        .send({ ...testUser, email: 'unique@example.com' })
        .expect(StatusCodes.CONFLICT);
      // email taken
      await supertest(app)
        .post('/v1/users')
        .send({ ...testUser, username: 'unique' })
        .expect(StatusCodes.CONFLICT);
    });
  });
});
