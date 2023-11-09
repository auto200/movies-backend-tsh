import { type DbUser } from '@/config/database/connectJSONDb';

export type UserData = Pick<DbUser, 'email' | 'id' | 'username' | 'createdAt'>;
