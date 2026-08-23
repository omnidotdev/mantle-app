import { describe, expect, it } from "bun:test";

import { buildQuoteLineItemInput, sortLineItemsByOrder } from "./lineItems";

import type { QuoteLineItem } from "../types/quote";

describe("buildQuoteLineItemInput", () => {
  it("falls back to safe values when required numerics are blank", () => {
    const input = buildQuoteLineItemInput(
      { description: "Work", quantity: "", unitPrice: "", amount: "" },
      0,
      "quote-1",
    );
    expect(input.quantity).toBe("1");
    expect(input.unitPrice).toBe("0");
    expect(input.amount).toBe("0");
  });

  it("sends blank optional numerics as null, not empty strings", () => {
    const input = buildQuoteLineItemInput(
      { description: "Work", hourlyRate: "", royaltyPercentage: "  " },
      0,
      "quote-1",
    );
    expect(input.hourlyRate).toBeNull();
    expect(input.royaltyPercentage).toBeNull();
  });

  it("parses integer cap fields and nulls blanks", () => {
    const input = buildQuoteLineItemInput(
      { description: "Work", weeklyCapHours: "10", monthlyCapHours: "" },
      0,
      "quote-1",
    );
    expect(input.weeklyCapHours).toBe(10);
    expect(input.monthlyCapHours).toBeNull();
  });

  it("passes through deliverables and acceptance criteria", () => {
    const input = buildQuoteLineItemInput(
      {
        description: "Work",
        deliverables: ["Source code", "Docs"],
        acceptanceCriteria: ["Sign-off"],
      },
      0,
      "quote-1",
    );
    expect(input.deliverables).toEqual(["Source code", "Docs"]);
    expect(input.acceptanceCriteria).toEqual(["Sign-off"]);
  });

  it("stamps sortOrder from the index and the quote id", () => {
    const input = buildQuoteLineItemInput(
      { description: "Work" },
      3,
      "quote-9",
    );
    expect(input.sortOrder).toBe(3);
    expect(input.quoteId).toBe("quote-9");
  });

  it("keeps provided values intact", () => {
    const input = buildQuoteLineItemInput(
      {
        description: "Design",
        quantity: "2",
        unitPrice: "50",
        amount: "100",
        pricingType: "hourly",
        hourlyRate: "150",
      },
      1,
      "quote-1",
    );
    expect(input).toMatchObject({
      description: "Design",
      quantity: "2",
      unitPrice: "50",
      amount: "100",
      pricingType: "hourly",
      hourlyRate: "150",
    });
  });
});

describe("sortLineItemsByOrder", () => {
  const item = (id: string, sortOrder: number): Partial<QuoteLineItem> => ({
    id,
    sortOrder,
  });

  it("orders by sortOrder ascending", () => {
    const sorted = sortLineItemsByOrder([
      item("c", 2),
      item("a", 0),
      item("b", 1),
    ]);
    expect(sorted.map((i) => i.id)).toEqual(["a", "b", "c"]);
  });

  it("is stable for equal sortOrder values", () => {
    const sorted = sortLineItemsByOrder([
      item("x", 0),
      item("y", 0),
      item("z", 0),
    ]);
    expect(sorted.map((i) => i.id)).toEqual(["x", "y", "z"]);
  });

  it("does not mutate the input array", () => {
    const items = [item("b", 1), item("a", 0)];
    sortLineItemsByOrder(items);
    expect(items.map((i) => i.id)).toEqual(["b", "a"]);
  });
});
