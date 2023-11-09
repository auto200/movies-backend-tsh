import { dbConfig } from './dbConfig';
import { JSONDbDriver } from './JSONDbDriver';

export type DbUser = {
  createdAt: string;
  email: string;
  id: string;
  password: string;
  refreshTokens: string[];
  updatedAt: string;
  username: string;
};

export type DatabaseSchema = {
  genres: string[];
  movies: Array<{
    actors?: string;
    director: string;
    genres: [string, ...string[]];
    id: number;
    plot?: string;
    posterUrl?: string;
    runtime: number;
    title: string;
    year: number;
  }>;
  users: DbUser[];
};

export type DbConnection = JSONDbDriver<DatabaseSchema>;

export async function connectJSONDb(): Promise<DbConnection> {
  const defaultData: DatabaseSchema = { genres: [], movies: [], users: [] };
  const db = new JSONDbDriver(dbConfig.DB_JSON_FILE_PATH, defaultData);

  await db.load();

  return db;
}
