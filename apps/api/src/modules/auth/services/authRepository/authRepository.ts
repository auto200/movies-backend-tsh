import { DbConnection } from '@/config/database/connectJSONDb';

import { UserNotFoundError } from '../../errors/userNotFoundError';
import { JwtPayload } from '../../schema';

export type AuthRepository = {
  addRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
  getByEmail: (email: string) => Promise<{ password: string; user: JwtPayload } | null>;
  getUserByRefreshToken: (refreshToken: string) => Promise<JwtPayload | null>;
  removeAllRefreshTokens: (userId: string) => Promise<void>;
  removeRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
};

export function AuthRepository(db: DbConnection): AuthRepository {
  return {
    addRefreshToken: async (userId, refreshToken) => {
      const user = db.data.users.find((user) => user.id === userId);
      if (!user) throw new UserNotFoundError(userId);

      user.refreshTokens.push(refreshToken);
      user.updatedAt = Date.now().toString();

      await db.write();
    },

    getByEmail: (email) => {
      const user = db.data.users.find((user) => user.email === email) ?? null;

      if (!user) return Promise.resolve(null);

      const userData: JwtPayload = {
        email: user.email,
        id: user.id,
        username: user.username,
      };

      return Promise.resolve({ password: user.password, user: userData });
    },

    getUserByRefreshToken: (refreshToken) => {
      const user = db.data.users.find((user) => user.refreshTokens.includes(refreshToken));
      if (!user) return Promise.resolve(null);

      const toReturn: JwtPayload = {
        email: user.email,
        id: user.id,
        username: user.username,
      };

      return Promise.resolve(toReturn);
    },

    removeAllRefreshTokens: async (userId) => {
      const user = db.data.users.find((user) => user.id === userId);
      if (!user) return Promise.resolve();

      user.refreshTokens = [];
      user.updatedAt = Date.now().toString();

      await db.write();
    },

    removeRefreshToken: async (userId, refreshToken) => {
      const user = db.data.users.find((user) => user.id === userId);
      if (!user) return;

      user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
      user.updatedAt = Date.now().toString();

      await db.write();
    },
  };
}
