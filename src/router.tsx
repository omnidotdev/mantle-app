import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-ssr-query";

import createQueryClient from "@/lib/graphql/queryClient";
import { routeTree } from "./routeTree.gen";

/**
 * Create the application router with TanStack Query integration.
 */
const getRouter = () => {
  const queryClient = createQueryClient();

  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      scrollRestoration: true,
      context: { queryClient },
    }),
    queryClient,
  );

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

export { getRouter };
