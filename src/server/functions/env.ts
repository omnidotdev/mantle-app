import { createServerFn } from "@tanstack/react-start";

import { collectPublicEnv } from "@/lib/config/publicEnv";

/**
 * Public runtime configuration for the browser, read from the server's live
 * env so one image serves any deployment. The root route injects it as
 * `window.__ENV__`, which `lib/config/env.config` merges on the client
 */
export const getPublicEnv = createServerFn({ method: "POST" }).handler(
  async () => collectPublicEnv(process.env),
);
