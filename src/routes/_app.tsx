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
import OrganizationProvider from "@/providers/OrganizationProvider";
import {
  getLastOrgCookie,
  setLastOrgCookie,
} from "@/server/functions/lastWorkspace";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context: { session } }) => {
    if (!session?.user) throw redirect({ to: "/" });

    const slug = await getLastOrgCookie();
    const orgs = session.organizations ?? [];

    const matched = slug ? orgs.find((o) => o.slug === slug) : undefined;
    const active = matched ?? orgs[0];

    // Persist default when no cookie or cookie didn't match
    if (active && active.slug !== slug) {
      await setLastOrgCookie({ data: active.slug });
    }

    return { organizationId: active?.id };
  },
  component: AuthLayout,
});

function AuthLayout() {
  const { session } = Route.useRouteContext();

  const organizations = useMemo(
    () => session?.organizations ?? [],
    [session?.organizations],
  );

  return (
    <OrganizationProvider organizations={organizations}>
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
    </OrganizationProvider>
  );
}
