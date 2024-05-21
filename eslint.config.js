import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
  ...tsEslint.config(
    eslint.configs.recommended,
    ...tsEslint.configs.recommended,
  ),
  prettier,
];
