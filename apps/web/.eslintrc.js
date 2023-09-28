// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    '@movies/eslint-config/eslint-nextjs.js',
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  overrides: [
    {
      files: ['src/pages/**', './next.config.mjs'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
  parserOptions: {
    project: 'tsconfig.eslint.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@tanstack/query'],
  root: true,
  rules: {
    'no-restricted-imports': [
      'warn',
      {
        message: 'Please use next-i18next module instead',
        name: 'react-i18next',
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: { project: path.resolve(__dirname, 'tsconfig.json') },
    },
  },
};
