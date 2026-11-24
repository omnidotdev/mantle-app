import type { OrganizationClaim } from "@omnidotdev/providers/auth";

/**
 * Personal workspace fallback for self-hosting.
 *
 * Omni Gatekeeper puts the user's workspaces in a namespaced organizations
 * claim. Signed in through any other OpenID Connect provider, a user has no
 * workspace claims and could never reach the app. With
 * `PERSONAL_WORKSPACE_FALLBACK=true`, such a user gets one personal workspace
 * derived from their subject. mantle-api derives the same id from the access
 * token's subject, so both sides agree on it without a shared store
 */

/** URL slug of the fallback workspace (each user only ever sees their own) */
export const PERSONAL_WORKSPACE_SLUG = "personal";

/**
 * Deterministic personal workspace id for a subject. The subject is hashed so
 * any subject format works (emails, `provider|id` pairs, UUIDs). Must match
 * mantle-api's `personalWorkspaceId`
 */
export const personalWorkspaceId = async (subject: string): Promise<string> => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(subject),
  );
  const hex = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  return `personal-${hex.slice(0, 32)}`;
};

/**
 * The workspaces to use for a signed-in user: their claimed workspaces, or,
 * when the fallback is on and they have none, their personal workspace
 */
export const withPersonalWorkspaceFallback = async (
  organizations: OrganizationClaim[],
  subject: string | null | undefined,
  enabled: boolean,
): Promise<OrganizationClaim[]> => {
  if (!enabled || organizations.length > 0 || !subject) return organizations;

  return [
    {
      id: await personalWorkspaceId(subject),
      name: "Personal",
      slug: PERSONAL_WORKSPACE_SLUG,
      type: "personal",
      roles: ["owner"],
      teams: [],
    },
  ];
};
