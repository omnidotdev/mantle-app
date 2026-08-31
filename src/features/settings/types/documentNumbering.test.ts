import { describe, expect, it } from "bun:test";

import { formatPreview } from "./documentNumbering";

describe("formatPreview", () => {
  it("should format sequential with prefix and no date", () => {
    expect(
      formatPreview({
        prefix: "INV",
        separator: "-",
        dateFormat: null,
        idStrategy: "sequential",
        sequentialPadding: 4,
        randomLength: 8,
      }),
    ).toBe("INV-0001");
  });

  it("should format sequential with prefix and year", () => {
    const result = formatPreview({
      prefix: "INV",
      separator: "-",
      dateFormat: "YYYY",
      idStrategy: "sequential",
      sequentialPadding: 4,
      randomLength: 8,
    });
    expect(result).toMatch(/^INV-\d{4}-0001$/);
  });

  it("should format random with prefix", () => {
    const result = formatPreview({
      prefix: "QT",
      separator: "-",
      dateFormat: null,
      idStrategy: "random",
      sequentialPadding: 4,
      randomLength: 8,
    });
    expect(result).toMatch(/^QT-[A-F0-9]{8}$/);
  });

  it("should format with no prefix", () => {
    const result = formatPreview({
      prefix: "",
      separator: "-",
      dateFormat: null,
      idStrategy: "random",
      sequentialPadding: 4,
      randomLength: 8,
    });
    expect(result).toMatch(/^[A-F0-9]{8}$/);
  });

  it("should format timestamp with prefix", () => {
    expect(
      formatPreview({
        prefix: "INV",
        separator: "-",
        dateFormat: null,
        idStrategy: "timestamp",
        sequentialPadding: 4,
        randomLength: 8,
      }),
    ).toBe("INV-20260203-115447");
  });

  it("should format with slash separator", () => {
    const result = formatPreview({
      prefix: "QT",
      separator: "/",
      dateFormat: "YYYY",
      idStrategy: "random",
      sequentialPadding: 4,
      randomLength: 6,
    });
    expect(result).toMatch(/^QT\/\d{4}\/[A-F0-9]{6}$/);
  });

  it("should format with no separator", () => {
    const result = formatPreview({
      prefix: "INV",
      separator: "",
      dateFormat: null,
      idStrategy: "sequential",
      sequentialPadding: 4,
      randomLength: 8,
    });
    expect(result).toBe("INV0001");
  });

  it("should format YYMM date segment", () => {
    const result = formatPreview({
      prefix: "INV",
      separator: "-",
      dateFormat: "YYMM",
      idStrategy: "sequential",
      sequentialPadding: 4,
      randomLength: 8,
    });
    expect(result).toMatch(/^INV-\d{4}-0001$/);
  });

  it("should format YYYYMM date segment", () => {
    const result = formatPreview({
      prefix: "INV",
      separator: "-",
      dateFormat: "YYYYMM",
      idStrategy: "sequential",
      sequentialPadding: 4,
      randomLength: 8,
    });
    expect(result).toMatch(/^INV-\d{6}-0001$/);
  });
});
