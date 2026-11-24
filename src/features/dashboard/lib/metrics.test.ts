import { describe, expect, it } from "bun:test";

import {
  addDays,
  addMonths,
  balanceDue,
  daysBetween,
  expiringQuotes,
  formatShortDate,
  formatWholeCurrency,
  invoicedPerMonth,
  isOverdue,
  lastMonths,
  lowStockProducts,
  openQuotesSummary,
  outstandingSummary,
  overdueInvoices,
  paidInMonth,
  percentChange,
  pluralize,
  primaryCurrency,
  toDateKey,
} from "./metrics";

import type { DashboardInvoice } from "./metrics";

const invoice = (overrides: Partial<DashboardInvoice>): DashboardInvoice => ({
  status: "sent",
  issueDate: "2026-11-01",
  dueDate: "2026-12-01",
  total: "100.00",
  payments: [],
  ...overrides,
});

describe("date keys", () => {
  it("should format a local date as YYYY-MM-DD", () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("should shift months across year boundaries", () => {
    expect(addMonths("2026-11", -11)).toBe("2025-12");
    expect(addMonths("2026-11", 2)).toBe("2027-01");
  });

  it("should shift days and count days between keys", () => {
    expect(addDays("2026-11-28", 7)).toBe("2026-12-05");
    expect(daysBetween("2026-11-18", "2026-11-23")).toBe(5);
    expect(daysBetween("2026-11-23", "2026-11-18")).toBe(-5);
  });

  it("should format a short date from a key or timestamp", () => {
    expect(formatShortDate("2026-12-18")).toBe("Dec 18, 2026");
    expect(formatShortDate("2026-12-18T00:00:00.000Z")).toBe("Dec 18, 2026");
  });
});

describe("lastMonths", () => {
  it("should return the trailing months oldest first", () => {
    const months = lastMonths("2026-11-23", 6);

    expect(months.map((m) => m.key)).toEqual([
      "2026-06",
      "2026-07",
      "2026-08",
      "2026-09",
      "2026-10",
      "2026-11",
    ]);
    expect(months[5]?.label).toBe("Nov");
    expect(months[5]?.longLabel).toBe("November 2026");
  });
});

describe("invoicedPerMonth", () => {
  it("should sum totals by issue month and skip drafts and void", () => {
    const buckets = invoicedPerMonth(
      [
        invoice({ issueDate: "2026-11-02", total: "100.10" }),
        invoice({ issueDate: "2026-11-20", total: "200.20", status: "paid" }),
        invoice({ issueDate: "2026-10-15", total: "50" }),
        invoice({ issueDate: "2026-11-03", total: "999", status: "draft" }),
        invoice({ issueDate: "2026-11-04", total: "999", status: "void" }),
        invoice({ issueDate: "2026-01-04", total: "999" }),
      ],
      "2026-11-23",
    );

    expect(buckets).toHaveLength(6);
    expect(buckets[5]?.total).toBe(300.3);
    expect(buckets[4]?.total).toBe(50);
    expect(buckets[0]?.total).toBe(0);
  });
});

describe("balances", () => {
  it("should subtract payments and applied credit", () => {
    expect(
      balanceDue(
        invoice({
          total: "100",
          payments: [{ amount: "30", paidAt: "2026-11-02" }],
          appliedCredit: 20,
        }),
      ),
    ).toBe(50);
  });

  it("should summarize open balances for sent, viewed, and overdue only", () => {
    expect(
      outstandingSummary([
        invoice({ status: "sent", total: "100" }),
        invoice({
          status: "viewed",
          total: "200",
          payments: [{ amount: "50", paidAt: "2026-11-01" }],
        }),
        invoice({ status: "overdue", total: "25" }),
        invoice({ status: "draft", total: "999" }),
        invoice({ status: "paid", total: "999" }),
        invoice({ status: "void", total: "999" }),
        // fully paid but still marked sent, so nothing is owed
        invoice({
          status: "sent",
          total: "10",
          payments: [{ amount: "10", paidAt: "2026-11-01" }],
        }),
      ]),
    ).toEqual({ amount: 275, count: 3 });
  });
});

describe("overdue", () => {
  const today = "2026-11-23";

  it("should treat marked overdue and sent past due as overdue", () => {
    expect(isOverdue(invoice({ status: "overdue" }), today)).toBe(true);
    expect(isOverdue(invoice({ dueDate: "2026-11-22" }), today)).toBe(true);
    expect(isOverdue(invoice({ dueDate: "2026-11-23" }), today)).toBe(false);
    expect(
      isOverdue(invoice({ status: "draft", dueDate: "2026-01-01" }), today),
    ).toBe(false);
    expect(isOverdue(invoice({ dueDate: null }), today)).toBe(false);
  });

  it("should list overdue invoices most overdue first", () => {
    const result = overdueInvoices(
      [
        invoice({ dueDate: "2026-11-20", total: "10" }),
        invoice({ dueDate: "2026-11-01", total: "20" }),
        invoice({ status: "overdue", dueDate: "2026-12-30", total: "30" }),
        invoice({ dueDate: "2026-12-30" }),
      ],
      today,
    );

    expect(result.map((r) => r.daysOverdue)).toEqual([22, 3, null]);
    expect(result.map((r) => r.balance)).toEqual([20, 10, 30]);
  });
});

describe("paidInMonth", () => {
  it("should sum payments by payment date and skip void invoices", () => {
    const invoices = [
      invoice({
        status: "paid",
        payments: [
          { amount: "40", paidAt: "2026-11-02T00:00:00.000Z" },
          { amount: "60", paidAt: "2026-10-30" },
        ],
      }),
      invoice({ payments: [{ amount: "15.5", paidAt: "2026-11-20" }] }),
      invoice({
        status: "void",
        payments: [{ amount: "999", paidAt: "2026-11-20" }],
      }),
    ];

    expect(paidInMonth(invoices, "2026-11")).toEqual({
      amount: 55.5,
      count: 2,
    });
    expect(paidInMonth(invoices, "2026-10")).toEqual({ amount: 60, count: 1 });
  });

  it("should compute a whole-percent change only with a base", () => {
    expect(percentChange(112, 100)).toBe(12);
    expect(percentChange(50, 100)).toBe(-50);
    expect(percentChange(50, 0)).toBeNull();
  });
});

describe("quotes", () => {
  it("should summarize sent quotes as open", () => {
    expect(
      openQuotesSummary([
        { status: "sent", total: "100" },
        { status: "sent", total: "50.25" },
        { status: "draft", total: "999" },
        { status: "accepted", total: "999" },
      ]),
    ).toEqual({ amount: 150.25, count: 2 });
  });

  it("should list sent quotes expiring within the window, soonest first", () => {
    const result = expiringQuotes(
      [
        { status: "sent", validUntil: "2026-11-30", total: "1" },
        { status: "sent", validUntil: "2026-11-23", total: "2" },
        { status: "sent", validUntil: "2026-12-01", total: "3" },
        { status: "sent", validUntil: "2026-11-22", total: "4" },
        { status: "draft", validUntil: "2026-11-24", total: "5" },
      ],
      "2026-11-23",
    );

    expect(result.map((r) => [r.quote.total, r.daysLeft])).toEqual([
      ["2", 0],
      ["1", 7],
    ]);
  });
});

describe("lowStockProducts", () => {
  it("should keep active products at or below their threshold", () => {
    const products = [
      { currentQuantity: 3, lowStockThreshold: 5, isActive: true },
      { currentQuantity: 5, lowStockThreshold: 5, isActive: true },
      { currentQuantity: 6, lowStockThreshold: 5, isActive: true },
      { currentQuantity: 0, lowStockThreshold: null, isActive: true },
      { currentQuantity: 0, lowStockThreshold: 5, isActive: false },
    ];

    expect(lowStockProducts(products)).toHaveLength(2);
  });
});

describe("formatting", () => {
  it("should format whole currency without cents", () => {
    expect(formatWholeCurrency(32180.4)).toBe("$32,180");
    expect(formatWholeCurrency(0)).toBe("$0");
  });

  it("should pick the most common currency, defaulting to USD", () => {
    expect(primaryCurrency(["EUR", "USD", "EUR", null])).toBe("EUR");
    expect(primaryCurrency([])).toBe("USD");
  });

  it("should pluralize counts", () => {
    expect(pluralize(1, "invoice")).toBe("1 invoice");
    expect(pluralize(3, "invoice")).toBe("3 invoices");
    expect(pluralize(2, "company", "companies")).toBe("2 companies");
  });
});
