import { validateEnv } from "@/config/validateEnv";
import { z } from "zod";

const dbConfigSchema = z.object({
  DB_JSON_FILE_PATH: z.string(),
});

export const dbConfig = validateEnv(dbConfigSchema);
