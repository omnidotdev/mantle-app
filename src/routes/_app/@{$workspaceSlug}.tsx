import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo } from "react";
import { Toaster } from "sonner";

import AppSidebar from "@/components/core/AppSidebar";
import ErrorBoundary from "@/components/core/ErrorBoundary";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import WorkspaceProvider from "@/providers/WorkspaceProvider";
import { setLastOrgCookie } from "@/server/functions/lastWorkspace";

/**
 * Workspace handle layout. The active workspace is the `@{$workspaceSlug}`
 * segment in the URL (per the Omni URL grammar), never a global switcher: the
 * slug is resolved to an organization here and injected as `organizationId` for
 * every nested route. The last-visited slug is persisted only as a landing hint
 * for `/`, the URL stays authoritative.
 */
export const Route = createFileRoute("/_app/@{$workspaceSlug}")({
  beforeLoad: async ({ context: { session }, params: { workspaceSlug } }) => {
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

    // Remember where the user last was, so `/` can return them here
    await setLastOrgCookie({ data: active.slug });

    return { organizationId: active.id, workspaceSlug: active.slug };
  },
  component: WorkspaceLayout,
});

function WorkspaceLayout() {
  const { session } = Route.useRouteContext();

  const organizations = useMemo(
    () => session?.organizations ?? [],
    [session?.organizations],
  );

  return (
    <WorkspaceProvider organizations={organizations}>
      <SidebarProvider>
        <div className="flex h-dvh w-full">
          <AppSidebar className="print:hidden" />
          <SidebarInset>
            <div className="flex items-center p-2 md:hidden print:hidden">
              <SidebarTrigger />
            </div>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <Toaster position="bottom-right" richColors />
    </WorkspaceProvider>
  );
}
