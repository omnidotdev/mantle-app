import { describe, expect, it } from "bun:test";

import { searchFromSorting, sortingFromSearch } from "./useUrlSort";

describe("sortingFromSearch", () => {
  it("returns default when both params are undefined", () => {
    const result = sortingFromSearch(
      { sort_by: undefined, sort_dir: undefined },
      [{ id: "issueDate", desc: true }],
    );
    expect(result).toEqual([{ id: "issueDate", desc: true }]);
  });

  it("builds sorting from url params", () => {
    const result = sortingFromSearch({ sort_by: "total", sort_dir: "asc" }, [
      { id: "issueDate", desc: true },
    ]);
    expect(result).toEqual([{ id: "total", desc: false }]);
  });

  it("treats sort_dir desc as desc=true", () => {
    const result = sortingFromSearch({ sort_by: "total", sort_dir: "desc" }, [
      { id: "issueDate", desc: true },
    ]);
    expect(result).toEqual([{ id: "total", desc: true }]);
  });

  it("falls back to default when only sort_by is set", () => {
    const result = sortingFromSearch(
      { sort_by: "total", sort_dir: undefined },
      [{ id: "issueDate", desc: true }],
    );
    expect(result).toEqual([{ id: "issueDate", desc: true }]);
  });

  it("falls back to default when only sort_dir is set", () => {
    const result = sortingFromSearch({ sort_by: undefined, sort_dir: "asc" }, [
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
    expect(result).toEqual({ sort_by: undefined, sort_dir: undefined });
  });

  it("returns explicit params when sorting differs from default", () => {
    const result = searchFromSorting(
      [{ id: "total", desc: false }],
      [{ id: "issueDate", desc: true }],
    );
    expect(result).toEqual({ sort_by: "total", sort_dir: "asc" });
  });

  it("returns undefined params for empty sorting", () => {
    const result = searchFromSorting([], [{ id: "issueDate", desc: true }]);
    expect(result).toEqual({ sort_by: undefined, sort_dir: undefined });
  });

  it("returns explicit desc params for non-default column", () => {
    const result = searchFromSorting(
      [{ id: "total", desc: true }],
      [{ id: "issueDate", desc: true }],
    );
    expect(result).toEqual({ sort_by: "total", sort_dir: "desc" });
  });

  it("returns explicit params when only direction differs from default", () => {
    const result = searchFromSorting(
      [{ id: "issueDate", desc: false }],
      [{ id: "issueDate", desc: true }],
    );
    expect(result).toEqual({ sort_by: "issueDate", sort_dir: "asc" });
  });
});
