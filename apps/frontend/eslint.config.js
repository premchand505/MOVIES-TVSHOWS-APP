import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    // --- ADD THIS RULES SECTION ---
    rules: {
      // This rule modifies the default behavior for unused variables.
      '@typescript-eslint/no-unused-vars': [
        'warn', // Sets the severity to a warning. You can use 'error' if you prefer.
        {
          // Ignores variables in any scope (e.g., const _unused = ...)
          varsIgnorePattern: '^_',
          // Ignores error variables in catch blocks (e.g., catch (_error))
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
])