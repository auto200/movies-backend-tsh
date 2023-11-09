import { SignupUserRequestDTO, SignupUserResponseDTO } from '@movies/shared/communication';

import { DbConnection, type DbUser } from '@/config/database/connectJSONDb';
import { JwtPayload } from '@/modules/auth/schema';

import { UserData } from '../../schema';

export type UsersRepository = {
  addRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
  create: (user: SignupUserRequestDTO) => Promise<SignupUserResponseDTO>;
  doesUserWithEmailExist: (email: string) => Promise<boolean>;
  doesUserWithUsernameExist: (username: string) => Promise<boolean>;
  getByEmail: (email: string) => Promise<{ password: string; user: UserData } | null>;
  getById: (userId: string) => Promise<Omit<DbUser, 'password'> | null>;
  getUserByRefreshToken: (refreshToken: string) => Promise<JwtPayload | null>;
  removeRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
};

export function UsersRepository(db: DbConnection): UsersRepository {
  return {
    addRefreshToken: (userId, refreshToken) => Promise.resolve(),
    create: (_user) => Promise.resolve(new Error() as unknown as DbUser),
    doesUserWithEmailExist: (_email) => Promise.resolve(false),
    doesUserWithUsernameExist: (_username) => Promise.resolve(false),
    getByEmail: (_email) => Promise.resolve(null),
    getById: (userId) => Promise.resolve(null),
    getUserByRefreshToken: (refreshToken) => Promise.resolve(null),
    removeRefreshToken: (userId, refreshToken) => Promise.resolve(),
  };
}
