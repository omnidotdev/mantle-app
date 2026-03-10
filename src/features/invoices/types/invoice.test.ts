import { describe, expect, it } from "bun:test";

import { formatCurrency, formatDate } from "./invoice";

describe("formatDate", () => {
  it("should format an ISO date string", () => {
    expect(formatDate("2025-02-11")).toBe("February 11, 2025");
  });

  it("should format a date at the start of the year", () => {
    expect(formatDate("2026-01-01")).toBe("January 1, 2026");
  });

  it("should format a date at the end of the year", () => {
    expect(formatDate("2025-12-31")).toBe("December 31, 2025");
  });
});

describe("formatCurrency", () => {
  it("should format a whole number amount", () => {
    expect(formatCurrency("1000")).toBe("$1,000.00");
  });

  it("should format a decimal amount", () => {
    expect(formatCurrency("49.99")).toBe("$49.99");
  });

  it("should format zero", () => {
    expect(formatCurrency("0")).toBe("$0.00");
  });

  it("should handle NaN input gracefully", () => {
    expect(formatCurrency("abc")).toBe("$0.00");
  });

  it("should handle empty string input", () => {
    expect(formatCurrency("")).toBe("$0.00");
  });

  it("should format with a different currency", () => {
    const result = formatCurrency("1000", "EUR");
    expect(result).toContain("1,000.00");
  });

  it("should format large numbers with commas", () => {
    expect(formatCurrency("1000000")).toBe("$1,000,000.00");
  });

  it("should format negative amounts", () => {
    const result = formatCurrency("-500");
    expect(result).toContain("500.00");
  });
});
