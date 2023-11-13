import { randomUUID } from 'crypto';

import { BasicUserInfo, SignupRequestDTO } from '@movies/shared/communication';

import { DbConnection, DbUser } from '@/config/database/connectJSONDb';

import { UserNotFoundError } from '../../errors/userNotFoundError';

export type AuthRepository = {
  addRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
  doesUserWithEmailExist: (email: string) => Promise<boolean>;
  doesUserWithUsernameExist: (username: string) => Promise<boolean>;
  getByEmail: (email: string) => Promise<{ password: string; user: BasicUserInfo } | null>;
  getUserByRefreshToken: (refreshToken: string) => Promise<BasicUserInfo | null>;
  removeAllRefreshTokens: (userId: string) => Promise<void>;
  removeRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
  signup: (user: SignupRequestDTO) => Promise<BasicUserInfo>;
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

    doesUserWithEmailExist: (email) =>
      Promise.resolve(!!db.data.users.find((user) => user.email === email)),

    doesUserWithUsernameExist: (username) =>
      Promise.resolve(!!db.data.users.find((user) => user.username === username)),

    getByEmail: (email) => {
      const user = db.data.users.find((user) => user.email === email) ?? null;

      if (!user) return Promise.resolve(null);

      const userData: BasicUserInfo = {
        email: user.email,
        id: user.id,
        username: user.username,
      };

      return Promise.resolve({ password: user.password, user: userData });
    },

    getUserByRefreshToken: (refreshToken) => {
      const user = db.data.users.find((user) => user.refreshTokens.includes(refreshToken));
      if (!user) return Promise.resolve(null);

      const toReturn: BasicUserInfo = {
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

    signup: async (user) => {
      const now = Date.now().toString();
      const userToAdd: DbUser = {
        ...user,
        createdAt: now,
        id: randomUUID(),
        refreshTokens: [],
        updatedAt: now,
      };
      db.data.users.push(userToAdd);

      await db.write();

      const addedUser: BasicUserInfo = {
        email: userToAdd.email,
        id: userToAdd.id,
        username: userToAdd.username,
      };

      return addedUser;
    },
  };
}
