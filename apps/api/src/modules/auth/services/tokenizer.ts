import { SignOptions, sign, verify } from 'jsonwebtoken';
import { ZodTypeAny, z } from 'zod';

import { JwtPayload } from '../schema';

export const tokenizer = {
  signJwt: (data: JwtPayload, secret: string, options?: SignOptions) =>
    sign({ ...data, iat: Date.now() }, secret, {
      ...options,
    }),

  verifyJwt: <T extends ZodTypeAny>(token: string, secret: string, schema: T) => {
    try {
      const decodedToken = verify(token, secret);

      const payload = schema.parse(decodedToken) as z.infer<T>;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return payload;
    } catch (e) {
      return null;
    }
  },
};
