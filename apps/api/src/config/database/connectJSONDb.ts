import { dbConfig } from './dbConfig';
import { JSONDbDriver } from './JSONDbDriver';

export type DatabaseSchema = {
  genres: string[];
  movies: Array<{
    actors?: string;
    director: string;
    genres: string[];
    id: number;
    plot?: string;
    posterUrl?: string;
    runtime: number;
    title: string;
    year: number;
  }>;
};

export type DbConnection = JSONDbDriver<DatabaseSchema>;

export async function connectJSONDb(): Promise<DbConnection> {
  const defaultData: DatabaseSchema = { genres: [], movies: [] };
  const db = new JSONDbDriver(dbConfig.DB_JSON_FILE_PATH, defaultData);

  await db.load();

  return db;
}
