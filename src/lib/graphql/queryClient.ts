import { QueryClient } from "@tanstack/react-query";

/**
 * Create a TanStack Query client with default options.
 */
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
    },
  });

export default createQueryClient;
