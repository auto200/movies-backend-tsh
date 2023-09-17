// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@movies/eslint-config/eslint-base.js'],
  env: {
    node: true,
  },
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      typescript: { project: path.resolve(__dirname, 'tsconfig.json') },
    },
  },
  root: true,
};
