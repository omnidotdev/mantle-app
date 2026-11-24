import { describe, expect, it } from "bun:test";

import {
  canConvertQuote,
  findSourceQuote,
  quoteToInvoiceDraft,
} from "./convertToInvoice";

import type { QuoteLineItem } from "../types/quote";

const baseQuote = {
  companyId: "company-1",
  contactId: "person-1",
  clientName: null,
  clientEmail: null,
  notes: "Thanks for your business",
  currency: "EUR",
  taxRate: "10",
  company: { name: "Acme" },
  contact: { firstName: "Ada", lastName: "Lovelace" },
};

const line = (
  overrides: Partial<QuoteLineItem>,
): Pick<
  QuoteLineItem,
  | "id"
  | "description"
  | "quantity"
  | "unitPrice"
  | "amount"
  | "pricingType"
  | "hourlyRate"
  | "estimatedHours"
  | "productId"
> => ({
  id: crypto.randomUUID(),
  description: "Work",
  quantity: "1",
  unitPrice: "0",
  amount: "0",
  pricingType: "fixed",
  hourlyRate: null,
  estimatedHours: null,
  productId: null,
  ...overrides,
});

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

describe("quoteToInvoiceDraft", () => {
  it("carries the client, currency, tax rate, and notes", () => {
    const { invoice } = quoteToInvoiceDraft(baseQuote, []);
    expect(invoice.companyId).toBe("company-1");
    expect(invoice.contactId).toBe("person-1");
    expect(invoice.currency).toBe("EUR");
    expect(invoice.taxRate).toBe("10");
    expect(invoice.notes).toBe("Thanks for your business");
    expect(invoice.billTo).toBe("Ada Lovelace\nAcme");
  });

  it("falls back to the free-text client name and email for bill-to", () => {
    const { invoice } = quoteToInvoiceDraft(
      {
        ...baseQuote,
        companyId: null,
        contactId: null,
        company: null,
        contact: null,
        clientName: "Jane Doe",
        clientEmail: "jane@example.com",
      },
      [],
    );
    expect(invoice.companyId).toBeNull();
    expect(invoice.billTo).toBe("Jane Doe\njane@example.com");
  });

  it("keeps fixed lines as quoted and totals with tax", () => {
    const { invoice, lineItems } = quoteToInvoiceDraft(baseQuote, [
      line({ description: "Build", quantity: "2", unitPrice: "1500" }),
    ]);
    expect(lineItems).toEqual([
      {
        description: "Build",
        quantity: "2",
        unitPrice: "1500.00",
        amount: "3000.00",
        productId: null,
        sortOrder: 0,
      },
    ]);
    expect(invoice.subtotal).toBe("3000.00");
    expect(invoice.taxAmount).toBe("300.00");
    expect(invoice.total).toBe("3300.00");
  });

  it("bills hourly lines as estimated hours at the hourly rate", () => {
    const { lineItems } = quoteToInvoiceDraft(baseQuote, [
      line({
        description: "Support",
        pricingType: "hourly",
        hourlyRate: "150",
        estimatedHours: "12.5",
      }),
    ]);
    expect(lineItems[0]).toMatchObject({
      description: "Support (hourly)",
      quantity: "12.5",
      unitPrice: "150.00",
      amount: "1875.00",
    });
  });

  it("bills hourly lines without an estimate at 0 hours", () => {
    const { lineItems } = quoteToInvoiceDraft(baseQuote, [
      line({ pricingType: "hourly", hourlyRate: "100" }),
    ]);
    expect(lineItems[0]).toMatchObject({
      quantity: "0",
      unitPrice: "100.00",
      amount: "0.00",
    });
  });

  it("treats hourly lines with no rate as quantity times unit price", () => {
    const { lineItems } = quoteToInvoiceDraft(baseQuote, [
      line({ pricingType: "hourly", quantity: "3", unitPrice: "40" }),
    ]);
    expect(lineItems[0]).toMatchObject({
      description: "Work",
      amount: "120.00",
    });
  });

  it("lists complimentary and included lines at no charge", () => {
    const { lineItems } = quoteToInvoiceDraft(baseQuote, [
      line({
        description: "Hosting setup",
        pricingType: "complimentary",
        unitPrice: "200",
      }),
      line({ description: "Support", pricingType: "included" }),
    ]);
    expect(lineItems.map((li) => [li.description, li.amount])).toEqual([
      ["Hosting setup (complimentary)", "0.00"],
      ["Support (included)", "0.00"],
    ]);
  });

  it("skips royalty lines with no fixed amount and reports them", () => {
    const royalty = line({
      description: "Revenue share",
      pricingType: "royalty",
    });
    const { lineItems, skipped } = quoteToInvoiceDraft(baseQuote, [
      line({ description: "Build", unitPrice: "100" }),
      royalty,
    ]);
    expect(lineItems).toHaveLength(1);
    expect(skipped).toEqual([
      { id: royalty.id, description: "Revenue share", pricingType: "royalty" },
    ]);
  });

  it("bills royalty lines that carry a fixed amount", () => {
    const { lineItems, skipped } = quoteToInvoiceDraft(baseQuote, [
      line({
        pricingType: "royalty",
        quantity: "1",
        unitPrice: "500",
        amount: "500",
      }),
    ]);
    expect(lineItems[0]?.amount).toBe("500.00");
    expect(skipped).toHaveLength(0);
  });

  it("drops blank lines and renumbers sort order", () => {
    const { lineItems, skipped } = quoteToInvoiceDraft(baseQuote, [
      line({ description: "  " }),
      line({ description: "First" }),
      line({ description: "Second" }),
    ]);
    expect(lineItems.map((li) => [li.description, li.sortOrder])).toEqual([
      ["First", 0],
      ["Second", 1],
    ]);
    expect(skipped).toHaveLength(0);
  });

  it("defaults a blank quantity to 1 and passes the product through", () => {
    const { lineItems } = quoteToInvoiceDraft(baseQuote, [
      line({ quantity: "", unitPrice: "9.99", productId: "product-1" }),
    ]);
    expect(lineItems[0]).toMatchObject({
      quantity: "1",
      amount: "9.99",
      productId: "product-1",
    });
  });

  it("rounds amounts to whole cents", () => {
    const { invoice, lineItems } = quoteToInvoiceDraft(
      { ...baseQuote, taxRate: "7.25" },
      [line({ quantity: "3", unitPrice: "0.1" })],
    );
    expect(lineItems[0]?.amount).toBe("0.30");
    expect(invoice.taxAmount).toBe("0.02");
    expect(invoice.total).toBe("0.32");
  });

  it("nulls a blank tax rate and notes", () => {
    const { invoice } = quoteToInvoiceDraft(
      { ...baseQuote, taxRate: "", notes: "  " },
      [],
    );
    expect(invoice.taxRate).toBeNull();
    expect(invoice.notes).toBeNull();
    expect(invoice.total).toBe("0.00");
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
