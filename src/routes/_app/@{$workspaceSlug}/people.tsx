import { Outlet, createFileRoute } from "@tanstack/react-router";

const PeopleLayout = () => <Outlet />;

export const Route = createFileRoute("/_app/@{$workspaceSlug}/people")({
  component: PeopleLayout,
});
