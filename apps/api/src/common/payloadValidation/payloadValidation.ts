import { RequestHandler } from 'express';
import { ZodSchema } from 'zod';

import { PayloadError, PayloadValidationError } from '../errors/PayloadValidationError';

type PayloadSchema<TParams, TQuery, TBody> = Partial<{
  body: ZodSchema<TBody>;
  params: ZodSchema<TParams>;
  query: ZodSchema<TQuery>;
}>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResBody = any;

export function validator<
  Params extends Record<string, unknown>,
  Query extends Record<string, unknown>,
  Body,
>(schema: PayloadSchema<Params, Query, Body>): RequestHandler<Params, ResBody, Body, Query> {
  return (req, _, next) => {
    const errors: PayloadError[] = [];

    if (schema.params) {
      const parsed = schema.params.safeParse(req.params);
      if (parsed.success) {
        req.params = parsed.data;
      } else {
        errors.push({ errors: parsed.error.issues, type: 'Params' });
      }
    }

    if (schema.query) {
      const parsed = schema.query.safeParse(req.query);
      if (parsed.success) {
        req.query = parsed.data;
      } else {
        errors.push({ errors: parsed.error.issues, type: 'Query' });
      }
    }

    if (schema.body) {
      const parsed = schema.body.safeParse(req.body);
      if (parsed.success) {
        req.body = parsed.data;
      } else {
        errors.push({ errors: parsed.error.issues, type: 'Body' });
      }
    }

    if (errors.length > 0) {
      return next(new PayloadValidationError('Invalid payload', errors));
    }

    next();
  };
}
