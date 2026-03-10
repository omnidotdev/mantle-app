import { describe, expect, it } from "bun:test";

import { generateQuoteNumber } from "./quoteStore";

describe("generateQuoteNumber", () => {
  it("should return QT-0001 for an empty list", () => {
    expect(generateQuoteNumber([])).toBe("QT-0001");
  });

  it("should return the next sequential number", () => {
    const quotes = [{ quoteNumber: "QT-0001" }, { quoteNumber: "QT-0002" }];
    expect(generateQuoteNumber(quotes)).toBe("QT-0003");
  });

  it("should find the max regardless of order", () => {
    const quotes = [
      { quoteNumber: "QT-0010" },
      { quoteNumber: "QT-0003" },
      { quoteNumber: "QT-0007" },
    ];
    expect(generateQuoteNumber(quotes)).toBe("QT-0011");
  });

  it("should ignore non-matching quote numbers", () => {
    const quotes = [
      { quoteNumber: "QT-0005" },
      { quoteNumber: "FC6CC7694" },
      { quoteNumber: "CUSTOM" },
    ];
    expect(generateQuoteNumber(quotes)).toBe("QT-0006");
  });

  it("should pad numbers to 4 digits", () => {
    expect(generateQuoteNumber([{ quoteNumber: "QT-0001" }])).toBe("QT-0002");
  });

  it("should handle numbers beyond 4 digits", () => {
    expect(generateQuoteNumber([{ quoteNumber: "QT-9999" }])).toBe("QT-10000");
  });

  it("should return QT-0001 when all entries are non-standard", () => {
    const quotes = [{ quoteNumber: "ABC-123" }, { quoteNumber: "quote1" }];
    expect(generateQuoteNumber(quotes)).toBe("QT-0001");
  });
});
