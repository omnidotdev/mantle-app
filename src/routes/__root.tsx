import { useSessionRefresh } from "@omnidotdev/providers/react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import DefaultCatchBoundary from "@/components/DefaultCatchBoundary";
import app from "@/lib/config/app.config";
import { fetchMaintenanceMode } from "@/lib/providers";
import createMetaTags from "@/lib/util/createMetaTags";
import ThemeProvider from "@/providers/ThemeProvider";
import { fetchSession } from "@/server/functions/auth";
import { getTheme } from "@/server/functions/theme";
import appStyles from "@/styles.css?url";

import type { OrganizationClaim } from "@omnidotdev/providers/auth";
import type { QueryClient } from "@tanstack/react-query";
import type { ErrorComponentProps } from "@tanstack/react-router";
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

  const [{ isMaintenanceMode }, theme] = await Promise.all([
    fetchMaintenanceMode({ data: context }),
    getTheme(),
  ]);

  return { session, isMaintenanceMode, theme };
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  session: ExtendedSession | null;
  isMaintenanceMode: boolean;
  theme: string;
}>()({
  beforeLoad: async () => {
    const { session, isMaintenanceMode, theme } =
      await fetchSessionAndMaintenanceMode();

    // Skip auth when maintenance page is shown
    if (isMaintenanceMode) return { session: null, isMaintenanceMode, theme };

    return { session, isMaintenanceMode, theme };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#1a0f0a" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: app.name },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "msapplication-TileColor", content: "#1a0f0a" },
      ...createMetaTags(),
    ],
    links: [
      { rel: "stylesheet", href: appStyles },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "icon", type: "image/svg+xml", href: "/omni-logo.svg" },
    ],
  }),
  component: RootComponent,
  errorComponent: ErrorComponent,
});

function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-base-950 to-base-900 p-8 text-base-100">
      <div className="text-center">
        <div className="mb-6 text-9xl">🌋</div>
        <h1 className="mb-4 font-bold text-4xl">Beneath the Surface</h1>
        <p className="max-w-md text-base-400 text-lg">
          We're shifting some layers. Mantle will resurface shortly.
        </p>
      </div>
    </div>
  );
}

function ErrorComponent(props: ErrorComponentProps) {
  return (
    <RootDocument theme="dark">
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  );
}

function RootComponent() {
  // Keep the OAuth access token fresh while the user is idle
  useSessionRefresh(fetchSession);

  const { isMaintenanceMode, theme } = useRouteContext({ from: "__root__" });

  if (isMaintenanceMode) {
    return (
      <RootDocument theme={theme}>
        <MaintenancePage />
      </RootDocument>
    );
  }

  return (
    <RootDocument theme={theme}>
      <ThemeProvider theme={theme}>
        <Outlet />
      </ThemeProvider>
    </RootDocument>
  );
}

function RootDocument({
  children,
  theme,
}: Readonly<{ children: ReactNode; theme: string }>) {
  return (
    <html lang="en" className={theme}>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
