import { hash } from 'bcrypt';

import { SignupUserRequestDTO, SignupUserResponseDTO } from '@movies/shared/communication';

import { EmailAlreadyInUseError } from '../errors/emailAlreadyInUseError';
import { UsernameAlreadyInUseError } from '../errors/usernameAlreadyInUseError';

import { UsersRepository } from './usersRepository';

export type UsersService = {
  create: (user: SignupUserRequestDTO) => Promise<SignupUserResponseDTO>;
};

export function UsersService(usersRepository: UsersRepository): UsersService {
  return {
    create: async (user) => {
      if (await usersRepository.doesUserWithEmailExist(user.email)) {
        throw new EmailAlreadyInUseError(user.email);
      }

      if (await usersRepository.doesUserWithUsernameExist(user.username)) {
        throw new UsernameAlreadyInUseError(user.email);
      }

      const userWithHashedPassword: SignupUserRequestDTO = {
        ...user,
        password: await hash(user.password, 10),
      };

      return await usersRepository.create(userWithHashedPassword);
    },
  };
}
