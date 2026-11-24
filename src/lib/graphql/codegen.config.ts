import type { CodegenConfig } from "@graphql-codegen/cli";
import type { Types } from "@graphql-codegen/plugin-helpers";

type GraphQLCodegenConfig = Types.ConfiguredOutput;

// offline schema source: the API's committed SDL, generated from the database
// (no running server or introspection needed). Override with GRAPHQL_SCHEMA_URL
// to point at a live endpoint if ever required
const LOCAL_SCHEMA_PATH = "../mantle-api/src/generated/graphql/schema.graphql";

/**
 * Shared plugins across the generated GraphQL Codegen artifacts.
 */
const sharedPlugins: GraphQLCodegenConfig["plugins"] = [
  // NB: typescript-operations v6+ emits the schema input types and enums it needs, so the `typescript` plugin is not listed (it would emit them a second time)
  "typescript-operations",
  {
    add: {
      // Prepend artifact with TS no-check directive
      content: "// @ts-nocheck",
    },
  },
];

/**
 * Shared configuration across each of the generated GraphQL Codegen artifacts.
 */
const sharedConfig: GraphQLCodegenConfig["config"] = {
  // keep schema enums as runtime enums (the `typescript` plugin's output) so
  // code can reference their members as values
  enumType: "native",
  scalars: {
    Date: { input: "Date", output: "string" },
    Datetime: { input: "Date", output: "string" },
    UUID: "string",
    Cursor: "string",
    BigInt: "string",
    BigFloat: "string",
  },
  defaultScalarType: "unknown",
  constEnum: true,
};

/**
 * GraphQL Code Generator configuration.
 */
const graphqlCodegenConfig: CodegenConfig = {
  schema: process.env.GRAPHQL_SCHEMA_URL || LOCAL_SCHEMA_PATH,
  documents: "src/lib/graphql/**/*.graphql",
  ignoreNoDocuments: true,
  config: {
    sort: true,
  },
  generates: {
    // TypeScript SDK
    "src/generated/graphql.sdk.ts": {
      plugins: [...sharedPlugins, "typescript-graphql-request"],
      config: sharedConfig,
    },
    // React Query hooks, types, and utilities
    "src/generated/graphql.ts": {
      plugins: [...sharedPlugins, "typescript-react-query"],
      config: {
        ...sharedConfig,
        reactQueryVersion: 5,
        addInfiniteQuery: true,
        addSuspenseQuery: true,
        exposeQueryKeys: true,
        exposeMutationKeys: true,
        exposeFetcher: true,
        fetcher: {
          func: "@/lib/graphql/graphqlFetch#graphqlFetch",
        },
      },
    },
  },
};

export default graphqlCodegenConfig;
