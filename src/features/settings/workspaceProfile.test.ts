import { describe, expect, test } from "bun:test";

import {
  fieldsOf,
  legacyProfileAction,
  toProfile,
} from "@/features/settings/workspaceProfile";

describe("legacyProfileAction", () => {
  test("pushes a browser-only profile once when the server has none", () => {
    expect(
      legacyProfileAction({
        serverHasProfile: false,
        hasLocalProfile: true,
        alreadyPushed: false,
      }),
    ).toBe("push");
    expect(
      legacyProfileAction({
        serverHasProfile: false,
        hasLocalProfile: true,
        alreadyPushed: true,
      }),
    ).toBe("none");
  });

  test("the server's profile wins over a browser copy", () => {
    expect(
      legacyProfileAction({
        serverHasProfile: true,
        hasLocalProfile: true,
        alreadyPushed: false,
      }),
    ).toBe("drop");
  });

  test("nothing to do without a browser copy", () => {
    expect(
      legacyProfileAction({
        serverHasProfile: false,
        hasLocalProfile: false,
        alreadyPushed: false,
      }),
    ).toBe("none");
  });
});

describe("profile mapping", () => {
  const node = {
    rowId: "r1",
    organizationId: "org",
    accentColor: "#123456",
    companyName: null,
    contactName: "Ada",
    contactTitle: null,
    email: null,
    phone: "+15550100",
    website: null,
    addressLine1: "1 Main St",
    addressLine2: null,
    city: null,
    state: null,
    postalCode: null,
    country: "US",
    logoUrl: null,
    registrationState: null,
    createdAt: null,
    updatedAt: null,
  };

  test("an unset required field reads as empty text, optional ones stay null", () => {
    const profile = toProfile(node);
    expect(profile.id).toBe("r1");
    expect(profile.companyName).toBe("");
    expect(profile.email).toBe("");
    expect(profile.contactName).toBe("Ada");
    expect(profile.website).toBeNull();
    expect(profile.accentColor).toBe("#123456");
  });

  test("only the editable fields are pushed from a browser copy", () => {
    const fields = fieldsOf(toProfile(node));
    expect(fields).not.toHaveProperty("id");
    expect(fields).not.toHaveProperty("organizationId");
    expect(fields).not.toHaveProperty("createdAt");
    expect(fields.addressLine1).toBe("1 Main St");
  });
});
