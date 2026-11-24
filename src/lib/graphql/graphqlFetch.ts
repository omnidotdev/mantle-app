import { parse } from "graphql";
import { GraphQLClient, gql } from "graphql-request";

import { isDemoActive } from "@/features/demo/config";
import { API_GRAPHQL_URL } from "@/lib/config/env.config";
import { fetchSession } from "@/server/functions/auth";

import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { Variables } from "graphql-request";

type FetchOptions = {
  /** Request cache setting. */
  cache?: RequestCache;
};

/**
 * GraphQL fetch wrapper.
 * This is a wrapper around `graphql-request` that adds support for request options.
 * ! NB: this wrapper is not meant to be used directly. It is intended to be used by GraphQL Code Generator as a custom fetch implementation.
 *
 * Fetches a fresh access token from better-auth via server function for each request,
 * ensuring tokens are never stale after idle periods. Requests act only as the
 * signed-in user: the API's service key (which bypasses workspace scoping) is
 * never attached, so every read and write is limited to the user's workspaces.
 *
 * In the public demo every operation is answered in the browser from sample
 * data instead, so no request reaches the API or the auth server
 */
export const graphqlFetch =
  <TData, TVariables>(
    query: string,
    variables?: TVariables,
    options?: (HeadersInit & FetchOptions) | FetchOptions,
  ) =>
  async (): Promise<TData> => {
    if (isDemoActive()) {
      const { resolveDemoOperation } = await import("@/features/demo/resolve");

      return resolveDemoOperation<TData>(
        query,
        variables as Record<string, unknown> | undefined,
      );
    }

    const { session } = await fetchSession();
    const accessToken = session?.accessToken;

    const { cache, ...restOptions } = options || {};

    const client = new GraphQLClient(API_GRAPHQL_URL, {
      cache,
    });

    const document: TypedDocumentNode<TData, Variables> = parse(gql`${query}`);

    return client.request({
      document,
      variables: variables as Variables,
      requestHeaders: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...restOptions,
      },
    });
  };
