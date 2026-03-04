/** Default invoice accent color (Omni teal-600) */
const DEFAULT_ACCENT = "#0d9488";

const ACCENT_PRESETS = [
  { label: "Omni Teal", value: "#0d9488" },
  { label: "Volcanic", value: "#c2612e" },
  { label: "Navy", value: "#1e40af" },
  { label: "Forest", value: "#166534" },
  { label: "Slate", value: "#475569" },
  { label: "Purple", value: "#7c3aed" },
] as const;

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((x) =>
      Math.round(Math.max(0, Math.min(255, x)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;

const mixWithWhite = (hex: string, whiteness: number) => {
  const { r, g, b } = hexToRgb(hex);

  return rgbToHex(
    r + (255 - r) * whiteness,
    g + (255 - g) * whiteness,
    b + (255 - b) * whiteness,
  );
};

const darken = (hex: string, factor: number) => {
  const { r, g, b } = hexToRgb(hex);

  return rgbToHex(r * factor, g * factor, b * factor);
};

/** Compute color variants from a single accent hex */
const getAccentVariants = (accent: string) => ({
  /** Gradient start (darker, like teal-700) */
  gradientFrom: darken(accent, 0.8),
  /** Gradient end (lighter, like teal-500) */
  gradientTo: mixWithWhite(accent, 0.2),
  /** Table header background */
  base: accent,
  /** Totals box background (very light tint, like teal-100) */
  light: mixWithWhite(accent, 0.85),
  /** Subtitle text on dark background */
  subtleText: mixWithWhite(accent, 0.7),
});

export { ACCENT_PRESETS, DEFAULT_ACCENT, getAccentVariants };
