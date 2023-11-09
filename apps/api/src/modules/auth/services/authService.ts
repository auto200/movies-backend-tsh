import { compare } from 'bcrypt';

import { UsersRepository } from '@/modules/users';
import { UserData } from '@/modules/users/schema';

import { InvalidCredentialsError } from '../errors/invalidCredentialsError';
import { JwtPayload } from '../schema';

export type AuthService = {
  addRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
  getUserByRefreshToken: (refreshToken: string) => Promise<JwtPayload | null>;
  removeAllRefreshTokens: (userId: string) => Promise<void>;
  removeRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
  validatePassword: (email: string, password: string) => Promise<UserData>;
};

export function AuthService(usersRepository: UsersRepository): AuthService {
  return {
    addRefreshToken: async (userId, refreshToken) =>
      usersRepository.addRefreshToken(userId, refreshToken),

    getUserByRefreshToken: (refreshToken) => usersRepository.getUserByRefreshToken(refreshToken),

    removeAllRefreshTokens: (userId) => usersRepository.removeAllRefreshTokens(userId),

    removeRefreshToken: (userId, refreshToken) =>
      usersRepository.removeRefreshToken(userId, refreshToken),

    validatePassword: async (email, password) => {
      const userData = await usersRepository.getByEmail(email);

      if (!userData) {
        throw new InvalidCredentialsError('Provided password or email is invalid');
      }

      if (await compare(password, userData.password)) return userData.user;

      throw new InvalidCredentialsError('Provided password or email is invalid');
    },
  };
}
