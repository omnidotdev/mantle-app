import { describe, expect, it } from "bun:test";

import {
  formatValue,
  matchesFilters,
  parseFieldFilters,
  savableValues,
  serializeFieldFilters,
  toCustomField,
} from "./values";

import type { CustomField } from "./types";

const stage: CustomField = {
  id: "f-stage",
  entity: "person",
  label: "Qualification",
  type: "select",
  options: [
    { id: "lead", label: "Lead" },
    { id: "won", label: "Customer" },
  ],
  position: 0,
};
const services: CustomField = {
  ...stage,
  id: "f-services",
  label: "Services",
  type: "multi_select",
  options: [
    { id: "brand", label: "Brand" },
    { id: "web", label: "Web" },
  ],
};
const budget: CustomField = {
  ...stage,
  id: "f-budget",
  type: "number",
  options: [],
};
const vip: CustomField = {
  ...stage,
  id: "f-vip",
  type: "checkbox",
  options: [],
};

describe("savableValues", () => {
  it("keeps values that fit and drops empty ones", () => {
    expect(
      savableValues(
        {
          "f-stage": "won",
          "f-services": ["web", "brand"],
          "f-budget": 1200,
          "f-vip": false,
        },
        [stage, services, budget, vip],
      ),
    ).toEqual({
      "f-stage": "won",
      "f-services": ["web", "brand"],
      "f-budget": 1200,
    });
  });

  it("drops values for removed fields and options", () => {
    expect(
      savableValues(
        { "f-gone": "x", "f-stage": "partner", "f-services": ["brand", "old"] },
        [stage, services],
      ),
    ).toEqual({ "f-services": ["brand"] });
  });
});

describe("formatValue", () => {
  it("shows option labels and checkbox state as text", () => {
    expect(formatValue(stage, "won")).toBe("Customer");
    expect(formatValue(services, ["brand", "web"])).toBe("Brand, Web");
    expect(formatValue(vip, true)).toBe("Yes");
    expect(formatValue(stage, null)).toBe("");
  });
});

describe("matchesFilters", () => {
  it("matches a select value or a multi-select that includes it", () => {
    const values = { "f-stage": "lead", "f-services": ["web"] };

    expect(matchesFilters(values, { "f-stage": "lead" })).toBe(true);
    expect(matchesFilters(values, { "f-services": "web" })).toBe(true);
    expect(matchesFilters(values, { "f-stage": "won" })).toBe(false);
    expect(matchesFilters(values, {})).toBe(true);
  });
});

describe("field filters in the URL", () => {
  it("round-trips and skips cleared filters", () => {
    const raw = serializeFieldFilters({ "f-stage": "lead", "f-x": "" });

    expect(raw).toBe("f-stage:lead");
    expect(parseFieldFilters(raw)).toEqual({ "f-stage": "lead" });
    expect(parseFieldFilters("")).toEqual({});
  });
});

describe("toCustomField", () => {
  it("rejects unknown types and entities", () => {
    const node = { rowId: "a", entity: "person", label: "X", type: "text" };

    expect(toCustomField(node)?.type).toBe("text");
    expect(toCustomField({ ...node, type: "color" })).toBeNull();
    expect(toCustomField({ ...node, entity: "invoice" })).toBeNull();
  });
});
