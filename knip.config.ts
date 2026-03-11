import type { KnipConfig } from "knip";

/**
 * Knip configuration.
 * @see https://knip.dev/overview/configuration
 */
const knipConfig: KnipConfig = {
  entry: [
    "src/routes/**/*.{ts,tsx}",
    "src/router.tsx",
    "src/lib/graphql/graphqlFetch.ts",
    // UI components and utilities prepared for use
    "src/components/**/*.{ts,tsx}",
    "src/lib/**/*.{ts,tsx}",
    "src/features/**/*.{ts,tsx}",
  ],
  // NB: files are reported as unused if they are in the set of project files, but not in the set of files resolved from the entry files. See: https://knip.dev/guides/configuring-project-files
  project: ["src/**/*.{ts,tsx,css}"],
  // NB: Modified from the default GraphQL Codegen configuration, see: https://knip.dev/reference/plugins/graphql-codegen
  "graphql-codegen": {
    config: ["package.json", "src/lib/graphql/codegen.config.ts"],
  },
  // used for proper management of Thornberry components, see https://knip.dev/reference/configuration#ignoreexportsusedinfile
  ignoreExportsUsedInFile: true,
  ignore: ["src/generated/**"],
  ignoreDependencies: [
    // used by GraphQL Code Generator scripts
    "dotenv",
    // UI libraries (some not yet used)
    "@internationalized/date",
    "@tanstack/react-form",
    "jose",
    "ms",
    "ts-pattern",
    "usehooks-ts",
    // Dev dependencies
    "@graphql-codegen/import-types-preset",
    "@tanstack/react-devtools",
    "@tanstack/react-query-devtools",
    "@tanstack/react-router-devtools",
    "@types/ms",
    "tw-animate-css",
  ],
  tags: ["-knipignore"],
};

export default knipConfig;
