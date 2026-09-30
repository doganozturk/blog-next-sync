import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import * as mdxPlugin from "eslint-plugin-mdx";
import { plugin as shadcnPlugin } from "@shadcn/lint";
import {
  maintainabilityConfig,
  tsconfigRootDirFromMetaUrl,
  tseslint,
  typeAwareTypescriptConfig,
  typescriptParserRootConfig,
  unusedVarsRule,
  workspaceIgnores,
} from "../../eslint.shared.mjs";

const tsconfigRootDir = tsconfigRootDirFromMetaUrl(import.meta.url);

// rehype-pretty-code supplies these variables on generated token spans.
const shikiTokenClasses = [
  "[&_[data-rehype-pretty-code-figure]_span]:text-[var(--shiki-light)]",
  "dark:[&_[data-rehype-pretty-code-figure]_span]:text-[var(--shiki-dark)]",
  "[&_[data-rehype-pretty-code-figure]_span]:[font-style:var(--shiki-light-font-style,inherit)]",
  "dark:[&_[data-rehype-pretty-code-figure]_span]:[font-style:var(--shiki-dark-font-style,inherit)]",
  "[&_[data-rehype-pretty-code-figure]_span]:[font-weight:var(--shiki-light-font-weight,inherit)]",
  "dark:[&_[data-rehype-pretty-code-figure]_span]:[font-weight:var(--shiki-dark-font-weight,inherit)]",
  "[&_[data-rehype-pretty-code-figure]_span]:[text-decoration:var(--shiki-light-text-decoration,inherit)]",
  "dark:[&_[data-rehype-pretty-code-figure]_span]:[text-decoration:var(--shiki-dark-text-decoration,inherit)]",
];

const shadcnRules = {
  "shadcn/no-unknown-classes": "error",
  "shadcn/no-arbitrary-values": ["error", { allow: shikiTokenClasses }],
  "shadcn/no-inline-styles": "error",
};

export default [
  {
    ignores: workspaceIgnores,
  },
  ...tseslint.configs.recommended,
  maintainabilityConfig,
  typescriptParserRootConfig({
    tsconfigRootDir,
  }),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      shadcn: shadcnPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": unusedVarsRule,
      ...shadcnRules,
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
  {
    ...mdxPlugin.flat,
    files: ["content/**/*.mdx"],
    plugins: { ...mdxPlugin.flat.plugins, shadcn: shadcnPlugin },
    rules: {
      ...mdxPlugin.flat.rules,
      // The MDX parser emits article expressions that these JS rules mistake for unused code.
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
      ...shadcnRules,
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
