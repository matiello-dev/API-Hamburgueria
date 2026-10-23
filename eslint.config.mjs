import eslint from '@eslint/js';

export default [
  eslint.configs.recommended,
  {
    ignores: ['node_modules/**']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['error', { args: 'none' }]
    }
  }
];
