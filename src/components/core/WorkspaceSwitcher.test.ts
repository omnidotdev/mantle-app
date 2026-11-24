import { describe, expect, it } from "bun:test";

import { getWorkspaceSlugToOpen } from "./WorkspaceSwitcher";

const workspaces = [
  { id: "w1", name: "Personal", slug: "ada" },
  { id: "w2", name: "Analytical Engines", slug: "engines" },
];

describe("getWorkspaceSlugToOpen", () => {
  it("returns the slug of another workspace to navigate to", () => {
    expect(getWorkspaceSlugToOpen(workspaces, "w1", "w2")).toBe("engines");
  });

  it("returns null when the active workspace is chosen", () => {
    expect(getWorkspaceSlugToOpen(workspaces, "w1", "w1")).toBeNull();
  });

  it("returns null for an id not in the list", () => {
    expect(getWorkspaceSlugToOpen(workspaces, "w1", "missing")).toBeNull();
  });

  it("opens the chosen workspace when none is active", () => {
    expect(getWorkspaceSlugToOpen(workspaces, undefined, "w1")).toBe("ada");
  });
});
