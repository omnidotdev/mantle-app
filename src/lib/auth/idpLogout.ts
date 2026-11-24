interface IdpLogoutParams {
  /** The provider's end-session endpoint, or null when it advertises none */
  endSessionEndpoint: string | null | undefined;
  clientId: string | null | undefined;
  /** Where the provider sends the browser after signing out */
  postLogoutRedirectUri: string | null | undefined;
  /** The user's ID token, required by most end-session endpoints */
  idTokenHint: string | null | undefined;
}

/**
 * Build the provider's end-session URL for federated sign-out, or null when a
 * part is missing (the caller then signs out locally only). The endpoint comes
 * from the provider's discovery document, so any OpenID Connect provider works,
 * not only Omni Gatekeeper
 */
export const buildIdpLogoutUrl = ({
  endSessionEndpoint,
  clientId,
  postLogoutRedirectUri,
  idTokenHint,
}: IdpLogoutParams): string | null => {
  if (
    !endSessionEndpoint ||
    !clientId ||
    !postLogoutRedirectUri ||
    !idTokenHint
  )
    return null;

  const url = new URL(endSessionEndpoint);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);
  url.searchParams.set("id_token_hint", idTokenHint);

  return url.toString();
};
