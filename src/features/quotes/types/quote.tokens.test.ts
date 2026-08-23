import { describe, expect, it } from "bun:test";

import { applyTermTokens } from "./quote";

describe("applyTermTokens", () => {
  it("substitutes the company name", () => {
    expect(
      applyTermTokens("{companyName} will assist.", {
        companyName: "Omni LLC",
      }),
    ).toBe("Omni LLC will assist.");
  });

  it("falls back to 'We' when the company name is missing", () => {
    expect(applyTermTokens("{companyName} will assist.", {})).toBe(
      "We will assist.",
    );
  });

  it("substitutes the time range and defaults to TBD", () => {
    expect(
      applyTermTokens("Delivery within {timeRange}.", { timeRange: "6 weeks" }),
    ).toBe("Delivery within 6 weeks.");
    expect(applyTermTokens("Delivery within {timeRange}.", {})).toBe(
      "Delivery within TBD.",
    );
  });

  it("replaces every occurrence of a token", () => {
    expect(
      applyTermTokens("{companyName} and {companyName}", {
        companyName: "Acme",
      }),
    ).toBe("Acme and Acme");
  });
});
