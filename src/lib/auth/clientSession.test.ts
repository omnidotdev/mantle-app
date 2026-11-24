import { describe, expect, test } from "bun:test";

import { toClientSession } from "@/lib/auth/clientSession";

import type { GetAuthSession } from "@omnidotdev/providers/auth";

const serverSession: GetAuthSession = {
  accessToken: "access-token",
  organizations: [
    {
      id: "org-a",
      name: "Team A",
      slug: "team-a",
      logo: null,
      type: "team",
      roles: ["owner"],
      teams: [],
    },
  ],
  user: {
    id: "user-1",
    name: "Orin",
    email: "orin@example.com",
    emailVerified: true,
    image: null,
    identityProviderId: "idp-1",
    createdAt: new Date(0),
  },
  session: {
    id: "session-1",
    token: "secret-session-token",
    expiresAt: "2099-01-01T00:00:00.000Z",
    ipAddress: "203.0.113.7",
    userAgent: "Mozilla/5.0",
    userId: "user-1",
  },
};

describe("toClientSession", () => {
  test("keeps the fields the client reads", () => {
    const client = toClientSession(serverSession);

    expect(client.accessToken).toBe("access-token");
    expect(client.organizations).toEqual(serverSession.organizations);
    expect(client.user).toEqual({
      id: "user-1",
      email: "orin@example.com",
      name: "Orin",
      image: null,
      identityProviderId: "idp-1",
    });
  });

  test("never carries the session token, IP address, or user agent", () => {
    const serialized = JSON.stringify(toClientSession(serverSession));

    expect(toClientSession(serverSession)).not.toHaveProperty("session");
    expect(serialized).not.toContain("secret-session-token");
    expect(serialized).not.toContain("203.0.113.7");
    expect(serialized).not.toContain("Mozilla/5.0");
  });
});
