import supertest from 'supertest';
import { describe, test, expect } from 'vitest';

import {
  AddMovieRequestDTO,
  GetMovieFiltersDTO,
  addMovieResponseDTOSchema,
  getFiltersMetadataResponseDTOSchema,
  getGenresResponseDTOSchema,
  getMoviesDTOSchema,
} from '@movies/shared/communication';

import { createTestingApp } from '@/tests/utils';

describe('movies module', () => {
  describe('POST /v1/movies - add movie', () => {
    test('fails when providing invalid data', async () => {
      const { app } = createTestingApp();

      await supertest(app)
        .post('/v1/movies')
        .send({ title: 'test' })
        .expect('Content-Type', /json/)
        .expect(400);
    });

    test('adds movie to database', async () => {
      const { app } = createTestingApp();

      const movie: AddMovieRequestDTO = {
        director: 'adam',
        genres: ['Action', 'Crime'],
        runtime: 123,
        title: 'The Goat',
        year: 1999,
      };
      const res = await supertest(app)
        .post('/v1/movies')
        .send(movie)
        .expect('Content-Type', /text/)
        .expect(200);

      expect(() => addMovieResponseDTOSchema.parse(res.text)).not.toThrow();
    });
  });

  describe('GET /v1/movies', () => {
    test('returns random movie', async () => {
      const { app } = createTestingApp();

      const res = await supertest(app).get('/v1/movies').expect('Content-Type', /json/).expect(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.length).toEqual(1);
      expect(() => getMoviesDTOSchema.parse(res.body)).not.toThrow();
    });

    test('returns filtered movie', async () => {
      const { app } = createTestingApp();

      const query: GetMovieFiltersDTO = {
        genres: 'Action',
      };

      const res = await supertest(app)
        .get('/v1/movies')
        .query(query)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(() => getMoviesDTOSchema.parse(res.body)).not.toThrow();
    });
  });

  describe('GET /v1/movies/genres', () => {
    test('returns all genres', async () => {
      const { app, initialData } = createTestingApp();

      const res = await supertest(app)
        .get('/v1/movies/genres')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toMatchObject(initialData.genres);

      expect(() => getGenresResponseDTOSchema.parse(res.body)).not.toThrow();
    });
  });

  describe('GET /v1/movies/filters-metadata', () => {
    test('returns all genres', async () => {
      const { app, initialData } = createTestingApp();

      const res = await supertest(app)
        .get('/v1/movies/filters-metadata')
        .expect('Content-Type', /json/)
        .expect(200);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.genres).toStrictEqual(initialData.genres);

      expect(() => getFiltersMetadataResponseDTOSchema.parse(res.body)).not.toThrow();
    });
  });
});
