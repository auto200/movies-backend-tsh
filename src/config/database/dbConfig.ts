import { validateEnv } from "@config/validateEnv";
import { z } from "zod";

const dbConfigSchema = z.object({
  dbJSONFilePath: z.string(),
});

export const dbConfig = validateEnv(dbConfigSchema);
