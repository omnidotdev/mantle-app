import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import DefaultCatchBoundary from "@/components/DefaultCatchBoundary";
import NotFound from "@/components/NotFound";
import { createDemoRewrite, isDemoHref } from "@/features/demo/config";
import { routeTree } from "./routeTree.gen";

/**
 * Create the application router with TanStack Query integration.
 */
const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
    },
  });

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    // `/demo/...` serves the sample workspace's routes (see features/demo)
    rewrite: createDemoRewrite(),
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    context: {
      queryClient,
      session: null,
      theme: "dark",
    },
  });

  setupRouterSsrQueryIntegration({ router, queryClient });

  // Keep sample data and real data apart: drop the query cache whenever a
  // navigation enters or leaves the demo
  router.subscribe("onBeforeNavigate", ({ fromLocation, toLocation }) => {
    if (!fromLocation) return;

    const fromDemo = isDemoHref(fromLocation.publicHref);
    if (fromDemo !== isDemoHref(toLocation.publicHref)) queryClient.clear();
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }

  interface HistoryState {
    duplicateFrom?: unknown;
  }

  interface StaticDataRouteOption {
    /** Page title shown in the app top bar (the deepest match with one wins) */
    title?: string;
  }
}

export { getRouter };
