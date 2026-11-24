import { describe, expect, it } from "bun:test";

import { createDemoRewrite, isDemoHref } from "./config";
import { resolveDemoOperation } from "./resolve";

const QUOTES =
  "query AllQuotes($organizationId: String!) { quotes { nodes { rowId } } }";
const INVOICES =
  "query AllInvoices($organizationId: String!) { invoices { nodes { rowId } } }";
const PRODUCTS =
  "query AllProducts($organizationId: String!) { products { nodes { rowId } } }";

type Quote = {
  rowId: string;
  quoteNumber: string;
  status: string;
  convertedInvoiceId: string | null;
};
type Invoice = {
  rowId: string;
  invoiceNumber: string;
  status: string;
  total: string;
  invoiceLineItems: { nodes: unknown[] };
  payments: { nodes: { amount: string }[] };
};
type Product = { rowId: string; sku: string; currentQuantity: number };

const quotes = async () =>
  (await resolveDemoOperation<{ quotes: { nodes: Quote[] } }>(QUOTES)).quotes
    .nodes;
const invoices = async () =>
  (await resolveDemoOperation<{ invoices: { nodes: Invoice[] } }>(INVOICES))
    .invoices.nodes;

describe("isDemoHref", () => {
  it("matches the demo and its pages only", () => {
    expect(isDemoHref("/demo")).toBe(true);
    expect(isDemoHref("/demo/quotes?status=all")).toBe(true);
    expect(isDemoHref("/demo?x=1")).toBe(true);
    expect(isDemoHref("/demonstration")).toBe(false);
    expect(isDemoHref("/@basalt")).toBe(false);
    expect(isDemoHref(undefined)).toBe(false);
  });
});

describe("createDemoRewrite", () => {
  it("maps demo URLs onto the sample workspace and back on the server", () => {
    const rewrite = createDemoRewrite();
    const input = rewrite.input?.({
      url: new URL("https://mantle.test/demo/quotes"),
    });
    expect(String(input)).toBe("https://mantle.test/@basalt/quotes");

    const output = rewrite.output?.({
      url: new URL("https://mantle.test/@basalt/invoices"),
    });
    expect(String(output)).toBe("https://mantle.test/demo/invoices");
  });

  it("leaves a real workspace's URLs alone", () => {
    const rewrite = createDemoRewrite();
    rewrite.input?.({ url: new URL("https://mantle.test/@basalt") });

    expect(
      rewrite.output?.({ url: new URL("https://mantle.test/@basalt/quotes") }),
    ).toBeUndefined();
  });
});

describe("resolveDemoOperation", () => {
  it("converts an accepted quote into a draft invoice", async () => {
    const quote = (await quotes()).find((q) => q.quoteNumber === "Q-0024");
    if (!quote) throw new Error("missing sample quote");

    const result = await resolveDemoOperation<{
      convertQuoteToInvoice: { invoiceId: string; invoiceNumber: string };
    }>(
      "mutation ConvertQuoteToInvoice($input: ConvertQuoteToInvoiceInput!) { x }",
      { input: { quoteId: quote.rowId } },
    );

    expect(result.convertQuoteToInvoice.invoiceNumber).toBe("INV-0049");

    const invoice = (await invoices()).find(
      (i) => i.rowId === result.convertQuoteToInvoice.invoiceId,
    );
    expect(invoice?.status).toBe("draft");
    expect(invoice?.total).toBe("8680.00");
    expect(invoice?.invoiceLineItems.nodes).toHaveLength(3);

    const converted = (await quotes()).find((q) => q.rowId === quote.rowId);
    expect(converted?.status).toBe("converted");
    expect(converted?.convertedInvoiceId).toBe(invoice?.rowId ?? "");
  });

  it("records a payment against an invoice", async () => {
    const invoice = (await invoices()).find(
      (i) => i.invoiceNumber === "INV-0042",
    );
    if (!invoice) throw new Error("missing sample invoice");

    await resolveDemoOperation(
      "mutation CreatePayment($input: CreatePaymentInput!) { x }",
      {
        input: {
          payment: {
            invoiceId: invoice.rowId,
            amount: "3450.00",
            paidAt: new Date("2026-11-24T00:00:00.000Z"),
          },
        },
      },
    );

    const updated = (await invoices()).find((i) => i.rowId === invoice.rowId);
    expect(updated?.payments.nodes.map((p) => p.amount)).toEqual(["3450.00"]);
  });

  it("applies a stock adjustment to the product", async () => {
    const products = async () =>
      (await resolveDemoOperation<{ products: { nodes: Product[] } }>(PRODUCTS))
        .products.nodes;
    const tote = (await products()).find((p) => p.sku === "TOTE-NAT");
    if (!tote) throw new Error("missing sample product");

    await resolveDemoOperation(
      "mutation CreateInventoryAdjustment($input: CreateInventoryAdjustmentInput!) { x }",
      {
        input: {
          inventoryAdjustment: {
            productId: tote.rowId,
            quantityChange: 20,
            reason: "Restock",
          },
        },
      },
    );

    const restocked = (await products()).find((p) => p.rowId === tote.rowId);
    expect(restocked?.currentQuantity).toBe(tote.currentQuantity + 20);
  });

  it("refuses operations the demo does not support", async () => {
    await expect(
      resolveDemoOperation("mutation ApplyInvoiceCredit { x }"),
    ).rejects.toThrow("not available in the demo");
  });
});
