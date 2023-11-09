import { hash } from 'bcrypt';

import { SignupUserRequestDTO, SignupUserResponseDTO } from '@movies/shared/communication';

import { type DbUser } from '@/config/database/connectJSONDb';

import { EmailAlreadyInUseError } from '../errors/emailAlreadyInUseError';

import { UsersRepository } from './usersRepository';

export type UsersService = {
  addRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
  create: (user: SignupUserRequestDTO) => Promise<SignupUserResponseDTO>;
  getById: (userId: string) => Promise<Omit<DbUser, 'password'> | null>;
};

export function UsersService(usersRepository: UsersRepository): UsersService {
  return {
    addRefreshToken: async (userId, refreshToken) =>
      usersRepository.addRefreshToken(userId, refreshToken),

    create: async (user) => {
      if (await usersRepository.doesUserWithEmailExist(user.email)) {
        throw new EmailAlreadyInUseError(user.email);
      }

      if (await usersRepository.doesUserWithUsernameExist(user.username)) {
        throw new EmailAlreadyInUseError(user.email);
      }

      const userWithHashedPassword: SignupUserRequestDTO = {
        ...user,
        password: await hash(user.password, 10),
      };

      return await usersRepository.create(userWithHashedPassword);
    },

    getById: async (userId) => {
      const user = usersRepository.getById(userId);

      return user;
    },
  };
}
