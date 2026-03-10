import { describe, expect, it } from "bun:test";

import {
  ACCENT_PRESETS,
  DEFAULT_ACCENT,
  getAccentVariants,
} from "./accentColor";

describe("accentColor", () => {
  describe("DEFAULT_ACCENT", () => {
    it("should be a valid hex color", () => {
      expect(DEFAULT_ACCENT).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  describe("ACCENT_PRESETS", () => {
    it("should contain at least one preset", () => {
      expect(ACCENT_PRESETS.length).toBeGreaterThan(0);
    });

    it("should have valid hex values for all presets", () => {
      for (const preset of ACCENT_PRESETS) {
        expect(preset.value).toMatch(/^#[0-9a-f]{6}$/i);
        expect(preset.label).toBeTruthy();
      }
    });

    it("should include the default accent", () => {
      const values = ACCENT_PRESETS.map((p) => p.value);
      expect(values).toContain(DEFAULT_ACCENT);
    });
  });

  describe("getAccentVariants", () => {
    it("should return all expected variant keys", () => {
      const variants = getAccentVariants("#0d9488");
      expect(variants).toHaveProperty("gradientFrom");
      expect(variants).toHaveProperty("gradientTo");
      expect(variants).toHaveProperty("base");
      expect(variants).toHaveProperty("light");
      expect(variants).toHaveProperty("subtleText");
    });

    it("should return valid hex colors for all variants", () => {
      const variants = getAccentVariants("#0d9488");
      for (const value of Object.values(variants)) {
        expect(value).toMatch(/^#[0-9a-f]{6}$/i);
      }
    });

    it("should return the input color as the base", () => {
      const variants = getAccentVariants("#1e40af");
      expect(variants.base).toBe("#1e40af");
    });

    it("should produce a darker gradientFrom than the base", () => {
      const variants = getAccentVariants("#0d9488");
      const baseRgb = hexSum(variants.base);
      const fromRgb = hexSum(variants.gradientFrom);
      expect(fromRgb).toBeLessThan(baseRgb);
    });

    it("should produce a lighter light variant than the base", () => {
      const variants = getAccentVariants("#0d9488");
      const baseRgb = hexSum(variants.base);
      const lightRgb = hexSum(variants.light);
      expect(lightRgb).toBeGreaterThan(baseRgb);
    });

    it("should handle black input", () => {
      const variants = getAccentVariants("#000000");
      expect(variants.base).toBe("#000000");
      expect(variants.gradientFrom).toBe("#000000");
    });

    it("should handle white input", () => {
      const variants = getAccentVariants("#ffffff");
      expect(variants.base).toBe("#ffffff");
      expect(variants.light).toBe("#ffffff");
    });
  });
});

/** Sum RGB channels of a hex color (rough brightness proxy) */
const hexSum = (hex: string): number => {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return r + g + b;
};
