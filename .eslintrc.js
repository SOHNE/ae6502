module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-inferrable-types': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
  plugins: ['@typescript-eslint', 'prettier'],
}
