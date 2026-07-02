import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import {
  tsconfigRootDirFromMetaUrl,
  tseslint,
  typeAwareTypescriptConfig,
  typescriptParserRootConfig,
  unusedVarsRule,
  workspaceIgnores,
} from "../../eslint.shared.mjs";

const tsconfigRootDir = tsconfigRootDirFromMetaUrl(import.meta.url);

export default [
  {
    ignores: [
      ...workspaceIgnores,
      "next-sitemap.config.js",
    ],
  },
  ...tseslint.configs.recommended,
  typescriptParserRootConfig({
    tsconfigRootDir,
  }),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": unusedVarsRule,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        tsconfigRootDir,
      },
    },
  },
  typeAwareTypescriptConfig({
    files: ["**/*.{ts,tsx}"],
    parserOptions: {
      projectService: true,
    },
    tsconfigRootDir,
  }),
];
