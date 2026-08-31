import { describe, expect, it } from "bun:test";

import {
  formatCurrency,
  formatDate,
  formatPaidDate,
  normalizePaidFields,
  paidDateInputValue,
  toPaidAtTimestamp,
} from "./invoice";

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

describe("paidDateInputValue", () => {
  it("should extract the calendar date from a paid-at timestamp", () => {
    expect(paidDateInputValue("2026-08-31T00:00:00.000Z")).toBe("2026-08-31");
  });

  it("should extract the date even when the timestamp carries a time", () => {
    expect(paidDateInputValue("2026-08-31T14:23:11.123Z")).toBe("2026-08-31");
  });

  it("should return an empty string when paidAt is null", () => {
    expect(paidDateInputValue(null)).toBe("");
  });
});

describe("toPaidAtTimestamp", () => {
  it("should convert a calendar date to a midnight-UTC timestamp", () => {
    expect(toPaidAtTimestamp("2026-08-31")).toBe("2026-08-31T00:00:00.000Z");
  });

  it("should return null for an empty date string", () => {
    expect(toPaidAtTimestamp("")).toBeNull();
  });

  it("should round-trip with paidDateInputValue", () => {
    const ts = toPaidAtTimestamp("2026-01-01");
    expect(paidDateInputValue(ts)).toBe("2026-01-01");
  });
});

describe("formatPaidDate", () => {
  it("should format a paid-at timestamp as a human-readable date", () => {
    expect(formatPaidDate("2026-08-31T00:00:00.000Z")).toBe("August 31, 2026");
  });

  it("should return an empty string when paidAt is null", () => {
    expect(formatPaidDate(null)).toBe("");
  });
});

describe("normalizePaidFields", () => {
  it("should default paidAt to today when status becomes paid and no date is set", () => {
    const result = normalizePaidFields(
      { status: "paid", paidAt: null, paymentReference: null },
      () => "2026-08-31T00:00:00.000Z",
    );
    expect(result.paidAt).toBe("2026-08-31T00:00:00.000Z");
  });

  it("should default paidAt to a clean date-only midnight timestamp", () => {
    const result = normalizePaidFields({
      status: "paid",
      paidAt: null,
      paymentReference: null,
    });
    expect(result.paidAt).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/);
  });

  it("should clear paid fields for a draft invoice", () => {
    const result = normalizePaidFields({
      status: "draft",
      paidAt: "2026-01-15T00:00:00.000Z",
      paymentReference: "CHK-1042",
    });
    expect(result.paidAt).toBeNull();
    expect(result.paymentReference).toBeNull();
  });

  it("should preserve an explicitly chosen paidAt when status is paid", () => {
    const result = normalizePaidFields(
      {
        status: "paid",
        paidAt: "2026-01-15T00:00:00.000Z",
        paymentReference: "CHK-1042",
      },
      () => "2026-08-31T00:00:00.000Z",
    );
    expect(result.paidAt).toBe("2026-01-15T00:00:00.000Z");
    expect(result.paymentReference).toBe("CHK-1042");
  });

  it("should clear paidAt and paymentReference when status is not paid", () => {
    const result = normalizePaidFields(
      {
        status: "sent",
        paidAt: "2026-01-15T00:00:00.000Z",
        paymentReference: "CHK-1042",
      },
      () => "2026-08-31T00:00:00.000Z",
    );
    expect(result.paidAt).toBeNull();
    expect(result.paymentReference).toBeNull();
  });

  it("should not mutate the input object", () => {
    const input = {
      status: "void" as const,
      paidAt: "2026-01-15T00:00:00.000Z",
      paymentReference: "CHK-1042",
    };
    normalizePaidFields(input, () => "2026-08-31T00:00:00.000Z");
    expect(input.paidAt).toBe("2026-01-15T00:00:00.000Z");
  });
});
