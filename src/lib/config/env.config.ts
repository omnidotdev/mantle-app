/**
 * Environment configuration.
 * Vite exposes env vars via import.meta.env.
 */

export const API_URL = import.meta.env.VITE_API_URL ?? "https://localhost:4000";
export const API_GRAPHQL_URL = `${API_URL}/graphql`;
export const AUTH_URL =
  import.meta.env.VITE_AUTH_URL ?? "https://localhost:3100";
export const isProd = import.meta.env.PROD;
export const isDev = import.meta.env.DEV;

// Auth config
export const PORT = import.meta.env.VITE_PORT ?? 3000;
export const BASE_URL =
  import.meta.env.VITE_BASE_URL ?? `https://localhost:${PORT}`;
export const AUTH_BASE_URL =
  import.meta.env.VITE_AUTH_BASE_URL ?? "https://localhost:3100";
export const AUTH_CLIENT_ID = import.meta.env.VITE_AUTH_CLIENT_ID ?? "";
export const AUTH_CLIENT_SECRET = import.meta.env.VITE_AUTH_CLIENT_SECRET ?? "";

// Feature flags config
export const FLAGS_API_HOST = import.meta.env.VITE_FLAGS_API_HOST;
export const FLAGS_CLIENT_KEY = import.meta.env.VITE_FLAGS_CLIENT_KEY;

// Authorization config
export const AUTHZ_ENABLED = import.meta.env.VITE_AUTHZ_ENABLED ?? "false";
export const AUTHZ_API_URL = import.meta.env.VITE_AUTHZ_API_URL;
