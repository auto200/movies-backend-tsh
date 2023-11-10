import { randomUUID } from 'crypto';

import { SignupUserRequestDTO, SignupUserResponseDTO } from '@movies/shared/communication';

import { DbConnection, type DbUser } from '@/config/database/connectJSONDb';

export type UsersRepository = {
  create: (user: SignupUserRequestDTO) => Promise<SignupUserResponseDTO>;
  doesUserWithEmailExist: (email: string) => Promise<boolean>;
  doesUserWithUsernameExist: (username: string) => Promise<boolean>;
};

export function UsersRepository(db: DbConnection): UsersRepository {
  return {
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
  };
}
