import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),        // Globally ignore the dist directory and skip all lint checks for it.
  {
    files: ['**/*.{js,ts,jsx,tsx}'],     // Lint business code only, excluding test files and configuration files
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,   // Declare browser environment globals to prevent false positives for undefined variables during lint
    },
    rules: {
      'semi': ['warn', 'always'], // Enforce semicolons at the end of statements
    },
  },
]);
