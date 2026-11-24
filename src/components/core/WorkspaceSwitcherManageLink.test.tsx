import { describe, expect, mock, test } from "bun:test";

import { workspacesUrl } from "@omnidotdev/providers/react";
import { renderToStaticMarkup } from "react-dom/server";

import { ACCOUNT_URL } from "@/lib/config/env.config";

import type { WorkspaceSwitcherProps } from "@omnidotdev/thornberry/workspace-switcher";

let switcherProps: WorkspaceSwitcherProps | undefined;
let publicHref = "/@ada";

// capture the props the real switcher would receive; defined at module level so React sees a stable component
const FakeWorkspaceSwitcher = (props: WorkspaceSwitcherProps) => {
  switcherProps = props;
  return null;
};

mock.module("@omnidotdev/thornberry/workspace-switcher", () => ({
  WorkspaceSwitcher: FakeWorkspaceSwitcher,
}));

mock.module("@tanstack/react-router", () => ({
  useNavigate: () => () => {},
  useRouteContext: () => ({ organizationId: "w1" }),
  useLocation: ({
    select,
  }: {
    select: (location: { publicHref: string }) => unknown;
  }) => select({ publicHref }),
}));

mock.module("@/components/ui/sidebar", () => ({
  useSidebar: () => ({ isMobile: false, setOpenMobile: () => {} }),
}));

mock.module("@/providers/WorkspaceProvider", () => ({
  useWorkspace: () => ({
    workspaces: [{ id: "w1", name: "Personal", slug: "ada" }],
  }),
}));

const { default: WorkspaceSwitcher } = await import("./WorkspaceSwitcher");

describe("WorkspaceSwitcher manage link", () => {
  test("links to the account hub's workspaces page, not identity", () => {
    renderToStaticMarkup(<WorkspaceSwitcher />);

    expect(switcherProps?.manageUrl).toBe(workspacesUrl(ACCOUNT_URL));
    expect(switcherProps?.manageUrl ?? "").not.toContain("identity.");
  });

  test("has no manage link in the demo, whose workspace is sample data", () => {
    publicHref = "/demo/quotes";
    renderToStaticMarkup(<WorkspaceSwitcher />);
    publicHref = "/@ada";

    expect(switcherProps?.manageUrl).toBeUndefined();
  });
});
