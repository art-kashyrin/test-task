// @ts-check
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

export default tseslint.config(
  // 1. Global ignores — build output, deps, and the ONE generated source file.
  { ignores: ['**/dist/**', '**/node_modules/**', 'client/src/api/schema.d.ts'] },

  // 2. Baselines
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  // 3. Type-aware parsing for all TS
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['client/vite.config.ts'],
          defaultProject: 'client/tsconfig.node.json',
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 4. Plain JS (this config file itself) gets NO type-aware rules
  { files: ['**/*.{js,mjs,cjs}'], extends: [tseslint.configs.disableTypeChecked] },

  // 5. SERVER
  {
    files: ['server/**/*.ts'],
    languageOptions: { globals: globals.node },
    rules: {
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
      '@typescript-eslint/no-empty-function': [
        'error',
        { allow: ['constructors', 'decoratedFunctions'] },
      ],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
    },
  },

  // 6. CLIENT — React plugins scoped here and ONLY here
  {
    files: ['client/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    extends: [react.configs.flat.recommended, react.configs.flat['jsx-runtime']],
    plugins: { 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
    },
  },

  // 7. Prettier
  prettierRecommended,
)
