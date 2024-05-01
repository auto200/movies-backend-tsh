import { randomUUID } from 'crypto';

import { BasicUserInfo } from '@movies/shared/communication';

import { DbUser } from '@/config/database/connectJSONDb';

import { UserNotFoundError } from '../../errors/userNotFoundError';

import { AuthRepository } from './authRepository';

export function MockAuthRepository(initialUsers: DbUser[] = []): AuthRepository {
  const users = initialUsers;

  return {
    addRefreshToken: (userId, refreshToken) => {
      const user = users.find((user) => user.id === userId);
      if (!user) throw new UserNotFoundError(userId);

      user.refreshTokens.push(refreshToken);
      user.updatedAt = Date.now().toString();

      return Promise.resolve();
    },

    doesUserWithEmailExist: (email) =>
      Promise.resolve(!!users.find((user) => user.email === email)),

    doesUserWithUsernameExist: (username) =>
      Promise.resolve(!!users.find((user) => user.username === username)),

    getUserAndHashedRefreshTokens: (userId) => {
      const user = users.find((user) => user.id === userId);

      if (!user) return Promise.resolve(null);

      const toReturn = {
        hashedRefreshTokens: user.refreshTokens,
        user: {
          email: user.email,
          id: user.id,
          username: user.username,
        },
      };

      return Promise.resolve(toReturn);
    },

    getUserByEmail: (email) => {
      const user = users.find((user) => user.email === email) ?? null;

      if (!user) return Promise.resolve(null);

      const userData: BasicUserInfo = {
        email: user.email,
        id: user.id,
        username: user.username,
      };

      return Promise.resolve({ password: user.password, user: userData });
    },

    getUserHashedRefreshTokens: (userId) => {
      const hashedRefreshTokens = users.find((user) => user.id === userId)?.refreshTokens;

      return Promise.resolve(hashedRefreshTokens ?? null);
    },

    removeAllRefreshTokens: (userId) => {
      const user = users.find((user) => user.id === userId);
      if (!user) return Promise.resolve();

      user.refreshTokens = [];
      user.updatedAt = Date.now().toString();

      return Promise.resolve();
    },

    removeRefreshToken: (userId, refreshToken) => {
      const user = users.find((user) => user.id === userId);

      if (!user) return Promise.resolve();

      user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
      user.updatedAt = Date.now().toString();

      return Promise.resolve();
    },

    signup: (user) => {
      const now = Date.now().toString();
      const userToAdd: DbUser = {
        ...user,
        createdAt: now,
        id: randomUUID(),
        refreshTokens: [],
        updatedAt: now,
      };
      users.push(userToAdd);

      const addedUser: BasicUserInfo = {
        email: userToAdd.email,
        id: userToAdd.id,
        username: userToAdd.username,
      };

      return Promise.resolve(addedUser);
    },
  };
}
