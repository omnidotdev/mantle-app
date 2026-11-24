import { useSessionRefresh } from "@omnidotdev/providers/react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import CommandPalette from "@/components/CommandPalette";
import DefaultCatchBoundary from "@/components/DefaultCatchBoundary";
import NotFound from "@/components/NotFound";
import { isDemoActive, isDemoHref } from "@/features/demo/config";
import { demoSession } from "@/features/demo/session";
import app from "@/lib/config/app.config";
import { publicEnvScript } from "@/lib/config/publicEnv";
import createMetaTags from "@/lib/util/createMetaTags";
import ThemeProvider from "@/providers/ThemeProvider";
import { fetchSession } from "@/server/functions/auth";
import { getPublicEnv } from "@/server/functions/env";
import { getTheme } from "@/server/functions/theme";
import appStyles from "@/styles.css?url";

import type { OrganizationClaim } from "@omnidotdev/providers/auth";
import type { QueryClient } from "@tanstack/react-query";
import type { ErrorComponentProps } from "@tanstack/react-router";
import type { Session } from "better-auth/types";
import type { ReactNode } from "react";
import type { Theme } from "@/server/functions/theme";

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

const fetchSessionAndTheme = createServerFn({
  method: "POST",
}).handler(async () => {
  const [{ session }, theme] = await Promise.all([fetchSession(), getTheme()]);

  return { session, theme };
});

/**
 * The demo's theme without a server round trip on the client: keep the one
 * the page already shows (the server render set it from the theme cookie)
 */
const getDemoTheme = async (): Promise<Theme> =>
  typeof document === "undefined"
    ? getTheme()
    : document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";

// Keep the OAuth access token fresh, except in the demo, which has none
const refreshSession = () => (isDemoActive() ? undefined : fetchSession());

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  session: ExtendedSession | null;
  theme: string;
}>()({
  beforeLoad: async ({ location }) => {
    // The public demo runs on a sample session and never asks the auth server
    // who the visitor is
    if (isDemoHref(location.publicHref)) {
      return { session: demoSession, theme: await getDemoTheme() };
    }

    const { session, theme } = await fetchSessionAndTheme();

    return { session, theme };
  },
  // Public runtime config is fixed for the life of the server process
  loader: () => getPublicEnv(),
  staleTime: Number.POSITIVE_INFINITY,
  head: ({ loaderData }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#f4efe9" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: app.name },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "msapplication-TileColor", content: "#f4efe9" },
      ...createMetaTags({ keywords: app.keywords }),
    ],
    links: [
      { rel: "stylesheet", href: appStyles },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      // .ico fallback for surfaces that don't read SVG favicons (link previews, iMessage)
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
    ],
    scripts: [
      // Inline classic script in <head>, so `window.__ENV__` is set before the
      // deferred client bundle evaluates env.config
      { children: publicEnvScript(loaderData ?? {}) },
    ],
  }),
  component: RootComponent,
  errorComponent: ErrorComponent,
  // Render 404s in-shell: a thrown `notFound()` renders here inside RootDocument
  // (globals + layout), not as a bare unstyled page. Pairs with the router's
  // `defaultNotFoundComponent` for unmatched routes.
  notFoundComponent: () => <NotFound />,
});

function ErrorComponent(props: ErrorComponentProps) {
  return (
    <RootDocument theme="dark">
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  );
}

function RootComponent() {
  // Keep the OAuth access token fresh while the user is idle
  useSessionRefresh(refreshSession);

  const { theme } = useRouteContext({ from: "__root__" });

  return (
    <RootDocument theme={theme}>
      <ThemeProvider theme={theme}>
        <CommandPalette />
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
