
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier',
  ],
  'settings': {
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.jsx', '.ts', '.tsx'],
        'moduleDirectory': ['node_modules', 'src/']
      }
    },
  },
  rules: {
    'object-curly-spacing': 'off',
    'no-multiple-empty-lines': [2, {'max': 1}],
    'quotes': [2, 'single', 'avoid-escape'],
    'max-classes-per-file': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/ban-ts-comment': 'off',
    'max-len': [
      2,
      {
        'code': 120,
        'tabWidth': 2,
        'ignoreUrls': true,
      }
    ],
    'keyword-spacing': 2,
    'max-params': ['error', 5],
    'complexity': ['error', 15],
    'no-multi-spaces': 0,
    'import-order/import-order': 0,
    'operator-linebreak': 0,
    'no-useless-escape': 0,
    'no-labels': 'error',
    'no-nested-ternary': 0,
    'prefer-const': 0,
    'eol-last': 0,
    'no-duplicate-imports': 0,
    'camelcase': 'off',
    'no-console': ['error', {'allow': ['warn', 'error', 'info']}]
  }
};
