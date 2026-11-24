import { describe, expect, it } from "bun:test";

import { resolveDocumentLogo } from "./documentBranding";

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
  it("shows no mark when no profile is set", () => {
    expect(resolveDocumentLogo(undefined)).toEqual({
      src: null,
      alt: "Company logo",
      initial: null,
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
      initial: "A",
    });
  });

  it("treats a blank whitespace url as no logo", () => {
    expect(
      resolveDocumentLogo(profile({ logoUrl: "   ", companyName: "Acme" })).src,
    ).toBeNull();
  });

  it("falls back to the company initial, never a bundled brand mark", () => {
    expect(
      resolveDocumentLogo(profile({ companyName: " acme studio" })),
    ).toEqual({
      src: null,
      alt: "acme studio logo",
      initial: "A",
    });
  });
});
