import { Request, Response } from 'express';
import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

import { validator } from './payloadValidation';

describe('payload validation', () => {
  const emptyRequest = {
    body: undefined,
    params: {},
    query: {},
  } as Request;
  const mockResponse = {} as Response;

  test('empty validator should not raise error', () => {
    const mockNext = vi.fn();
    const validate = validator({});

    validate(emptyRequest, mockResponse, mockNext);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith();
  });

  test('should raise error if request does not match schema', () => {
    const mockNext = vi.fn();
    const validate = validator({ body: z.string() });

    validate(emptyRequest, mockResponse, mockNext);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith(expect.any(Error));
  });

  test('should strip excess keys from request', () => {
    const mockNext = vi.fn();
    const validate = validator({ body: z.object({ foo: z.string() }) });
    const request = { ...emptyRequest, body: { bar: 123, foo: '' } } as Request;

    validate(request, mockResponse, mockNext);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith();
    expect(request.body).toEqual({ foo: '' });
  });
});
