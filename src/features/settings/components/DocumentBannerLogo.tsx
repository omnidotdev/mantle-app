import type { DocumentLogo } from "../documentBranding";

interface DocumentBannerLogoProps {
  logo: DocumentLogo;
  /** Tailwind size classes for the logo box (e.g. "h-12 w-12") */
  size?: string;
}

/**
 * Logo drawn on a document's gradient header banner. The bundled default is a
 * white-knockout asset, so it is tinted white directly on the gradient; a custom
 * uploaded logo is drawn full color on a white chip so its brand colors stay visible
 */
const DocumentBannerLogo = ({
  logo,
  size = "h-12 w-12",
}: DocumentBannerLogoProps) => {
  if (logo.isCustom) {
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

  return (
    <img
      src={logo.src}
      alt={logo.alt}
      className={`${size} object-contain`}
      style={{ filter: "brightness(0) invert(1)" }}
    />
  );
};

export default DocumentBannerLogo;
