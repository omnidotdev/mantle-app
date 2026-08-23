import type { OrganizationProfile } from "./types";

/** Bundled default logo, shown when an organization has not set its own */
const DEFAULT_LOGO_SRC = "/omni-logo.svg";

interface DocumentLogo {
  src: string;
  alt: string;
}

/**
 * Resolve the logo shown on generated documents (quotes, contracts, invoices)
 * from the organization profile, falling back to the bundled default
 */
const resolveDocumentLogo = (
  orgProfile: OrganizationProfile | undefined,
): DocumentLogo => {
  const logoUrl = orgProfile?.logoUrl?.trim();
  const companyName = orgProfile?.companyName?.trim();

  return {
    src: logoUrl || DEFAULT_LOGO_SRC,
    alt: companyName ? `${companyName} logo` : "Company logo",
  };
};

export { DEFAULT_LOGO_SRC, resolveDocumentLogo };
export type { DocumentLogo };
