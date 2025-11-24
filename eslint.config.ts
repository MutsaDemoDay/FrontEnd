import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended', 'plugin:tailwindcss/recommended'],
    languageOptions: { globals: globals.browser },

    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off',
      'import/prefer-default-export': 'off',

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      "tailwindcss/classnames-order": "off"
    },
  },
]);
