import { Outlet, createFileRoute } from "@tanstack/react-router";

const QuoteLayout = () => <Outlet />;

export const Route = createFileRoute("/_app/@{$workspaceSlug}/quotes/$quoteId")(
  {
    component: QuoteLayout,
  },
);
