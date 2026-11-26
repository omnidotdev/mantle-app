import { useIdentitySync } from "@omnidotdev/providers/react";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import useIsDemo from "@/features/demo/useIsDemo";
import { followSignOut, followSwitch } from "@/lib/auth/followIdentity";

/**
 * Authenticated area gate. Workspace resolution and the app shell live one
 * level deeper, in the `@{$workspaceSlug}` handle layout, so the active
 * workspace is always carried in the URL rather than a global switcher.
 */
export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context: { session } }) => {
    if (!session?.user) throw redirect({ to: "/" });
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { session, authBaseUrl } = Route.useRouteContext();
  const isDemo = useIsDemo();

  // Stay signed in as the same account as Omni: follow a switch or sign-out
  // made in another app. The demo's sample session never asks Gatekeeper
  useIdentitySync({
    authBaseUrl: isDemo ? undefined : authBaseUrl,
    subject: isDemo ? undefined : session?.user?.identityProviderId,
    onSignedOut: followSignOut,
    onSwitched: followSwitch,
  });

  return <Outlet />;
}
