import type { OrganizationProfile } from "./types";

/** Bundled default logo, shown when an organization has not set its own */
const DEFAULT_LOGO_SRC = "/omni-logo.svg";

interface DocumentLogo {
  src: string;
  alt: string;
  /**
   * Whether the logo is a custom one from the profile (vs the bundled default).
   * The default is a white-knockout asset drawn tinted directly on the gradient
   * banner; a custom logo is drawn full color on a white chip so any brand color
   * stays visible
   */
  isCustom: boolean;
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
    isCustom: !!logoUrl,
  };
};

export type { DocumentLogo };
export { DEFAULT_LOGO_SRC, resolveDocumentLogo };
