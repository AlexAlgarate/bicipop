import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...prettier.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
        },
      ],
    },
  },
];
