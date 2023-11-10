import { randomUUID } from 'crypto';

import { SignupUserRequestDTO, SignupUserResponseDTO } from '@movies/shared/communication';

import { DbConnection, type DbUser } from '@/config/database/connectJSONDb';
import { JwtPayload } from '@/modules/auth/schema';

import { UserNotFoundError } from '../../errors/userNotFoundError';
import { UserData } from '../../schema';

export type UsersRepository = {
  addRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
  create: (user: SignupUserRequestDTO) => Promise<SignupUserResponseDTO>;
  doesUserWithEmailExist: (email: string) => Promise<boolean>;
  doesUserWithUsernameExist: (username: string) => Promise<boolean>;
  getByEmail: (email: string) => Promise<{ password: string; user: UserData } | null>;
  getUserByRefreshToken: (refreshToken: string) => Promise<JwtPayload | null>;
  removeAllRefreshTokens: (userId: string) => Promise<void>;
  removeRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
};

export function UsersRepository(db: DbConnection): UsersRepository {
  return {
    addRefreshToken: async (userId, refreshToken) => {
      const user = db.data.users.find((user) => user.id === userId);
      if (!user) throw new UserNotFoundError(userId);

      user.refreshTokens.push(refreshToken);
      user.updatedAt = Date.now().toString();

      await db.write();
    },

    create: async (user) => {
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

      const addedUser: SignupUserResponseDTO = {
        email: user.email,
        username: user.username,
      };

      return addedUser;
    },
    doesUserWithEmailExist: (email) =>
      Promise.resolve(!!db.data.users.find((user) => user.email === email)),

    doesUserWithUsernameExist: (username) =>
      Promise.resolve(!!db.data.users.find((user) => user.username === username)),

    getByEmail: (email) => {
      const user = db.data.users.find((user) => user.email === email) ?? null;

      if (!user) return Promise.resolve(null);

      const userData: UserData = {
        createdAt: user.createdAt,
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
