/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['next/core-web-vitals', './eslint-base.js'],
  rules: {
    'react/jsx-sort-props': ['warn', { shorthandFirst: true, reservedFirst: ['key'] }],
    'import/order': [
      'warn',
      {
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', 'parent', ['sibling', 'index']],
        pathGroups: [
          {
            group: 'external',
            pattern: 'react',
            position: 'before',
          },
          {
            group: 'internal',
            pattern: '@movies/**',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
      },
    ],
  },
};
