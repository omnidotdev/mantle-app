import { describe, expect, test } from "bun:test";

import { buildIdpLogoutUrl } from "@/lib/auth/idpLogout";

const base = {
  clientId: "mantle",
  postLogoutRedirectUri: "http://localhost:3000",
  idTokenHint: "id.token.jwt",
};

describe("federated sign-out URL", () => {
  test("uses the provider's advertised end-session endpoint", () => {
    const url = new URL(
      buildIdpLogoutUrl({
        ...base,
        endSessionEndpoint: "http://localhost:8080/default/endsession",
      }) as string,
    );

    expect(`${url.origin}${url.pathname}`).toBe(
      "http://localhost:8080/default/endsession",
    );
    expect(url.searchParams.get("client_id")).toBe("mantle");
    expect(url.searchParams.get("post_logout_redirect_uri")).toBe(
      "http://localhost:3000",
    );
    expect(url.searchParams.get("id_token_hint")).toBe("id.token.jwt");
  });

  test("signs out locally when the provider advertises no endpoint", () => {
    expect(buildIdpLogoutUrl({ ...base, endSessionEndpoint: null })).toBeNull();
  });

  test("signs out locally without an ID token", () => {
    expect(
      buildIdpLogoutUrl({
        ...base,
        endSessionEndpoint: "https://identity.omni.dev/oauth2/end-session",
        idTokenHint: undefined,
      }),
    ).toBeNull();
  });
});
