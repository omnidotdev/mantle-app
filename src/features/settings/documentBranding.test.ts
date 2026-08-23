import { describe, expect, it } from "bun:test";

import { DEFAULT_LOGO_SRC, resolveDocumentLogo } from "./documentBranding";

import type { OrganizationProfile } from "./types";

const profile = (
  overrides: Partial<OrganizationProfile>,
): OrganizationProfile =>
  ({
    id: "1",
    organizationId: "org",
    companyName: "",
    contactName: "",
    contactTitle: null,
    email: "",
    phone: null,
    website: null,
    addressLine1: null,
    addressLine2: null,
    city: null,
    state: null,
    postalCode: null,
    country: null,
    logoUrl: null,
    registrationState: null,
    accentColor: null,
    createdAt: "",
    updatedAt: "",
    ...overrides,
  }) satisfies OrganizationProfile;

describe("resolveDocumentLogo", () => {
  it("falls back to the bundled default when no profile is set", () => {
    expect(resolveDocumentLogo(undefined)).toEqual({
      src: DEFAULT_LOGO_SRC,
      alt: "Company logo",
      isCustom: false,
    });
  });

  it("uses the profile logo url and company name when set", () => {
    expect(
      resolveDocumentLogo(
        profile({ logoUrl: "https://acme.test/logo.svg", companyName: "Acme" }),
      ),
    ).toEqual({
      src: "https://acme.test/logo.svg",
      alt: "Acme logo",
      isCustom: true,
    });
  });

  it("falls back to the default logo when the url is blank whitespace", () => {
    expect(
      resolveDocumentLogo(profile({ logoUrl: "   ", companyName: "Acme" })).src,
    ).toBe(DEFAULT_LOGO_SRC);
  });

  it("names the alt after the company even without a custom logo", () => {
    expect(resolveDocumentLogo(profile({ companyName: "Omni LLC" }))).toEqual({
      src: DEFAULT_LOGO_SRC,
      alt: "Omni LLC logo",
      isCustom: false,
    });
  });
});
