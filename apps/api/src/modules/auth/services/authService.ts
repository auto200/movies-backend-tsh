import { compare } from 'bcrypt';

import { InvalidCredentialsError } from '../errors/invalidCredentialsError';
import { JwtPayload } from '../schema';

import { AuthRepository } from './authRepository/authRepository';

export type AuthService = {
  addRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
  getUserByRefreshToken: (refreshToken: string) => Promise<JwtPayload | null>;
  removeAllRefreshTokens: (userId: string) => Promise<void>;
  removeRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
  validatePassword: (email: string, password: string) => Promise<JwtPayload>;
};

export function AuthService(authRepository: AuthRepository): AuthService {
  return {
    addRefreshToken: async (userId, refreshToken) =>
      authRepository.addRefreshToken(userId, refreshToken),

    getUserByRefreshToken: (refreshToken) => authRepository.getUserByRefreshToken(refreshToken),

    removeAllRefreshTokens: (userId) => authRepository.removeAllRefreshTokens(userId),

    removeRefreshToken: (userId, refreshToken) =>
      authRepository.removeRefreshToken(userId, refreshToken),

    validatePassword: async (email, password) => {
      const userData = await authRepository.getByEmail(email);

      if (!userData) {
        throw new InvalidCredentialsError('Provided password or email is invalid');
      }

      if (await compare(password, userData.password)) return userData.user;

      throw new InvalidCredentialsError('Provided password or email is invalid');
    },
  };
}
