import type { DocumentLogo } from "../documentBranding";

interface DocumentBannerLogoProps {
  logo: DocumentLogo;
  /** Tailwind size classes for the logo box (e.g. "h-12 w-12") */
  size?: string;
}

/**
 * Logo drawn on a document's gradient header banner. An uploaded logo is drawn
 * full color on a white chip so its brand colors stay visible; without one the
 * company's initial is drawn as a monogram, and with no company name nothing is
 * drawn
 */
const DocumentBannerLogo = ({
  logo,
  size = "h-12 w-12",
}: DocumentBannerLogoProps) => {
  if (logo.src) {
    return (
      <div
        className={`flex ${size} shrink-0 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm`}
      >
        <img
          src={logo.src}
          alt={logo.alt}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  if (!logo.initial) return null;

  return (
    <div
      role="img"
      aria-label={logo.alt}
      className={`flex ${size} shrink-0 items-center justify-center rounded-lg bg-white/20 text-xl font-bold text-white ring-1 ring-white/30`}
    >
      {logo.initial}
    </div>
  );
};

export default DocumentBannerLogo;
