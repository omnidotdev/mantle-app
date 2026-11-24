import type { OrganizationProfile } from "./types";

interface DocumentLogo {
  /** Uploaded logo url from the profile, or null when none is set */
  src: string | null;
  alt: string;
  /**
   * First letter of the company name, drawn as a monogram when no logo is
   * uploaded. Null when there is no company name either, so the banner shows
   * no mark at all rather than someone else's brand
   */
  initial: string | null;
}

/**
 * Resolve the logo shown on generated documents (quotes, contracts, invoices)
 * from the organization profile. Without an uploaded logo the document falls
 * back to the company's initial, never to a bundled brand mark
 */
const resolveDocumentLogo = (
  orgProfile: OrganizationProfile | undefined,
): DocumentLogo => {
  const logoUrl = orgProfile?.logoUrl?.trim();
  const companyName = orgProfile?.companyName?.trim();

  return {
    src: logoUrl || null,
    alt: companyName ? `${companyName} logo` : "Company logo",
    initial: companyName ? ([...companyName][0]?.toUpperCase() ?? null) : null,
  };
};

export type { DocumentLogo };
export { resolveDocumentLogo };
