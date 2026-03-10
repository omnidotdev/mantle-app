import { describe, expect, it } from "bun:test";

import { generateInvoiceNumber } from "./invoiceStore";

describe("generateInvoiceNumber", () => {
  it("should return INV-0001 for an empty list", () => {
    expect(generateInvoiceNumber([])).toBe("INV-0001");
  });

  it("should return the next sequential number", () => {
    const invoices = [
      { invoiceNumber: "INV-0001" },
      { invoiceNumber: "INV-0002" },
      { invoiceNumber: "INV-0003" },
    ];
    expect(generateInvoiceNumber(invoices)).toBe("INV-0004");
  });

  it("should find the max regardless of order", () => {
    const invoices = [
      { invoiceNumber: "INV-0005" },
      { invoiceNumber: "INV-0002" },
      { invoiceNumber: "INV-0010" },
    ];
    expect(generateInvoiceNumber(invoices)).toBe("INV-0011");
  });

  it("should ignore non-matching invoice numbers", () => {
    const invoices = [
      { invoiceNumber: "INV-0003" },
      { invoiceNumber: "CUSTOM-001" },
      { invoiceNumber: "random" },
    ];
    expect(generateInvoiceNumber(invoices)).toBe("INV-0004");
  });

  it("should pad numbers to 4 digits", () => {
    const invoices = [{ invoiceNumber: "INV-0001" }];
    expect(generateInvoiceNumber(invoices)).toBe("INV-0002");
  });

  it("should handle numbers beyond 4 digits", () => {
    const invoices = [{ invoiceNumber: "INV-9999" }];
    expect(generateInvoiceNumber(invoices)).toBe("INV-10000");
  });
});
