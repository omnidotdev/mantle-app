import { describe, expect, it } from "bun:test";

import { canConvertQuote, findSourceQuote } from "./convertToInvoice";

describe("canConvertQuote", () => {
  it("allows sent and accepted quotes", () => {
    expect(canConvertQuote({ status: "sent", convertedInvoiceId: null })).toBe(
      true,
    );
    expect(
      canConvertQuote({ status: "accepted", convertedInvoiceId: null }),
    ).toBe(true);
  });

  it("rejects drafts, declined, and expired quotes", () => {
    for (const status of ["draft", "declined", "expired"] as const) {
      expect(canConvertQuote({ status, convertedInvoiceId: null })).toBe(false);
    }
  });

  it("rejects a quote already linked to an invoice", () => {
    expect(
      canConvertQuote({ status: "accepted", convertedInvoiceId: "inv-1" }),
    ).toBe(false);
    expect(
      canConvertQuote({ status: "converted", convertedInvoiceId: "inv-1" }),
    ).toBe(false);
  });
});

describe("findSourceQuote", () => {
  it("finds the quote linked to an invoice", () => {
    const quotes = [
      { id: "q1", convertedInvoiceId: null },
      { id: "q2", convertedInvoiceId: "inv-1" },
    ];
    expect(findSourceQuote(quotes, "inv-1")?.id).toBe("q2");
    expect(findSourceQuote(quotes, "inv-2")).toBeUndefined();
  });
});
