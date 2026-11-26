import { createServerFn } from "@tanstack/react-start";
import { getRequest, setCookie } from "@tanstack/react-start/server";

import auth from "@/lib/auth/auth";
import { authCache, oidc } from "@/lib/auth/authCache";
import { toClientSession } from "@/lib/auth/clientSession";
import { getAuth } from "@/lib/auth/getAuth";
import { buildIdpLogoutUrl } from "@/lib/auth/idpLogout";
import { withPersonalWorkspaceFallback } from "@/lib/auth/personalWorkspace";
import {
  AUTH_BASE_URL,
  AUTH_CLIENT_ID,
  BASE_URL,
  PERSONAL_WORKSPACE_FALLBACK,
} from "@/lib/config/env.config";

export const fetchSession = createServerFn({ method: "POST" }).handler(
  async () => {
    const request = getRequest();

    const session = await getAuth(request);

    // Identity provider base URL, so the browser can check its Omni session
    // (the client bundle carries no build-time auth config)
    const authBaseUrl = AUTH_BASE_URL as string | undefined;

    if (!session) return { session: null, authBaseUrl };

    session.organizations = await withPersonalWorkspaceFallback(
      session.organizations,
      session.user.identityProviderId,
      PERSONAL_WORKSPACE_FALLBACK,
    );

    // The result reaches the browser, so send only whitelisted fields
    return { session: toClientSession(session), authBaseUrl };
  },
);

const clearAuthCacheCookie = () => {
  setCookie(authCache.cookieName, "", { maxAge: 0, path: "/" });
};

/**
 * The provider's end-session endpoint from its discovery document. Falls back
 * to Omni Gatekeeper's path if discovery is unreachable, and resolves null when
 * the provider advertises none (sign-out is then local only)
 */
const resolveEndSessionEndpoint = async (): Promise<string | null> => {
  try {
    const discovery = (await oidc.getDiscovery()) as {
      end_session_endpoint?: string;
    };

    return discovery.end_session_endpoint ?? null;
  } catch {
    return AUTH_BASE_URL ? `${AUTH_BASE_URL}/oauth2/end-session` : null;
  }
};

/**
 * Sign out from the local session (server-side)
 * Returns the IDP logout URL for federated logout redirect
 */
export const signOutLocal = createServerFn({ method: "POST" }).handler(
  async () => {
    const request = getRequest();
    const headers = request.headers;

    // Grab the ID token before we destroy the local session
    let idToken: string | undefined;
    try {
      // better-auth 1.7 reads the token by stored account cookie (enabled via
      // account.storeAccountCookie), not by providerId
      const tokenResult = await auth.api.getAccessToken({
        body: { useAccountCookie: true },
        headers,
      });
      idToken = tokenResult?.idToken;
    } catch {
      // Token may already be expired — proceed with logout anyway
    }

    await auth.api.signOut({ headers });
    clearAuthCacheCookie();

    const idpLogoutUrl = idToken
      ? buildIdpLogoutUrl({
          endSessionEndpoint: await resolveEndSessionEndpoint(),
          clientId: AUTH_CLIENT_ID,
          postLogoutRedirectUri: BASE_URL,
          idTokenHint: idToken,
        })
      : null;

    return { idpLogoutUrl };
  },
);
