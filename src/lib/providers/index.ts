/**
 * Shared provider instances.
 */

import {
  createAuthzProvider,
  createFlagProvider,
} from "@omnidotdev/providers";

import {
  AUTHZ_API_URL,
  FLAGS_API_HOST,
  FLAGS_CLIENT_KEY,
} from "@/lib/config/env.config";

export const authz = createAuthzProvider({
  apiUrl: AUTHZ_API_URL,
});

export const flags = createFlagProvider(
  FLAGS_API_HOST
    ? {
        provider: "unleash",
        url: FLAGS_API_HOST,
        apiKey: FLAGS_CLIENT_KEY!,
        appName: "mantle",
      }
    : {},
);
