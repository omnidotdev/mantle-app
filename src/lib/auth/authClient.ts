import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type auth from "@/lib/auth/auth";

/**
 * Auth browser client.
 *
 * better-auth 1.7 dropped the generic-oauth client plugin: configured generic
 * providers are first-class social providers now, used through `signIn.social`,
 * so no provider-specific client plugin is needed.
 */
const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
});

export default authClient;
