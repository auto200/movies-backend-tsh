import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const config = defineConfig({
  plugins: [viteTsconfigPaths()],
  test: {
    // load env variables
    setupFiles: ['dotenv/config'],
  },
});
// eslint-disable-next-line import/no-default-export
export default config;
