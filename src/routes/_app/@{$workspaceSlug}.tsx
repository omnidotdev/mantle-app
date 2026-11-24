import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo } from "react";
import { Toaster } from "sonner";

import AppSidebar from "@/components/core/AppSidebar";
import AppTopBar from "@/components/core/AppTopBar";
import ErrorBoundary from "@/components/core/ErrorBoundary";
import MobileTabBar from "@/components/core/MobileTabBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DemoBanner from "@/features/demo/components/DemoBanner";
import { isDemoHref } from "@/features/demo/config";
import useIsDemo from "@/features/demo/useIsDemo";
import WorkspaceProvider from "@/providers/WorkspaceProvider";
import { setLastOrgCookie } from "@/server/functions/lastWorkspace";

/**
 * Workspace handle layout. The active workspace is the `@{$workspaceSlug}`
 * segment in the URL (per the Omni URL grammar), never a global switcher: the
 * slug is resolved to an organization here and injected as `organizationId` for
 * every nested route. The last-visited slug is persisted only as a landing hint
 * for `/`, the URL stays authoritative.
 *
 * The public demo (`/demo/...`) is this same layout on the sample workspace.
 * It renders in the browser only, where its sample data lives
 */
export const Route = createFileRoute("/_app/@{$workspaceSlug}")({
  ssr: ({ location }) => (isDemoHref(location.publicHref) ? false : undefined),
  beforeLoad: async ({
    context: { session },
    location,
    params: { workspaceSlug },
  }) => {
    const organizations = session?.organizations ?? [];
    const active = organizations.find((org) => org.slug === workspaceSlug);

    // Unknown handle for this user: send them to their default workspace, or
    // back to the public entry if they belong to none
    if (!active) {
      const fallback = organizations[0];

      if (fallback) {
        throw redirect({
          to: "/@{$workspaceSlug}",
          params: { workspaceSlug: fallback.slug },
        });
      }

      throw redirect({ to: "/" });
    }

    // Remember where the user last was, so `/` can return them here (the demo
    // is not somewhere to return to)
    if (!isDemoHref(location.publicHref)) {
      await setLastOrgCookie({ data: active.slug });
    }

    return { organizationId: active.id, workspaceSlug: active.slug };
  },
  component: WorkspaceLayout,
});

function WorkspaceLayout() {
  const { session } = Route.useRouteContext();
  const isDemo = useIsDemo();

  const organizations = useMemo(
    () => session?.organizations ?? [],
    [session?.organizations],
  );

  return (
    <WorkspaceProvider workspaces={organizations}>
      <SidebarProvider>
        <div className="flex min-h-dvh w-full">
          <AppSidebar className="print:hidden" />
          <SidebarInset>
            {isDemo && <DemoBanner />}
            <AppTopBar />
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </SidebarInset>
        </div>
        <MobileTabBar />
      </SidebarProvider>
      <Toaster
        position="bottom-right"
        richColors
        // Clear the phone tab bar
        mobileOffset={{ bottom: "calc(5rem + env(safe-area-inset-bottom))" }}
      />
    </WorkspaceProvider>
  );
}
