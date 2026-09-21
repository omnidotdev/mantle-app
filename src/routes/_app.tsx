import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Authenticated area gate. Workspace resolution and the app shell live one
 * level deeper, in the `@{$workspaceSlug}` handle layout, so the active
 * workspace is always carried in the URL rather than a global switcher.
 */
export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context: { session } }) => {
    if (!session?.user) throw redirect({ to: "/" });
  },
  component: Outlet,
});
