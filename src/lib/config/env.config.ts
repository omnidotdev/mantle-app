/**
 * Environment configuration.
 * Public vars use the VITE_ prefix; server-only vars (auth secrets) do not.
 */
declare global {
  interface Window {
    /** Public runtime config injected by the root route (see server/functions/env) */
    __ENV__?: Record<string, string>;
  }
}

// The runtime environment wins over values inlined at build time, so one image
// serves any deployment (a self-hosted instance included). On the server that
// is the live `process.env`; on the client it is `window.__ENV__`, which the
// root route injects from the same server env, so hydrated values match
const env =
  typeof window === "undefined"
    ? { ...import.meta.env, ...process.env }
    : { ...import.meta.env, ...(window.__ENV__ ?? {}) };

export const API_URL = env.VITE_API_URL ?? "https://localhost:4000";
export const API_GRAPHQL_URL = `${API_URL}/graphql`;

// Auth config
const PORT = env.VITE_PORT ?? 3000;
export const BASE_URL =
  env.VITE_BASE_URL || env.BASE_URL || `https://localhost:${PORT}`;
export const AUTH_BASE_URL = env.AUTH_BASE_URL || env.VITE_AUTH_BASE_URL;
export const AUTH_CLIENT_ID = env.AUTH_CLIENT_ID;

/** Omni account hub, where workspaces are created and managed */
export const ACCOUNT_URL = env.VITE_ACCOUNT_URL;
export const AUTH_CLIENT_SECRET = env.AUTH_CLIENT_SECRET;

// Internal auth URL for server-to-server communication (Docker service name)
// Falls back to AUTH_BASE_URL for non-Docker environments
export const AUTH_INTERNAL_URL =
  typeof window === "undefined"
    ? process.env.AUTH_INTERNAL_URL || AUTH_BASE_URL
    : AUTH_BASE_URL;

/**
 * Self-host with an OpenID Connect provider other than Omni Gatekeeper: give a
 * signed-in user without workspace claims a personal workspace. Server-only;
 * mantle-api needs the same setting
 */
export const PERSONAL_WORKSPACE_FALLBACK =
  typeof window === "undefined" &&
  process.env.PERSONAL_WORKSPACE_FALLBACK === "true";
