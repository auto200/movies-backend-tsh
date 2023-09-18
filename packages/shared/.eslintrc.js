/** @type {import("eslint").Linter.Config} */
const config = {
  env: {
    node: true,
  },
  extends: ['@movies/eslint-config/eslint-base.js'],
  parserOptions: {
    project: 'tsconfig.eslint.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  root: true,
};
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
module.exports = config;
