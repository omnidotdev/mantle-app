import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import app from "@/lib/config/app.config";
import { fetchMaintenanceMode } from "@/lib/providers";
import createMetaTags from "@/lib/util/createMetaTags";
import { fetchSession } from "@/server/functions/auth";
import appStyles from "@/styles.css?url";

import type { OrganizationClaim } from "@omnidotdev/providers";
import type { QueryClient } from "@tanstack/react-query";
import type { Session } from "better-auth/types";
import type { ReactNode } from "react";

interface ExtendedUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  identityProviderId?: string;
  username?: string;
}

interface ExtendedSession extends Omit<Session, "user"> {
  user: ExtendedUser;
  accessToken?: string;
  organizations?: OrganizationClaim[];
}

const fetchSessionAndMaintenanceMode = createServerFn({
  method: "GET",
}).handler(async () => {
  // Fetch session first to get user email for maintenance mode bypass evaluation
  const { session } = await fetchSession();

  // Pass user context to Unleash for @omni.dev admin bypass
  const context = session?.user?.email
    ? { userId: session.user.id, properties: { email: session.user.email } }
    : undefined;
  const { isMaintenanceMode } = await fetchMaintenanceMode({ data: context });

  return { session, isMaintenanceMode };
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  session: ExtendedSession | null;
  isMaintenanceMode: boolean;
}>()({
  beforeLoad: async () => {
    const { session, isMaintenanceMode } =
      await fetchSessionAndMaintenanceMode();

    // Skip auth when maintenance page is shown
    if (isMaintenanceMode) return { session: null, isMaintenanceMode };

    return { session, isMaintenanceMode };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#18181b" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: app.name },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "msapplication-TileColor", content: "#18181b" },
      ...createMetaTags(),
    ],
    links: [
      { rel: "stylesheet", href: appStyles },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "icon", type: "image/svg+xml", href: "/omni-logo.svg" },
    ],
  }),
  component: RootComponent,
});

function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-zinc-900 to-zinc-800 p-8 text-white">
      <div className="text-center">
        <div className="mb-6 text-9xl">🌋</div>
        <h1 className="mb-4 font-bold text-4xl">Beneath the Surface</h1>
        <p className="max-w-md text-lg text-zinc-300">
          We're shifting some layers. Mantle will resurface shortly.
        </p>
      </div>
    </div>
  );
}

function RootComponent() {
  const { isMaintenanceMode } = useRouteContext({ from: "__root__" });

  if (isMaintenanceMode) {
    return (
      <RootDocument>
        <MaintenancePage />
      </RootDocument>
    );
  }

  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-gray-50">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
