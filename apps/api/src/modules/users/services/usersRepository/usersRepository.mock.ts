import { randomUUID } from 'node:crypto';

import { SignupUserResponseDTO } from '@movies/shared/communication';

import { type DbUser } from '@/config/database/connectJSONDb';

import { UsersRepository } from './usersRepository';

// NOTE: when providing users, they have to have `password` field set to the hash of a password
export function MockUsersRepository(initialUsers: DbUser[] = []): UsersRepository {
  const users = initialUsers;

  return {
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
  };
}
