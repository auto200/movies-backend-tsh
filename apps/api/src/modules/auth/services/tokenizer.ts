import { SignOptions, sign, verify } from 'jsonwebtoken';
import { z } from 'zod';

import { BasicUserInfo, basicUserInfoSchema } from '@movies/shared/communication';

const jwtPayloadSchema = basicUserInfoSchema.extend({ exp: z.number(), iat: z.number() });

export const tokenizer = {
  signJwt: (userInfo: BasicUserInfo, secret: string, options?: SignOptions): string => {
    return sign(userInfo, secret, {
      ...options,
    });
  },

  verifyJwt: (token: string, secret: string) => {
    try {
      const decodedToken = verify(token, secret);

      return jwtPayloadSchema.parse(decodedToken);
    } catch (e) {
      return null;
    }
  },
};
