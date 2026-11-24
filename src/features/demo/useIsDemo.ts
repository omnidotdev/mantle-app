import { useLocation } from "@tanstack/react-router";

import { isDemoHref } from "@/features/demo/config";

/**
 * Whether the current page is part of the public demo. Reads the public URL
 * from the router, so it agrees between the server render and the client
 */
const useIsDemo = (): boolean =>
  useLocation({ select: (location) => isDemoHref(location.publicHref) });

export default useIsDemo;
