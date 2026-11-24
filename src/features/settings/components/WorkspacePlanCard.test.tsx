import { describe, expect, mock, test } from "bun:test";

import { renderToStaticMarkup } from "react-dom/server";

let plan: unknown = null;

mock.module("@/generated/graphql", () => ({
  useWorkspacePlanQuery: () => ({
    data: { workspacePlan: plan },
    isLoading: false,
    isError: false,
  }),
}));

const { default: WorkspacePlanCard } = await import("./WorkspacePlanCard");

const render = (canManage = true) =>
  renderToStaticMarkup(
    <WorkspacePlanCard
      organizationId="org"
      workspaceSlug="acme"
      canManage={canManage}
      accountBaseUrl="https://account.test"
    />,
  );

const freePlan = (source = "plan") => ({
  tier: "free",
  source,
  limits: [
    { key: "max_team_members", limit: 1, used: null },
    { key: "max_contacts", limit: 50, used: 50 },
    { key: "max_invoices_per_month", limit: 5, used: 2 },
  ],
});

describe("WorkspacePlanCard", () => {
  test("shows the tier and usage against each limit", () => {
    plan = freePlan();
    const html = render();
    expect(html).toContain("Free");
    expect(html).toContain("50 of 50");
    expect(html).toContain("2 of 5");
  });

  test("owners and admins get an upgrade link, members a pointer to them", () => {
    plan = freePlan();
    const owner = render(true);
    expect(owner).toContain("Upgrade");
    expect(owner).toContain(
      "https://account.test/billing?product=mantle&amp;plan=pro&amp;interval=month&amp;workspace=acme",
    );
    const member = render(false);
    expect(member).not.toContain("Upgrade");
    expect(member).toContain("owner or admin can upgrade");
  });

  test("a billing outage is explained without alarming about records", () => {
    plan = freePlan("cached");
    expect(render()).toContain("last known plan");
    expect(render()).toContain("records stay available");
  });

  test("renders nothing when billing is not configured", () => {
    plan = { tier: "unlimited", source: "unconfigured", limits: [] };
    expect(render()).toBe("");
  });
});
