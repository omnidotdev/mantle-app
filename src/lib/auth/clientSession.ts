import type {
  GetAuthSession,
  OrganizationClaim,
} from "@omnidotdev/providers/auth";

/**
 * The session as the browser sees it. Router context and server function
 * results are serialized into the page, so this carries only what client code
 * reads: never the Better Auth session token (the httpOnly cookie value), the
 * IP address, or the user agent
 */
export interface ClientSession {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string | null;
    identityProviderId?: string | null;
    username?: string;
  };
  /** OAuth access token the browser sends to the API as a bearer */
  accessToken?: string;
  organizations: OrganizationClaim[];
}

/**
 * Whitelist the fields of a server-side session that are safe to send to the
 * browser
 */
export const toClientSession = (session: GetAuthSession): ClientSession => {
  const { user } = session;

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image ?? null,
      identityProviderId: user.identityProviderId ?? null,
      ...(typeof user.username === "string" ? { username: user.username } : {}),
    },
    accessToken: session.accessToken,
    organizations: session.organizations,
  };
};
