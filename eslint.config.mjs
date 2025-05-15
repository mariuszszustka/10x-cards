import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactCompiler from "eslint-plugin-react-compiler";
import pluginAstro from "eslint-plugin-astro";
import pluginPrettier from "eslint-plugin-prettier/recommended";
import jsxA11y from "eslint-plugin-jsx-a11y";

// Filtruj globalne obiekty, aby usunąć te z nadmiarowymi spacjami
const filterGlobals = (globalsObj) => {
  return Object.fromEntries(Object.entries(globalsObj).filter(([key]) => key.trim() === key));
};

const browserGlobals = filterGlobals(globals.browser);
const nodeGlobals = filterGlobals(globals.node);

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-console": "warn",
      "no-unused-vars": "off",
    },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: { ...browserGlobals, ...nodeGlobals } },
  },
  tseslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [jsxA11y.flatConfigs.recommended],
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
    },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [pluginReact.configs.flat.recommended],
    plugins: {
      "react-hooks": reactHooks,
      "react-compiler": reactCompiler,
    },
    languageOptions: {
      globals: {
        window: true,
        document: true,
      },
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react-compiler/react-compiler": "error",
    },
  },
  pluginAstro.configs["flat/recommended"],
  pluginPrettier,
]);
