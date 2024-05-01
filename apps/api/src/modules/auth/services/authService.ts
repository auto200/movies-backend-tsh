import { compare, hash } from 'bcrypt';

import { BasicUserInfo, SignupRequestDTO } from '@movies/shared/communication';

import { findAsync } from '@/common/utils';

import { EmailAlreadyInUseError } from '../errors/emailAlreadyInUseError';
import { InvalidCredentialsError } from '../errors/invalidCredentialsError';
import { UsernameAlreadyInUseError } from '../errors/usernameAlreadyInUseError';

import { AuthRepository } from './authRepository/authRepository';

export type AuthService = {
  addRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
  getUserIfHasRefreshToken: (userId: string, refreshToken: string) => Promise<BasicUserInfo | null>;
  removeAllRefreshTokens: (userId: string) => Promise<void>;
  removeRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
  signup: (user: SignupRequestDTO) => Promise<BasicUserInfo>;
  validateCredentials: (email: string, password: string) => Promise<BasicUserInfo>;
};

export function AuthService(authRepository: AuthRepository): AuthService {
  return {
    addRefreshToken: async (userId, refreshToken) =>
      // TODO: hash refresh token
      authRepository.addRefreshToken(userId, refreshToken),

    getUserIfHasRefreshToken: async (userId, refreshToken) => {
      const userAndTokens = await authRepository.getUserAndHashedRefreshTokens(userId);
      if (!userAndTokens) return null;

      const { hashedRefreshTokens, user } = userAndTokens;
      // NOTE: we gonna need to decrypt token here
      const hasToken = await findAsync(hashedRefreshTokens, (hashedToken) =>
        Promise.resolve(refreshToken === hashedToken)
      );

      return hasToken ? user : null;
    },

    removeAllRefreshTokens: (userId) => authRepository.removeAllRefreshTokens(userId),

    removeRefreshToken: async (userId, refreshToken) => {
      const hashedRefreshTokens = await authRepository.getUserHashedRefreshTokens(userId);
      if (!hashedRefreshTokens) return;

      // NOTE: we gonna need to decrypt token here
      const hashedTokenToRemove = await findAsync(hashedRefreshTokens, (hashedToken) =>
        Promise.resolve(refreshToken === hashedToken)
      );
      if (!hashedTokenToRemove) return;

      await authRepository.removeRefreshToken(userId, hashedTokenToRemove);
    },

    signup: async (user) => {
      if (await authRepository.doesUserWithEmailExist(user.email)) {
        throw new EmailAlreadyInUseError(user.email);
      }

      if (await authRepository.doesUserWithUsernameExist(user.username)) {
        throw new UsernameAlreadyInUseError(user.username);
      }

      const userWithHashedPassword: SignupRequestDTO = {
        ...user,
        // NOTE: bcrypt can securely hash only strings up to 72 characters
        password: await hash(user.password, 10),
      };

      return await authRepository.signup(userWithHashedPassword);
    },

    validateCredentials: async (email, password) => {
      const userData = await authRepository.getUserByEmail(email);

      if (!userData) {
        throw new InvalidCredentialsError('Provided password or email is invalid');
      }

      if (await compare(password, userData.password)) return userData.user;

      throw new InvalidCredentialsError('Provided password or email is invalid');
    },
  };
}
