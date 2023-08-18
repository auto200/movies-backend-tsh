import { dbConfig } from "./dbConfig";
import { JSONDbDriver } from "./JSONDbDriver";

type DatabaseSchema = {
  genres: string[];
  movies: Array<{
    id: number;
    genres: string[];
    title: string;
    year: number;
    runtime: number;
    director: string;
    actors?: string | undefined;
    plot?: string | undefined;
    posterUrl?: string | undefined;
  }>;
};

export type DbConnection = JSONDbDriver<DatabaseSchema>;

export async function connectJSONDb(): Promise<DbConnection> {
  const defaultData: DatabaseSchema = { genres: [], movies: [] };
  const db = new JSONDbDriver(dbConfig.dbJSONFilePath, defaultData);

  await db.load();

  return db;
}
