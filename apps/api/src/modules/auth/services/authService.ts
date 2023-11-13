import { compare, hash } from 'bcrypt';

import { BasicUserInfo, SignupRequestDTO } from '@movies/shared/communication';

import { EmailAlreadyInUseError } from '../errors/emailAlreadyInUseError';
import { InvalidCredentialsError } from '../errors/invalidCredentialsError';
import { UsernameAlreadyInUseError } from '../errors/usernameAlreadyInUseError';

import { AuthRepository } from './authRepository/authRepository';

export type AuthService = {
  addRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
  getUserByRefreshToken: (refreshToken: string) => Promise<BasicUserInfo | null>;
  removeAllRefreshTokens: (userId: string) => Promise<void>;
  removeRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
  signup: (user: SignupRequestDTO) => Promise<BasicUserInfo>;
  validatePassword: (email: string, password: string) => Promise<BasicUserInfo>;
};

export function AuthService(authRepository: AuthRepository): AuthService {
  return {
    addRefreshToken: async (userId, refreshToken) =>
      authRepository.addRefreshToken(userId, refreshToken),

    getUserByRefreshToken: (refreshToken) => authRepository.getUserByRefreshToken(refreshToken),

    removeAllRefreshTokens: (userId) => authRepository.removeAllRefreshTokens(userId),

    removeRefreshToken: (userId, refreshToken) =>
      authRepository.removeRefreshToken(userId, refreshToken),

    signup: async (user) => {
      if (await authRepository.doesUserWithEmailExist(user.email)) {
        throw new EmailAlreadyInUseError(user.email);
      }

      if (await authRepository.doesUserWithUsernameExist(user.username)) {
        throw new UsernameAlreadyInUseError(user.email);
      }

      const userWithHashedPassword: SignupRequestDTO = {
        ...user,
        password: await hash(user.password, 10),
      };

      return await authRepository.signup(userWithHashedPassword);
    },

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
