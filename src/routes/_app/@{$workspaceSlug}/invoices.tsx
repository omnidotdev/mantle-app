import { Outlet, createFileRoute } from "@tanstack/react-router";

const InvoicesLayout = () => <Outlet />;

export const Route = createFileRoute("/_app/@{$workspaceSlug}/invoices")({
  component: InvoicesLayout,
});
