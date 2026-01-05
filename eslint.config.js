import js from '@eslint/js';
import typescript from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.astro'],
    languageOptions: {
      parser: typescript,
      sourceType: 'module',
      ecmaVersion: 'latest',
      project: './tsconfig.json'
    },
    plugins: {
      '@typescript-eslint/recommended': 'recommended',
      'astro': 'recommended'
    },
    extends: [
      prettier,
      'plugin:astro/recommended',
      'plugin:@typescript-eslint/recommended'
    ],
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^React',
        caughtErrors: false
      }],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-const': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      
      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      
      // Astro specific rules
      'astro/no-conflict-set-directives': 'error',
      'astro/no-set-text-directive': 'error',
      'astro/valid-compile': 'error'
    },
    env: {
      browser: true,
      es2022: true,
      node: true
    },
    globals: {
      console: 'readonly',
      document: 'readonly',
      window: 'readonly'
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json'
        }
      }
    }
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    plugins: ['@typescript-eslint/recommended'],
    extends: ['eslint:recommended'],
    rules: {
      'no-unused-vars': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error'
    }
  }
];