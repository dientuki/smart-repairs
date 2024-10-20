import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginPromise from "eslint-plugin-promise";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,
  pluginPromise.configs['flat/recommended'],
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      'promise/no-callback-in-promise': 'error',
      'promise/no-promise-in-callback': 'error',
      'promise/always-return': 'error',
      'promise/no-nesting': "error",
      'promise/prefer-await-to-callbacks': "error",
      'no-console': "error",
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
];