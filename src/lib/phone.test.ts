import { describe, expect, it } from "bun:test";

import { formatPhone, getPhoneCountry, resolveRegion, toE164 } from "./phone";

describe("toE164", () => {
  it("normalizes a US national number to E.164 using the default region", () => {
    expect(toE164("(415) 555-2671")).toBe("+14155552671");
    expect(toE164("415-555-2671")).toBe("+14155552671");
    expect(toE164("415.555.2671")).toBe("+14155552671");
    expect(toE164("4155552671")).toBe("+14155552671");
  });

  it("keeps an already-normalized E.164 number stable (idempotent)", () => {
    expect(toE164("+14155552671")).toBe("+14155552671");
    expect(toE164(toE164("(415) 555-2671"))).toBe("+14155552671");
  });

  it("respects an explicit country code regardless of region", () => {
    expect(toE164("+44 20 7946 0000")).toBe("+442079460000");
    // GB national number with GB region
    expect(toE164("020 7946 0000", "GB")).toBe("+442079460000");
  });

  it("handles the 00 international prefix", () => {
    expect(toE164("0044 20 7946 0000")).toBe("+442079460000");
  });

  it("returns null for empty / whitespace input", () => {
    expect(toE164("")).toBeNull();
    expect(toE164("   ")).toBeNull();
    expect(toE164(null)).toBeNull();
    expect(toE164(undefined)).toBeNull();
  });

  it("leaves unparseable values untouched rather than destroying data", () => {
    expect(toE164("ext 204")).toBe("ext 204");
    expect(toE164("call the front desk")).toBe("call the front desk");
  });
});

describe("formatPhone", () => {
  it("renders a stored E.164 number in readable international form", () => {
    expect(formatPhone("+14155552671")).toBe("+1 415 555 2671");
    expect(formatPhone("+442079460000")).toBe("+44 20 7946 0000");
  });

  it("passes through values that are not valid phone numbers", () => {
    expect(formatPhone("ext 204")).toBe("ext 204");
    expect(formatPhone(null)).toBe("");
    expect(formatPhone("")).toBe("");
  });
});

describe("getPhoneCountry", () => {
  it("derives the ISO country from an E.164 number for the flag", () => {
    expect(getPhoneCountry("+14155552671")).toBe("US");
    expect(getPhoneCountry("+442079460000")).toBe("GB");
    expect(getPhoneCountry("+61262146029")).toBe("AU");
  });

  it("returns undefined when no country can be determined", () => {
    expect(getPhoneCountry("ext 204")).toBeUndefined();
    expect(getPhoneCountry(null)).toBeUndefined();
  });
});

describe("resolveRegion", () => {
  it("accepts an ISO alpha-2 code directly", () => {
    expect(resolveRegion("US")).toBe("US");
    expect(resolveRegion("gb")).toBe("GB");
  });

  it("maps common free-text country names to a region", () => {
    expect(resolveRegion("United States")).toBe("US");
    expect(resolveRegion("USA")).toBe("US");
    expect(resolveRegion("United Kingdom")).toBe("GB");
  });

  it("falls back to the default region for unknown / empty input", () => {
    expect(resolveRegion(null)).toBe("US");
    expect(resolveRegion("Freedonia")).toBe("US");
  });
});
