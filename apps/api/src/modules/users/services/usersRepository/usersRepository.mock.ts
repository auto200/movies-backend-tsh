import { randomUUID } from 'node:crypto';

import { SignupUserResponseDTO } from '@movies/shared/communication';

import { type DbUser } from '@/config/database/connectJSONDb';
import { JwtPayload } from '@/modules/auth/schema';

import { UserNotFoundError } from '../../errors/userNotFoundError';

import { UsersRepository } from './usersRepository';

// NOTE: when providing users, they have to have `password` field set to the hash of a password
export function MockUsersRepository(initialUsers: DbUser[] = []): UsersRepository {
  const users = initialUsers;

  return {
    addRefreshToken: (userId, refreshToken) => {
      const user = users.find((user) => user.id === userId);
      if (!user) throw new UserNotFoundError(userId);

      user.refreshTokens.push(refreshToken);
      user.updatedAt = Date.now().toString();

      return Promise.resolve();
    },
    create: (user) => {
      const now = Date.now().toString();
      const userToAdd: DbUser = {
        ...user,
        createdAt: now,
        id: randomUUID(),
        refreshTokens: [],
        updatedAt: now,
      };
      users.push(userToAdd);

      const addedUser: SignupUserResponseDTO = {
        email: user.email,
        username: user.username,
      };

      return Promise.resolve(addedUser);
    },
    doesUserWithEmailExist: (email) =>
      Promise.resolve(!!users.find((user) => user.email === email)),

    doesUserWithUsernameExist: (username) =>
      Promise.resolve(!!users.find((user) => user.username === username)),

    getByEmail: (email) => {
      const user = users.find((user) => user.email === email) ?? null;

      if (!user) return Promise.resolve(null);

      const { password, ...safeUser } = user;

      return Promise.resolve({ password, user: safeUser });
    },

    getById: (userId) => {
      const user = users.find((user) => user.id === userId);
      if (!user) {
        return Promise.resolve(null);
      }
      const { password: _, ...userWithoutPassword } = user;

      return Promise.resolve(userWithoutPassword);
    },

    getUserByRefreshToken: (refreshToken) => {
      const user = users.find((user) => user.refreshTokens.includes(refreshToken));
      if (!user) return Promise.resolve(null);
      const toReturn: JwtPayload = {
        email: user.email,
        id: user.id,
        username: user.username,
      };

      return Promise.resolve(toReturn);
    },

    removeRefreshToken: (userId, refreshToken) => {
      const user = users.find((user) => user.id === userId);
      if (!user) return Promise.resolve();
      user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);

      return Promise.resolve();
    },
  };
}
