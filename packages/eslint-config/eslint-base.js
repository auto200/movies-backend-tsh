/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // global
    eqeqeq: 'error',
    'no-console': 'warn',
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
    // import
    'import/newline-after-import': 'warn',
    'import/no-cycle': 'warn',
    'import/no-default-export': 'warn',
    'import/no-extraneous-dependencies': 'warn',
    'import/first': 'warn',
    'import/no-duplicates': ['warn', { 'prefer-inline': true }],
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
