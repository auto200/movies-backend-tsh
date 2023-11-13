import { SignOptions, sign, verify } from 'jsonwebtoken';
import { z } from 'zod';

import { BasicUserInfo, basicUserInfoSchema } from '@movies/shared/communication';

const jwtPayloadSchema = basicUserInfoSchema.extend({ iat: z.number() });
type JwtPayload = z.infer<typeof jwtPayloadSchema>;

export const tokenizer = {
  signJwt: (userInfo: BasicUserInfo, secret: string, options?: SignOptions): string => {
    const payload: JwtPayload = { ...userInfo, iat: Date.now() };

    return sign(payload, secret, {
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
