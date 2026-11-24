import { describe, expect, it } from "bun:test";

import {
  planChildSync,
  sameLineItem,
  samePayment,
  savableLineItems,
  savablePayments,
} from "./invoiceChildren";

const payment = (id: string, amount: string, paidAt = "2026-11-24") => ({
  id,
  amount,
  paidAt,
  reference: null,
  method: null,
});

describe("planChildSync", () => {
  it("leaves untouched rows alone", () => {
    const saved = [payment("a", "100.00"), payment("b", "50.00")];
    const plan = planChildSync(saved, [...saved], samePayment);

    expect(plan.create).toEqual([]);
    expect(plan.remove).toEqual([]);
  });

  it("creates new rows and removes deleted ones only", () => {
    const saved = [payment("a", "100.00"), payment("b", "50.00")];
    const edited = [saved[0]!, payment("new", "25.00")];
    const plan = planChildSync(saved, edited, samePayment);

    expect(plan.create.map((p) => p.id)).toEqual(["new"]);
    expect(plan.remove.map((p) => p.id)).toEqual(["b"]);
  });

  it("replaces a changed row", () => {
    const saved = [payment("a", "100.00")];
    const plan = planChildSync(saved, [payment("a", "120.00")], samePayment);

    expect(plan.create.map((p) => p.amount)).toEqual(["120.00"]);
    expect(plan.remove.map((p) => p.id)).toEqual(["a"]);
  });
});

describe("savablePayments", () => {
  it("drops rows without an amount or a date", () => {
    const rows = [
      payment("a", "0"),
      payment("b", "300"),
      { ...payment("c", "10"), paidAt: "" },
    ];

    expect(savablePayments(rows).map((p) => p.id)).toEqual(["b"]);
  });
});

describe("savableLineItems", () => {
  it("drops blank rows and numbers the rest in order", () => {
    const items = savableLineItems([
      { id: "a", description: "First", sortOrder: 4 },
      { id: "b", description: "  " },
      { id: "c", description: "Second", sortOrder: 0 },
    ]);

    expect(items.map((i) => [i.id, i.sortOrder])).toEqual([
      ["a", 0],
      ["c", 1],
    ]);
  });

  it("keeps a reordered item from being treated as unchanged", () => {
    const saved = [{ id: "a", description: "X", sortOrder: 1 }];
    const edited = savableLineItems([
      { id: "a", description: "X", sortOrder: 1 },
    ]);

    expect(planChildSync(saved, edited, sameLineItem).create).toHaveLength(1);
  });
});
