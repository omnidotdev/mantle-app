import { describe, expect, test } from "bun:test";

import {
  PERSONAL_WORKSPACE_SLUG,
  personalWorkspaceId,
  withPersonalWorkspaceFallback,
} from "@/lib/auth/personalWorkspace";

import type { OrganizationClaim } from "@omnidotdev/providers/auth";

const team: OrganizationClaim = {
  id: "org-a",
  name: "Team A",
  slug: "team-a",
  type: "team",
  roles: ["member"],
  teams: [],
};

describe("personal workspace fallback", () => {
  test("keeps claimed workspaces, with or without the fallback", async () => {
    expect(await withPersonalWorkspaceFallback([team], "user-1", true)).toEqual(
      [team],
    );
    expect(
      await withPersonalWorkspaceFallback([team], "user-1", false),
    ).toEqual([team]);
  });

  test("leaves a user without workspaces alone when the fallback is off", async () => {
    expect(await withPersonalWorkspaceFallback([], "user-1", false)).toEqual(
      [],
    );
  });

  test("needs a subject to derive the workspace from", async () => {
    expect(await withPersonalWorkspaceFallback([], undefined, true)).toEqual(
      [],
    );
  });

  test("gives a user without workspace claims one personal workspace", async () => {
    const [workspace, ...rest] = await withPersonalWorkspaceFallback(
      [],
      "alice@example.com",
      true,
    );

    expect(rest).toEqual([]);
    expect(workspace).toMatchObject({
      id: await personalWorkspaceId("alice@example.com"),
      slug: PERSONAL_WORKSPACE_SLUG,
      type: "personal",
      roles: ["owner"],
    });
  });

  test("derives the same id as mantle-api for any subject format", async () => {
    // sha256 hex prefixes, computed independently, for subjects that are not UUIDs
    expect(await personalWorkspaceId("alice@example.com")).toBe(
      "personal-ff8d9819fc0e12bf0d24892e45987e24",
    );
    expect(await personalWorkspaceId("auth0|123")).toMatch(
      /^personal-[0-9a-f]{32}$/,
    );
    expect(await personalWorkspaceId("auth0|123")).not.toBe(
      await personalWorkspaceId("auth0|124"),
    );
  });
});
