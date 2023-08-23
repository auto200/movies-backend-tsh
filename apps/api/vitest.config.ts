import { defineConfig } from "vitest/config";
import viteTsconfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
  plugins: [viteTsconfigPaths()],
});

export default config;
