import { dbConfig } from "./dbConfig";
import { JSONDbDriver } from "./JSONDbDriver";

export type DatabaseSchema = {
  genres: string[];
  movies: Array<{
    id: number;
    genres: string[];
    title: string;
    year: number;
    runtime: number;
    director: string;
    actors?: string;
    plot?: string;
    posterUrl?: string;
  }>;
};

export type DbConnection = JSONDbDriver<DatabaseSchema>;

export async function connectJSONDb(): Promise<DbConnection> {
  const defaultData: DatabaseSchema = { genres: [], movies: [] };
  const db = new JSONDbDriver(dbConfig.DB_JSON_FILE_PATH, defaultData);

  await db.load();

  return db;
}
