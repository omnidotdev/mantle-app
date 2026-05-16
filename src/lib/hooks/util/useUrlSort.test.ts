import { describe, expect, it } from "bun:test";

import { searchFromSorting, sortingFromSearch } from "./useUrlSort";

describe("sortingFromSearch", () => {
  it("returns default when both params are undefined", () => {
    const result = sortingFromSearch(
      { sortBy: undefined, sortDir: undefined },
      [{ id: "issueDate", desc: true }],
    );
    expect(result).toEqual([{ id: "issueDate", desc: true }]);
  });

  it("builds sorting from url params", () => {
    const result = sortingFromSearch({ sortBy: "total", sortDir: "asc" }, [
      { id: "issueDate", desc: true },
    ]);
    expect(result).toEqual([{ id: "total", desc: false }]);
  });

  it("treats sortDir desc as desc=true", () => {
    const result = sortingFromSearch({ sortBy: "total", sortDir: "desc" }, [
      { id: "issueDate", desc: true },
    ]);
    expect(result).toEqual([{ id: "total", desc: true }]);
  });

  it("falls back to default when only sortBy is set", () => {
    const result = sortingFromSearch({ sortBy: "total", sortDir: undefined }, [
      { id: "issueDate", desc: true },
    ]);
    expect(result).toEqual([{ id: "issueDate", desc: true }]);
  });
});

describe("searchFromSorting", () => {
  it("returns undefined params when sorting matches default", () => {
    const result = searchFromSorting(
      [{ id: "issueDate", desc: true }],
      [{ id: "issueDate", desc: true }],
    );
    expect(result).toEqual({ sortBy: undefined, sortDir: undefined });
  });

  it("returns explicit params when sorting differs from default", () => {
    const result = searchFromSorting(
      [{ id: "total", desc: false }],
      [{ id: "issueDate", desc: true }],
    );
    expect(result).toEqual({ sortBy: "total", sortDir: "asc" });
  });

  it("returns undefined params for empty sorting", () => {
    const result = searchFromSorting([], [{ id: "issueDate", desc: true }]);
    expect(result).toEqual({ sortBy: undefined, sortDir: undefined });
  });
});
