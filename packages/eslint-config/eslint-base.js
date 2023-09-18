/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:typescript-sort-keys/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'sort-keys-fix', 'sort-destructure-keys', 'typescript-sort-keys'],
  rules: {
    // global
    eqeqeq: 'warn',
    'no-console': 'warn',
    // other plugins
    'sort-keys-fix/sort-keys-fix': 'warn',
    'sort-destructure-keys/sort-destructure-keys': 'warn',
    // ts
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
    '@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
    // import
    'import/newline-after-import': 'warn',
    'import/no-cycle': 'warn',
    'import/no-default-export': 'warn',
    'import/no-extraneous-dependencies': 'warn',
    'import/first': 'warn',
    'import/no-duplicates': ['warn', { 'prefer-inline': true }],
    // NOTE: an alternative would be to use https://github.com/trivago/prettier-plugin-sort-imports
    'import/order': [
      'warn',
      {
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', 'parent', ['sibling', 'index']],
        pathGroups: [
          {
            group: 'internal',
            pattern: '@movies/**',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: [],
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
