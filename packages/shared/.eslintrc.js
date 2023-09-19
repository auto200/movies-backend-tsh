/* eslint-disable @typescript-eslint/no-unsafe-assignment */

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
module.exports = config;
