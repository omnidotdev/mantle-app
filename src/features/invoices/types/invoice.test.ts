import { describe, expect, it } from "bun:test";

import {
  appliedCredit,
  creditBalance,
  derivePaidFields,
  formatCurrency,
  formatDate,
  invoiceBalance,
  isPaidInFull,
  paidInFullDate,
  sumCredits,
  sumPayments,
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

describe("toPaidAtTimestamp", () => {
  it("should convert a calendar date to a midnight-UTC timestamp", () => {
    expect(toPaidAtTimestamp("2026-08-31")).toBe("2026-08-31T00:00:00.000Z");
  });

  it("should return null for an empty date string", () => {
    expect(toPaidAtTimestamp("")).toBeNull();
  });
});

const twoPayments = [
  { amount: "4500", paidAt: "2026-08-05" },
  { amount: "4500", paidAt: "2026-08-20" },
];

describe("sumPayments", () => {
  it("should total the payment amounts", () => {
    expect(sumPayments(twoPayments)).toBe(9000);
  });

  it("should return 0 for no payments", () => {
    expect(sumPayments([])).toBe(0);
  });

  it("should ignore non-numeric amounts", () => {
    expect(sumPayments([{ amount: "" }, { amount: "50" }])).toBe(50);
  });
});

describe("invoiceBalance", () => {
  it("should be zero when payments cover the total", () => {
    expect(invoiceBalance("9000", twoPayments)).toBe(0);
  });

  it("should be the outstanding amount when partially paid", () => {
    expect(invoiceBalance("9000", [twoPayments[0]])).toBe(4500);
  });

  it("should equal the total when there are no payments", () => {
    expect(invoiceBalance("9000", [])).toBe(9000);
  });

  it("should subtract applied credit from the balance", () => {
    expect(invoiceBalance("100", [], 30)).toBe(70);
  });

  it("should combine payments and applied credit", () => {
    expect(invoiceBalance("100", [{ amount: "60" }], 40)).toBe(0);
  });
});

describe("sumCredits", () => {
  it("should sign-sum credit amounts (positive add, negative draw down)", () => {
    expect(
      sumCredits([{ amount: "100" }, { amount: "-40" }, { amount: "25" }]),
    ).toBe(85);
  });

  it("should return 0 for no credits", () => {
    expect(sumCredits([])).toBe(0);
  });

  it("should ignore non-numeric amounts", () => {
    expect(sumCredits([{ amount: "" }, { amount: "10" }])).toBe(10);
  });
});

const creditRows = [
  { amount: "100", kind: "overpayment", currency: "USD", invoiceId: null },
  { amount: "-40", kind: "application", currency: "USD", invoiceId: "inv-1" },
  { amount: "50", kind: "creditNote", currency: "EUR", invoiceId: null },
  { amount: "-20", kind: "application", currency: "USD", invoiceId: "inv-2" },
] as const;

describe("creditBalance", () => {
  it("should sum only transactions in the given currency", () => {
    expect(creditBalance(creditRows, "USD")).toBe(40);
  });

  it("should isolate a different currency", () => {
    expect(creditBalance(creditRows, "EUR")).toBe(50);
  });

  it("should be zero when no transactions match the currency", () => {
    expect(creditBalance(creditRows, "GBP")).toBe(0);
  });
});

describe("appliedCredit", () => {
  it("should return the positive amount applied to an invoice", () => {
    expect(appliedCredit(creditRows, "inv-1")).toBe(40);
  });

  it("should only count application rows for the given invoice", () => {
    expect(appliedCredit(creditRows, "inv-2")).toBe(20);
  });

  it("should be zero when no credit was applied to the invoice", () => {
    expect(appliedCredit(creditRows, "inv-3")).toBe(0);
  });
});

describe("isPaidInFull", () => {
  it("should be true when payments meet the total", () => {
    expect(isPaidInFull("9000", twoPayments)).toBe(true);
  });

  it("should be false when only partially paid", () => {
    expect(isPaidInFull("9000", [twoPayments[0]])).toBe(false);
  });

  it("should be false with no payments", () => {
    expect(isPaidInFull("9000", [])).toBe(false);
  });

  it("should be false for a zero-total invoice", () => {
    expect(isPaidInFull("0", [])).toBe(false);
  });

  it("should handle fractional cents without float drift", () => {
    const thirds = [
      { amount: "33.34" },
      { amount: "33.33" },
      { amount: "33.33" },
    ];
    expect(isPaidInFull("100.00", thirds)).toBe(true);
  });

  it("should be true when payments plus applied credit cover the total", () => {
    expect(isPaidInFull("100", [{ amount: "60" }], 40)).toBe(true);
  });

  it("should be false when applied credit alone does not cover the total", () => {
    expect(isPaidInFull("100", [], 30)).toBe(false);
  });
});

describe("paidInFullDate", () => {
  it("should return the latest payment date once fully paid", () => {
    expect(paidInFullDate("9000", twoPayments)).toBe("2026-08-20");
  });

  it("should return null when not yet fully paid", () => {
    expect(paidInFullDate("9000", [twoPayments[0]])).toBeNull();
  });
});

describe("derivePaidFields", () => {
  it("should mark paid with the settlement date when fully paid", () => {
    expect(derivePaidFields("9000", "sent", twoPayments)).toEqual({
      status: "paid",
      paidAt: "2026-08-20T00:00:00.000Z",
    });
  });

  it("should leave status and clear paidAt when partially paid", () => {
    expect(derivePaidFields("9000", "sent", [twoPayments[0]])).toEqual({
      status: "sent",
      paidAt: null,
    });
  });

  it("should downgrade a stale paid status when payments no longer cover the total", () => {
    expect(derivePaidFields("9000", "paid", [twoPayments[0]])).toEqual({
      status: "sent",
      paidAt: null,
    });
  });

  it("should mark paid when payments plus applied credit cover the total", () => {
    expect(derivePaidFields("9000", "sent", [twoPayments[0]], 4500)).toEqual({
      status: "paid",
      paidAt: "2026-08-05T00:00:00.000Z",
    });
  });

  it("should mark paid with no settlement date when credit alone settles it", () => {
    expect(derivePaidFields("100", "sent", [], 100)).toEqual({
      status: "paid",
      paidAt: null,
    });
  });
});
