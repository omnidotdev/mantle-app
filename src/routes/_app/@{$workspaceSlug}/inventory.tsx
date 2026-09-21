import { Outlet, createFileRoute } from "@tanstack/react-router";

const InventoryLayout = () => <Outlet />;

export const Route = createFileRoute("/_app/@{$workspaceSlug}/inventory")({
  component: InventoryLayout,
});
