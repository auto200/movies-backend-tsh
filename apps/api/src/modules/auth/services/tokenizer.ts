import { SignOptions, sign, verify } from 'jsonwebtoken';
import { ZodTypeAny, z } from 'zod';

import { JwtPayload } from '../schema';

type VerifyJwtResult<T> =
  | {
      isValid: true;
      payload: T;
    }
  | {
      isValid: false;
    };

export const tokenizer = {
  signJwt: (data: JwtPayload, secret: string, options?: SignOptions) =>
    sign(data, secret, {
      ...options,
    }),

  verifyJwt: <T extends ZodTypeAny>(
    token: string,
    secret: string,
    schema: T
  ): VerifyJwtResult<z.infer<T>> => {
    try {
      const decodedToken = verify(token, secret);

      const payload = schema.parse(decodedToken) as z.infer<T>;

      return {
        isValid: true,
        payload,
      };
    } catch (e) {
      return {
        isValid: false,
      };
    }
  },
};
