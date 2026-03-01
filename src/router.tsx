import { createRouter as createTanStackRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

/**
 * Create the application router
 */
const getRouter = () => {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

export { getRouter };
