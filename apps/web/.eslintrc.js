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
    // NOTE: it disables all of the restricted imports in `src/components/ui`, what we really want
    // to achieve is to only disable the rule forbidding imports from '@radix-ui/*'. Possible
    // solution would be to extract all the rules and reapply them here, omitting '@radix-ui/*' rule
    // Related: https://github.com/eslint/eslint/discussions/17047
    {
      files: ['src/components/ui/**'],
      rules: {
        'no-restricted-imports': 'off',
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
        paths: [
          {
            message: 'Please use next-i18next module instead',
            name: 'react-i18next',
          },
          {
            message: 'Please use `getServerTranslations` from @/utils/server instead',
            name: 'next-i18next/serverSideTranslations',
          },
          {
            importNames: ['useLayoutEffect'],
            message: "Please use 'useIsomorphicLayoutEffect' from usehooks-ts",
            name: 'react',
          },
        ],
        patterns: [
          {
            group: ['@radix-ui/*'],
            message: 'Please use components defined at `@/components/ui` instead',
          },
        ],
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: { project: path.resolve(__dirname, 'tsconfig.json') },
    },
  },
};
