import { useRouteContext } from "@tanstack/react-router";

import useIsDemo from "@/features/demo/useIsDemo";

/**
 * The signed-in account's subject, passed as `loginHint` on links to the
 * account hub so the hub opens as the same account. Only the subject, never an
 * email or token. Undefined while signed out and in the demo, whose sample
 * session is no real account
 */
const useHubLoginHint = (): string | undefined => {
  const { session } = useRouteContext({ from: "__root__" });
  const isDemo = useIsDemo();

  if (isDemo) return undefined;

  return session?.user?.identityProviderId ?? undefined;
};

export default useHubLoginHint;
